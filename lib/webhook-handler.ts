import { ok, fail, type ApiResponse } from "./api";
import { verifyRazorpaySignature } from "./razorpay";
import { parseRazorpayEvent } from "./razorpay-schema";
import {
  provisionStudentAccess,
  type ProvisioningResult,
  type ProvisioningStore,
} from "./provisioning";

export interface HandlerResponse {
  status: number;
  body: ApiResponse<ProvisioningResult>;
}

const REPLAY_WINDOW_SECONDS = 24 * 60 * 60;

export async function handleRazorpayWebhook(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  store: ProvisioningStore,
  now: () => Date = () => new Date(),
): Promise<HandlerResponse> {
  if (!signatureHeader) {
    return { status: 401, body: fail("missing signature") };
  }
  if (!verifyRazorpaySignature(rawBody, signatureHeader, secret)) {
    return { status: 401, body: fail("invalid signature") };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    return { status: 400, body: fail("malformed json") };
  }

  let event;
  try {
    event = parseRazorpayEvent(parsedJson);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "schema error";
    return { status: 400, body: fail(msg) };
  }

  const ageSec = Math.floor(now().getTime() / 1000) - event.createdAt;
  if (ageSec > REPLAY_WINDOW_SECONDS) {
    return { status: 401, body: fail("event too old (replay window)") };
  }

  try {
    const result = await provisionStudentAccess(event, store);
    return { status: 200, body: ok(result) };
  } catch (err: unknown) {
    // Don't leak internal errors to Razorpay/clients.
    if (process.env.NODE_ENV !== "production" && err instanceof Error) {
      // eslint-disable-next-line no-console
      console.error("provisioning error:", err);
    }
    return { status: 500, body: fail("internal error") };
  }
}

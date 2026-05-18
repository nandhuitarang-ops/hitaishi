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

export async function handleRazorpayWebhook(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  store: ProvisioningStore,
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

  try {
    const result = await provisionStudentAccess(event, store);
    return { status: 200, body: ok(result) };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "provisioning failed";
    // 500 — caller should retry. webhook_events row left unprocessed.
    return { status: 500, body: fail(msg) };
  }
}

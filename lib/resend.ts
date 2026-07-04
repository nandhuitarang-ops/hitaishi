import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM || "noreply@hitaishii.com";

// Check if we have a valid, configured key
export const isRealEmailConfigured =
  !!apiKey &&
  apiKey !== "re_xxx" &&
  !apiKey.startsWith("re_placeholder") &&
  apiKey.trim().length > 0;

const sanitizeFrom = (emailStr: string) => {
  if (emailStr.endsWith("@hitaishi.app")) {
    return emailStr.replace("@hitaishi.app", "@hitaishii.com");
  }
  return emailStr;
};

export const resend = isRealEmailConfigured ? new Resend(apiKey) : null;
export const RESEND_FROM = sanitizeFrom(fromEmail);
export const RESEND_FROM_WELCOME = sanitizeFrom(process.env.WELCOME_EMAIL_FROM || RESEND_FROM);
export const RESEND_FROM_ADMIN = sanitizeFrom(process.env.ADMIN_EMAIL_FROM || RESEND_FROM);
export const RESEND_FROM_MENTOR = sanitizeFrom(process.env.WELCOME_EMAIL_FROM_MENTOR || RESEND_FROM);
export const RESEND_FROM_INSTITUTION = sanitizeFrom(process.env.WELCOME_EMAIL_FROM_INSTITUTION || RESEND_FROM);

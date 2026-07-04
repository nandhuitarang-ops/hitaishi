import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM || "noreply@hitaishii.com";

// Check if we have a valid, configured key
export const isRealEmailConfigured =
  !!apiKey &&
  apiKey !== "re_xxx" &&
  !apiKey.startsWith("re_placeholder") &&
  apiKey.trim().length > 0;

export const resend = isRealEmailConfigured ? new Resend(apiKey) : null;
export const RESEND_FROM = fromEmail;
export const RESEND_FROM_WELCOME = process.env.WELCOME_EMAIL_FROM || RESEND_FROM;
export const RESEND_FROM_ADMIN = process.env.ADMIN_EMAIL_FROM || RESEND_FROM;
export const RESEND_FROM_MENTOR = process.env.WELCOME_EMAIL_FROM_MENTOR || RESEND_FROM;
export const RESEND_FROM_INSTITUTION = process.env.WELCOME_EMAIL_FROM_INSTITUTION || RESEND_FROM;

import { resend, RESEND_FROM, RESEND_FROM_WELCOME, RESEND_FROM_ADMIN, RESEND_FROM_MENTOR, RESEND_FROM_INSTITUTION, isRealEmailConfigured } from "@/lib/resend";
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";
import { OnboardingMatchEmail } from "@/components/emails/OnboardingMatchEmail";
import { SessionScheduledEmail } from "@/components/emails/SessionScheduledEmail";
import { DoubtAssignedEmail } from "@/components/emails/DoubtAssignedEmail";
import { WeeklyDigestEmail } from "@/components/emails/WeeklyDigestEmail";
import { InstitutionPartnerEmail } from "@/components/emails/InstitutionPartnerEmail";
import { MentorWelcomeEmail } from "@/components/emails/MentorWelcomeEmail";
import { AdminNotificationEmail } from "@/components/emails/AdminNotificationEmail";
import { MentorAssignedEmail } from "@/components/emails/MentorAssignedEmail";
import { StudentAssignedEmail } from "@/components/emails/StudentAssignedEmail";
import React from "react";

// Log a mock email to node console for development review
function logMockEmail(to: string, subject: string, data: any) {
  console.log(`
=========================================
[MOCK EMAIL DISPATCH] (Resend Dev Fallback)
To: ${to}
From: ${RESEND_FROM}
Subject: ${subject}
Payload: ${JSON.stringify(data, null, 2)}
=========================================
  `);
}

export async function sendWelcomeEmail(toEmail: string, fullName: string, onboardingLink: string) {
  const subject = "Welcome to Hitaishi! 🚀";
  if (!isRealEmailConfigured || !resend) {
    logMockEmail(toEmail, subject, { fullName, onboardingLink });
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_WELCOME,
      to: toEmail,
      subject,
      react: React.createElement(WelcomeEmail, { fullName, onboardingLink }),
    });
    if (error) throw error;
    return { ok: true, data };
  } catch (err: any) {
    console.error("sendWelcomeEmail failed:", err);
    return { ok: false, error: err.message };
  }
}

export async function sendOnboardingMatchEmail(
  toEmail: string,
  studentName: string,
  mentorName: string,
  mentorIIT: string,
  mentorBranch: string,
  bookingLink: string
) {
  const subject = "Your IITian mentor match is ready! 🎯";
  if (!isRealEmailConfigured || !resend) {
    logMockEmail(toEmail, subject, { studentName, mentorName, mentorIIT, mentorBranch, bookingLink });
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: toEmail,
      subject,
      react: React.createElement(OnboardingMatchEmail, { studentName, mentorName, mentorIIT, mentorBranch, bookingLink }),
    });
    if (error) throw error;
    return { ok: true, data };
  } catch (err: any) {
    console.error("sendOnboardingMatchEmail failed:", err);
    return { ok: false, error: err.message };
  }
}

export async function sendSessionScheduledEmail(
  toEmail: string,
  recipientName: string,
  partnerName: string,
  isMentor: boolean,
  dateStr: string,
  timeStr: string,
  joinLink: string
) {
  const subject = `Session Confirmed: Call with ${partnerName} 🗓️`;
  if (!isRealEmailConfigured || !resend) {
    logMockEmail(toEmail, subject, { recipientName, partnerName, isMentor, dateStr, timeStr, joinLink });
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: toEmail,
      subject,
      react: React.createElement(SessionScheduledEmail, { recipientName, partnerName, isMentor, dateStr, timeStr, joinLink }),
    });
    if (error) throw error;
    return { ok: true, data };
  } catch (err: any) {
    console.error("sendSessionScheduledEmail failed:", err);
    return { ok: false, error: err.message };
  }
}

export async function sendDoubtAssignedEmail(
  toEmail: string,
  mentorName: string,
  studentName: string,
  subjectName: string,
  topic: string,
  doubtLink: string
) {
  const subject = `New doubt assigned from ${studentName}! 📚`;
  if (!isRealEmailConfigured || !resend) {
    logMockEmail(toEmail, subject, { mentorName, studentName, subjectName, topic, doubtLink });
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: toEmail,
      subject,
      react: React.createElement(DoubtAssignedEmail, { mentorName, studentName, subject: subjectName, topic, doubtLink }),
    });
    if (error) throw error;
    return { ok: true, data };
  } catch (err: any) {
    console.error("sendDoubtAssignedEmail failed:", err);
    return { ok: false, error: err.message };
  }
}

export async function sendWeeklyDigestEmail(
  toEmail: string,
  studentName: string,
  mentorName: string,
  completedTasks: number,
  totalTasks: number,
  attendanceRate: string,
  latestMockScore: string,
  mentorFeedback: string
) {
  const subject = "Your Hitaishi Weekly Progress Report card 📊";
  if (!isRealEmailConfigured || !resend) {
    logMockEmail(toEmail, subject, { studentName, mentorName, completedTasks, totalTasks, attendanceRate, latestMockScore, mentorFeedback });
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: toEmail,
      subject,
      react: React.createElement(WeeklyDigestEmail, { studentName, mentorName, completedTasks, totalTasks, attendanceRate, latestMockScore, mentorFeedback }),
    });
    if (error) throw error;
    return { ok: true, data };
  } catch (err: any) {
    console.error("sendWeeklyDigestEmail failed:", err);
    return { ok: false, error: err.message };
  }
}

export async function sendInstitutionPartnerEmail(
  toEmail: string,
  contactName: string,
  schoolName: string,
  onboardingLink: string
) {
  const subject = "Setup your institutional workspace on Hitaishi 🏫";
  if (!isRealEmailConfigured || !resend) {
    logMockEmail(toEmail, subject, { contactName, schoolName, onboardingLink });
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_INSTITUTION,
      to: toEmail,
      subject,
      react: React.createElement(InstitutionPartnerEmail, { contactName, schoolName, onboardingLink }),
    });
    if (error) throw error;
    return { ok: true, data };
  } catch (err: any) {
    console.error("sendInstitutionPartnerEmail failed:", err);
    return { ok: false, error: err.message };
  }
}

export async function sendMentorWelcomeEmail(
  toEmail: string,
  fullName: string,
  onboardingLink: string
) {
  const subject = "Welcome to Hitaishi Mentorship! 🚀";
  if (!isRealEmailConfigured || !resend) {
    logMockEmail(toEmail, subject, { fullName, onboardingLink });
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_MENTOR,
      to: toEmail,
      subject,
      react: React.createElement(MentorWelcomeEmail, { fullName, onboardingLink }),
    });
    if (error) throw error;
    return { ok: true, data };
  } catch (err: any) {
    console.error("sendMentorWelcomeEmail failed:", err);
    return { ok: false, error: err.message };
  }
}

export async function sendAdminNotificationEmail(
  leadType: string,
  name: string,
  email: string,
  details: Record<string, any>
) {
  const toEmail = "zeridex.com@gmail.com";
  const subject = `New Lead Submitted: ${leadType} — Hitaishi 🚀`;
  if (!isRealEmailConfigured || !resend) {
    logMockEmail(toEmail, subject, { leadType, name, email, details });
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_ADMIN,
      to: toEmail,
      subject,
      react: React.createElement(AdminNotificationEmail, { leadType, name, email, details }),
    });
    if (error) throw error;
    return { ok: true, data };
  } catch (err: any) {
    console.error("sendAdminNotificationEmail failed:", err);
    return { ok: false, error: err.message };
  }
}

export async function sendMentorAssignedEmail(
  toEmail: string,
  studentName: string,
  mentorName: string,
  dashboardLink: string
) {
  const subject = "You've been matched with an IITian mentor! 🎯";
  if (!isRealEmailConfigured || !resend) {
    logMockEmail(toEmail, subject, { studentName, mentorName, dashboardLink });
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: toEmail,
      subject,
      react: React.createElement(MentorAssignedEmail, { studentName, mentorName, dashboardLink }),
    });
    if (error) throw error;
    return { ok: true, data };
  } catch (err: any) {
    console.error("sendMentorAssignedEmail failed:", err);
    return { ok: false, error: err.message };
  }
}

export async function sendStudentAssignedEmail(
  toEmail: string,
  mentorName: string,
  studentName: string,
  studentClass: string,
  dashboardLink: string
) {
  const subject = `New student assigned: ${studentName} 📚`;
  if (!isRealEmailConfigured || !resend) {
    logMockEmail(toEmail, subject, { mentorName, studentName, studentClass, dashboardLink });
    return { ok: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_MENTOR,
      to: toEmail,
      subject,
      react: React.createElement(StudentAssignedEmail, { mentorName, studentName, studentClass, dashboardLink }),
    });
    if (error) throw error;
    return { ok: true, data };
  } catch (err: any) {
    console.error("sendStudentAssignedEmail failed:", err);
    return { ok: false, error: err.message };
  }
}

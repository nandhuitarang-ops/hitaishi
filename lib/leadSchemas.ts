import { z } from "zod";

// Honeypot field: rendered hidden in every form. Bots fill every input;
// real users never see it. If it has any value the API drops the lead.
const honeypot = z.string().max(120).optional().or(z.literal(""));

const phone = z.string().regex(/^[\d+\-\s()]{7,20}$/, { message: "Please enter a valid phone number (7-20 digits, + - ( ) allowed)" });
const optionalPhone = z.string().regex(/^[\d+\-\s()]{0,20}$/).optional().or(z.literal(""));

export const studentInquirySchema = z.object({
  type: z.literal("student-inquiry"),
  name: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email().max(254),
  phone,
  currentClass: z.string().trim().min(1).max(60),
  coachingInstitute: z.string().trim().max(160).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(120),
  website: honeypot,
});

export const institutionPartnerSchema = z.object({
  type: z.literal("institution-partner"),
  institutionName: z.string().trim().min(1).max(160),
  contactPerson: z.string().trim().min(1).max(120),
  role: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone,
  city: z.string().trim().min(1).max(120),
  studentCount: z.string().trim().min(1).max(40),
  partnershipModel: z.string().trim().min(1).max(120),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  website: honeypot,
});

export const mentorApplicationSchema = z.object({
  type: z.literal("mentor-application"),
  name: z.string().trim().min(1, { message: "Please enter your full name" }).max(120),
  email: z.string().trim().email({ message: "Please enter a valid email address" }).max(254),
  phone,
  city: z.string().trim().min(1, { message: "Please enter your city" }).max(120),
  gender: z.string().trim().max(40).optional().or(z.literal("")),
  institute: z.string().trim().min(1, { message: "Please enter your institute name" }).max(120),
  branch: z.string().trim().min(1, { message: "Please enter your branch of study" }).max(120),
  yearOfStudy: z.string().trim().min(1, { message: "Required" }).max(40),
  jeeExam: z.string().trim().min(1, { message: "Required" }).max(40),
  jeeYear: z.string().trim().regex(/^\d{4}$/, { message: "Year must be a 4-digit number (e.g. 2024)" }),
  jeeRank: z.string().trim().min(1, { message: "Required" }).max(40),
  subjects: z.array(z.string().max(60)).min(1, { message: "Select at least one subject" }).max(10),
  preferredLevel: z.string().trim().min(1, { message: "Select at least one batch" }).max(80),
  languages: z.array(z.string().max(40)).min(1, { message: "Select at least one language" }).max(10),
  weeklyHours: z.string().trim().min(1, { message: "Enter your weekly availability" }).max(20),
  preferredSlots: z.array(z.string().max(40)).min(1, { message: "Select at least one time slot" }).max(10),
  motivation: z.string().trim().min(20, { message: "Tell us at least 20 characters about why you want to mentor" }).max(2000),
  priorExperience: z.string().trim().max(2000).optional().or(z.literal("")),
  website: honeypot,
});

export const generalInquirySchema = z.object({
  type: z.literal("general"),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: optionalPhone,
  role: z.enum(["Student", "Mentor", "Institution", "Other"]),
  message: z.string().trim().min(5).max(2000),
  website: honeypot,
});

export const leadSchema = z.discriminatedUnion("type", [
  studentInquirySchema,
  institutionPartnerSchema,
  mentorApplicationSchema,
  generalInquirySchema,
]);

export type LeadPayload = z.infer<typeof leadSchema>;

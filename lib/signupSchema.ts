import { z } from "zod";

// Honeypot: hidden field, real users never fill it. API drops the signup if set.
const honeypot = z.string().max(120).optional().or(z.literal(""));

const phone = z.string().regex(/^[\d+\-\s()]{7,20}$/, "Enter a valid phone number");
const optionalPhone = z
  .string()
  .regex(/^[\d+\-\s()]{0,20}$/)
  .optional()
  .or(z.literal(""));

export const CLASSES = ["Class 11", "Class 12", "Dropper / Repeater", "Other"] as const;
export const BOARDS = ["CBSE", "ICSE", "State board"] as const;
export const GENDERS = ["female", "male", "non-binary", "prefer-not-to-say"] as const;
export const TARGET_EXAMS = ["jee_main", "jee_advanced", "both"] as const;
export const TARGET_YEARS = ["2026", "2027", "2028"] as const;
export const SUBJECTS = ["physics", "chemistry", "math"] as const;
export const STRENGTH_LEVELS = ["strong", "ok", "struggling"] as const;

const subjectFocusItem = z.object({
  subject: z.enum(SUBJECTS),
  level: z.enum(STRENGTH_LEVELS),
});

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128)
  .regex(/[A-Za-z]/, "Add at least one letter")
  .regex(/\d/, "Add at least one number");

// date_of_birth is stored as a Postgres date (YYYY-MM-DD).
const dateOfBirth = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker")
  .refine((d) => {
    const dt = new Date(d + "T00:00:00Z");
    const min = new Date("1900-01-01T00:00:00Z");
    return dt >= min && dt <= new Date();
  }, "Enter a valid date of birth");

const pincode = z.string().regex(/^\d{6}$/, "Enter a 6-digit pincode");

export const studentSignupSchema = z
  .object({
    type: z.literal("student-signup"),
    email: z.string().trim().email("Enter a valid email").max(254),
    password,
    confirmPassword: z.string().min(1, "Confirm your password"),
    fullName: z.string().trim().min(1, "Required").max(120),
    dateOfBirth,
    gender: z.enum(GENDERS).optional().or(z.literal("")),
    phone,
    parentName: z.string().trim().max(120).optional().or(z.literal("")),
    parentPhone: optionalPhone,
    addressLine1: z.string().trim().min(1, "Required").max(255),
    city: z.string().trim().min(1, "Required").max(120),
    state: z.string().trim().min(1, "Required").max(120),
    pincode,
    currentClass: z.enum(CLASSES),
    board: z.enum(BOARDS),
    coachingInstitute: z.string().trim().max(160).optional().or(z.literal("")),
    targetExam: z.enum(TARGET_EXAMS),
    targetYear: z.enum(TARGET_YEARS),
    targetRank: z.string().regex(/^\d{1,5}$/, "Enter a rank between 1 and 50000").optional().or(z.literal("")),
    aimText: z.string().trim().max(2000).optional().or(z.literal("")),
    subjectsFocus: z.array(subjectFocusItem).min(1, "Rate at least one subject"),
    website: honeypot,
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type StudentSignupValues = z.infer<typeof studentSignupSchema>;
export type SubjectFocus = z.infer<typeof subjectFocusItem>;

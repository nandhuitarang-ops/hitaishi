import { describe, it, expect } from "vitest";
import { studentSignupSchema } from "./signupSchema";

const valid = {
  type: "student-signup" as const,
  email: "anjali@example.com",
  password: "secret123",
  confirmPassword: "secret123",
  fullName: "Anjali Sharma",
  dateOfBirth: "2008-05-12",
  gender: "female",
  phone: "+91 98765 43210",
  parentName: "Ravi Sharma",
  parentPhone: "+91 98765 11111",
  addressLine1: "12 MG Road, Andheri",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400001",
  currentClass: "Class 12",
  board: "CBSE",
  coachingInstitute: "FIITJEE",
  targetExam: "jee_main",
  targetYear: "2026",
  targetRank: "500",
  aimText: "I want to crack JEE Advanced.",
  subjectsFocus: [{ subject: "physics", level: "ok" }],
  website: "",
};

describe("studentSignupSchema", () => {
  it("accepts a complete valid payload", () => {
    const r = studentSignupSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("accepts empty optional fields", () => {
    const r = studentSignupSchema.safeParse({
      ...valid,
      gender: "",
      parentName: "",
      parentPhone: "",
      coachingInstitute: "",
      targetRank: "",
      aimText: "",
    });
    expect(r.success).toBe(true);
  });

  it("rejects a short password", () => {
    const r = studentSignupSchema.safeParse({ ...valid, password: "ab1", confirmPassword: "ab1" });
    expect(r.success).toBe(false);
  });

  it("rejects a password with no number", () => {
    const r = studentSignupSchema.safeParse({
      ...valid,
      password: "abcdefgh",
      confirmPassword: "abcdefgh",
    });
    expect(r.success).toBe(false);
  });

  it("rejects mismatched confirmPassword", () => {
    const r = studentSignupSchema.safeParse({ ...valid, confirmPassword: "different1" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const msg = r.error.issues.find((i) => i.path[0] === "confirmPassword")?.message;
      expect(msg).toMatch(/match/i);
    }
  });

  it("rejects an invalid email", () => {
    const r = studentSignupSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects an invalid phone", () => {
    const r = studentSignupSchema.safeParse({ ...valid, phone: "abc" });
    expect(r.success).toBe(false);
  });

  it("rejects a pincode that is not 6 digits", () => {
    expect(studentSignupSchema.safeParse({ ...valid, pincode: "50001" }).success).toBe(false);
    expect(studentSignupSchema.safeParse({ ...valid, pincode: "500001A" }).success).toBe(false);
  });

  it("rejects an invalid or future date of birth", () => {
    expect(studentSignupSchema.safeParse({ ...valid, dateOfBirth: "2050-01-01" }).success).toBe(false);
    expect(studentSignupSchema.safeParse({ ...valid, dateOfBirth: "1899-01-01" }).success).toBe(false);
    expect(studentSignupSchema.safeParse({ ...valid, dateOfBirth: "12-05-2008" }).success).toBe(false);
  });

  it("rejects missing required address fields", () => {
    expect(studentSignupSchema.safeParse({ ...valid, city: "" }).success).toBe(false);
    expect(studentSignupSchema.safeParse({ ...valid, state: "" }).success).toBe(false);
  });

  it("rejects an empty subjectsFocus array", () => {
    const r = studentSignupSchema.safeParse({ ...valid, subjectsFocus: [] });
    expect(r.success).toBe(false);
  });

  it("rejects an invalid targetExam enum value", () => {
    expect(studentSignupSchema.safeParse({ ...valid, targetExam: "neet" }).success).toBe(false);
  });

  it("rejects an invalid targetYear enum value", () => {
    expect(studentSignupSchema.safeParse({ ...valid, targetYear: "2030" }).success).toBe(false);
  });

  it("accepts a honeypot value (filtering happens at the API layer)", () => {
    const r = studentSignupSchema.safeParse({ ...valid, website: "https://spam.test" });
    expect(r.success).toBe(true);
  });

  it("rejects an out-of-range targetRank", () => {
    expect(studentSignupSchema.safeParse({ ...valid, targetRank: "999999" }).success).toBe(false);
  });
});

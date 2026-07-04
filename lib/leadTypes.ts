export type LeadType =
  | "student-inquiry"
  | "mentor-application"
  | "institution-partner"
  | "general";

export type StudentInquiry = {
  type: "student-inquiry";
  name: string;
  email: string;
  phone: string;
  currentClass: string;
  coachingInstitute?: string;
  city: string;
};

export type InstitutionPartner = {
  type: "institution-partner";
  institutionName: string;
  contactPerson: string;
  role: string;
  email: string;
  phone: string;
  city: string;
  studentCount: string;
  partnershipModel: string;
  message?: string;
  /** Synthesised from contactPerson for the unified leads list */
  name: string;
};

export type MentorApplication = {
  type: "mentor-application";
  name: string;
  email: string;
  phone: string;
  city: string;
  gender?: string;
  institute: string;
  branch: string;
  yearOfStudy: string;
  jeeExam: string;
  jeeYear: string;
  jeeRank: string;
  subjects: string[];
  preferredLevel: string;
  languages: string[];
  weeklyHours: string;
  preferredSlots: string[];
  motivation: string;
  priorExperience?: string;
};

export type GeneralInquiry = {
  type: "general";
  name: string;
  email: string;
  phone?: string;
  role: "Student" | "Mentor" | "Institution" | "Other";
  message: string;
};

export type LeadInput =
  | StudentInquiry
  | InstitutionPartner
  | MentorApplication
  | GeneralInquiry;

export type Lead = LeadInput & {
  id: string;
  createdAt: string;
};

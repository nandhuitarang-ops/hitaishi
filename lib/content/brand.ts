export const BRAND = {
  name: "Hitaishii",
  tagline: "Your Wellwisher in the JEE Journey",
  positioning: "Coaching gives you the syllabus. Hitaishii gives you the edge.",
  domain: "hitaishii.com",
  city: "Hyderabad, India",
  whatsapp: "+91 99640 81555",
  email: "hello@hitaishii.com",
} as const;

export const NAV_LINKS = [
  { href: "/students", label: "Students" },
  { href: "/mentors", label: "Mentors" },
  { href: "/institution", label: "Institutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export const PRIMARY_CTAS = {
  student: { href: "/student-onboarding", label: "I'm a Student" },
  mentor: { href: "/become-a-mentor", label: "Become a Mentor" },
  institution: { href: "/institution", label: "Partner With Us" },
  pricing: { href: "/pricing", label: "See Full Pricing" },
} as const;

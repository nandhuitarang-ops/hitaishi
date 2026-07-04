export const BRAND = {
  name: "Hitaishi",
  tagline: "Your Wellwisher in the JEE Journey",
  positioning: "Coaching gives you the syllabus. Hitaishi gives you the edge.",
  domain: "hitaishi.in",
  city: "Hyderabad, India",
  whatsapp: "+91 99640 81555",
  email: "hello@hitaishi.in",
} as const;

export const NAV_LINKS = [
  { href: "/students", label: "Students" },
  { href: "/mentors", label: "Mentors" },
  { href: "/institutions", label: "Institutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export const PRIMARY_CTAS = {
  student: { href: "/students#get-mentor", label: "I'm a Student" },
  mentor: { href: "/become-a-mentor", label: "Become a Mentor" },
  institution: { href: "/institutions#partner", label: "Partner With Us" },
  pricing: { href: "/pricing", label: "See Full Pricing" },
} as const;

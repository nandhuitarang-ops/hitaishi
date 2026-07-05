export const HERO = {
  eyebrow: "JEE Mentorship · Flexible · Institutional & Personal",
  headline: "The mentor you wished you had for JEE.",
  subhead:
    "Hitaishi pairs JEE aspirants with IITian & top-ranker mentors — on their schedule, around their coaching, wherever they are. For students, directly. For institutions, seamlessly integrated.",
  trustLine: "Mentors from IITs & NITs · Flexible scheduling · Works alongside any coaching",
  pullQuote: "From aspirations to achievements — with guidance",
  image: {
    src: "/images/hitaishi/student-night-study-v2.png",
    alt: "A JEE aspirant studying late at a desk under a warm lamp — the moment a wellwisher steps in.",
  },
} as const;

export const PROBLEM = {
  headline: "Coaching gives you knowledge. But who gives you clarity?",
  body: "Every JEE aspirant has been there — confused about which chapter to prioritise, unsure if their strategy is right, overwhelmed but afraid to ask. Coaching classes don't have time for that. Parents can't help. Friends are in the same boat. That gap is exactly what Hitaishi was built to fill.",
  without: {
    title: "Without Hitaishi",
    body: "Generic advice. No one who truly knows your schedule, your weaknesses, your specific situation.",
  },
  with: {
    title: "With Hitaishi",
    body: "A mentor who gets your life — your coaching, your hostel, your doubts — and guides you personally.",
  },
} as const;

export const AUDIENCES = [
  {
    href: "/students",
    eyebrow: "Students",
    title: "Everything you need to crack JEE — in one person.",
    label: "I'm a student →",
  },
  {
    href: "/mentors",
    eyebrow: "Mentors",
    title: "Turn your JEE journey into someone else's breakthrough.",
    label: "I want to mentor →",
  },
  {
    href: "/institution",
    eyebrow: "Institutions",
    title: "Your students deserve more than what a classroom alone can give.",
    label: "Partner with us →",
  },
] as const;

export const PRICING_TEASER = {
  eyebrow: "Pricing",
  headline: "Mentorship that fits your goals — and your budget.",
  body: "Pick a plan built around how much guidance you want. Start small, upgrade anytime, cancel whenever. Institutions get custom partnership pricing.",
} as const;

export const CLOSING_CTA = {
  headline:
    "Every JEE topper had someone who believed in them. Be the student who had Hitaishi.",
  body: "Start your journey with a mentor who genuinely wants to see you succeed — because Hitaishi means wellwisher, and that's not just our name. It's our promise.",
} as const;

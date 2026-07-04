/**
 * CLIENT TODO: replace `priceMonthly: null` with real INR amounts and set
 * GST_TREATMENT to the appropriate wording ("Inclusive of 18% GST" etc).
 * Plan cards render an amber "Pricing — Coming Soon" pill while null.
 */

export type Plan = {
  id: "starter" | "standard" | "intensive";
  name: string;
  bestFor: string;
  priceMonthly: number | null;
  sessions: number;
  features: string[];
  mostPopular?: boolean;
};

export const STUDENT_PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    bestFor: "trying out mentorship before going all-in.",
    priceMonthly: null,
    sessions: 2,
    features: [
      "2 1-on-1 mentor sessions per month",
      "Doubt clearing over chat between sessions",
      "Basic study planning",
      "Progress notes after each session",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    bestFor: "aspirants who want steady, structured guidance alongside coaching.",
    priceMonthly: null,
    sessions: 4,
    mostPopular: true,
    features: [
      "4 1-on-1 mentor sessions per month",
      "Unlimited doubt clearing",
      "Personalised exam strategy & study plan",
      "Motivation & mental-game support",
      "Progress tracking & honest feedback",
    ],
  },
  {
    id: "intensive",
    name: "Intensive",
    bestFor: "droppers and final-stretch aspirants who want maximum support.",
    priceMonthly: null,
    sessions: 8,
    features: [
      "8 1-on-1 mentor sessions per month",
      "Priority mentor matching",
      "Weekly check-ins",
      "Mock-test review & analysis",
    ],
  },
];

export const GST_TREATMENT: string | null = null;

export const FINE_PRINT = [
  "All plans are month-to-month. Upgrade, downgrade, pause, or cancel anytime.",
  "Every plan connects you with a vetted IITian or JEE top-ranker — never a junior tutor.",
  "Prices shown are per student, per month.",
];

export const INSTITUTIONAL_PRICING = {
  headline: "Custom pricing for institutions.",
  body: "Every institution is different — batch sizes, schedules, and partnership models vary. We price institutional programs based on student volume and how deeply you want mentorship integrated, with flexible models: add-on service, fee-structure integration, or a pilot batch.",
  highlights: [
    "Volume-based per-student pricing",
    "Dedicated account support",
    "Student progress reporting dashboard",
    "Co-branding options for early partners",
  ],
  earlyPartnerNote:
    "Early institutional partners get priority mentor allocation and preferential pricing.",
};

export const PRICING_FAQ = [
  {
    q: "Are there any hidden charges or registration fees?",
    a: "No. The price you see is the price you pay — no registration fee and no hidden charges.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Yes. All student plans are month-to-month — upgrade, downgrade, pause, or cancel anytime.",
  },
  {
    q: "Do I get the same quality of mentor on every plan?",
    a: "Yes. Every plan connects you with a vetted IITian or JEE top-ranker. Higher plans give you more sessions and added support — not a different tier of mentor.",
  },
  {
    q: "How is institutional pricing decided?",
    a: "Institutional pricing is custom, based on student volume and your chosen partnership model. Reach out via Partner With Us and we'll put together a quote.",
  },
];

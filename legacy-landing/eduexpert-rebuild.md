# EduExpert Website — Full Rebuild Reference
> This document has everything needed to rebuild eduexpert.in from scratch in Next.js + Framer Motion.
> Images = placeholders for now. Client will provide real ones later.

---

## 1. BUSINESS INFO (Real — Use This Everywhere)

| Field | Value |
|---|---|
| Business Name | EduExpert |
| Tagline | Study Abroad Consulting — Expert Guidance for a Seamless Study Abroad Journey |
| Phone 1 | +91 99640 81555 |
| Phone 2 | +91 95386 71555 |
| Email 1 | info@eduexpert.in |
| Email 2 | admission@eduexpert.in |
| Address | New Central Jail Road, GK Layout, Hosa Road, PO, Electronic City, Bengaluru, Karnataka 560100 |
| Hours | Monday – Friday, 09:00 AM – 05:00 PM |
| Google Maps | Lat: 12.8399, Lng: 77.6770 (Electronic City, Bengaluru — corrected) |

---

## 2. NAVIGATION STRUCTURE

```
Home | Coaching | Visa | About Us | Country | Blog | Contact
```

**Issues to fix:**
- Remove language switcher (Arabic/Bangla do nothing — broken feature)
- Remove or implement Search (currently javascript:void — does nothing)
- Fix Coaching link (page currently returns server error — need to create this page)

---

## 3. PAGE-BY-PAGE CONTENT

---

### PAGE 1 — HOME

#### Hero Section
- **Heading:** Study Abroad Consulting
- **Subheading:** Expert Guidance for a Seamless Study Abroad Journey
- **Bullet points:**
  - Personalized Consultation
  - Visa & Documentation Assistance
  - Cultural & Academic Support
- **CTA Button 1:** Book Appointment → `/contact`
- **CTA Button 2:** Read Story → `/about` *(currently broken — points to /contact)*

#### Partner Logos Section
- **Heading:** We're proud to work with our preferred partners
- **Status:** 7 partner logo images exist but all link to `#`
- **Fix:** Get real partner names from client OR remove section entirely
- **Placeholder:** Show logo placeholders with grey boxes until client provides

#### Visa Types Section
- **Heading:** Visa types and eligibility assessment
- **Cards:**
  1. Tourist Visa — "Visit new places to discover with a Tourist Visa. We deliver your documents..."
  2. Commercial Visa — "Developing your trade, setting up new sales channels. Your visa is ready..."
  3. Student Visa — "Embarking on a journey of higher education in a foreign country opens doors to..."
  4. Residence Visa — "Expert Guidance for a Seamless Immigration Journey..."
  5. Working Visa — "Get your Visa now for new business and earning opportunities..."
- **Fix:** All 5 cards have empty `<>` href — link each to `/visa` or individual visa detail pages

#### How It Works Section
- **Heading:** Dependable and Trustworthy Visa & Immigration Guidance
- **Subtext:** Our team of seasoned professionals understands the complexities of immigration laws and visa procedures.
- **Steps:**
  1. Choose your visa type — Determine the Visa type for your travel purpose.
  2. Contact our branches — Start your transaction by applying to our branches.
  3. Submit All Your Documents — Collect all the required documents for the process.
  4. Passport delivery — Receive your visa, which is finalized after application.

#### Stats Section
- **Heading:** Discovering Our Biggest Successes
- **Current values:** 00+, 00K+, 00K+, 00K+ (all blank — client must fill)
- **Labels:** Visa Categories | Visa Process | Successful Project | Pro Consultants
- **Fix:** Replace zeros with real numbers — ASK CLIENT before launch

#### Country Section
- **Heading:** Make Your Choice for the Preferred Nation
- **Subtext:** Choosing the ideal destination for immigration is a pivotal decision that can shape the trajectory of your life.
- **Tab filters:** Europe | North America | Asia | Latin America | Oceania | Africa | Antarctica
- **Fix:** Currently all tabs show same European countries. Tab filtering is broken.
- **Real countries available:** Canada, Belgium, Denmark, Australia, France, Germany, Greece, Hungary, Iceland, Ireland, Italy, Luxembourg
- **All are European/allied — only "Europe" tab makes sense for now**
- **Fix:** Either show only Europe tab OR ask client which countries they cover per continent

#### Team Section
- **Heading:** Our trusted immigration support team
- **Current:** 6 fake template names with stock photos — all linking to wp.xpressbuddy.com
- **Fix:** REPLACE ENTIRELY — ask client for real team names, photos, designations
- **Placeholder:** Use grey avatar placeholders with "Team Member" label until client provides

#### Testimonials Section
- **Heading:** Happy Clients Reflect on Their Journey with Us
- **Current:** 2 fake names (Goladria Gomez, Marinda Dilendira) — same review repeated twice
- **Fix:** Ask client for real testimonials. Use placeholders in the meantime.

#### FAQ Section
- **Heading:** Common questions answered
- **Questions (keep these — they're real questions):**
  1. What services do you offer?
  2. What is the consultation process like?
  3. How much do your services cost?
  4. How do I get started with your services?
  5. What is your success rate with visa applications?
- **Current answers:** All 5 have EXACT SAME copy-pasted answer — completely wrong
- **Fix:** Write proper unique answers for each OR use placeholders and ask client

#### Blog Section
- **Heading:** Cast Your Eyes Upon Our Newest Article
- **Show latest 3 posts** — links are real and work
- **Fix:** Display real post data — not hardcoded

#### Newsletter Section
- **Heading:** Subscribe to the free newsletter to receive the latest news & case studies!
- **Fix:** Hook up to real email service (Mailchimp / Resend etc.) — currently does nothing

---

### PAGE 2 — VISA

#### Hero/Banner
- **Heading:** Visa
- **Breadcrumb:** Eduexpert > Visa

#### Visa Cards Section
- **Heading:** Visa types and eligibility assessment
- **Cards (6 total):**
  1. Tourist Visa — "Visit new places to discover with a Tourist Visa. We deliver your documents..."
  2. Commercial Visa — "Developing your trade, setting up new sales channels. Your visa is ready..."
  3. Diplomatic Visa — "For government officials, diplomats, and representatives of international..."
  4. Student Visa — "Embarking on a journey of higher education in a foreign country opens doors to..."
  5. Residence Visa — "Expert Guidance for a Seamless Immigration Journey..."
  6. Working Visa — "Get your Visa now for new business and earning opportunities..."
- **Fix:** All 6 cards link to `wp.xpressbuddy.com` — should link to individual visa detail pages or `/contact`

#### WRONG CONTENT — DELETE THIS
- Section on Visa page shows: "Certified Tutors, Doubt Solving Sessions, Flexible Batches, Free study materials"
- This is COACHING content on the VISA page — complete mistake — remove entirely

#### Country Section
- Same as homepage country section — apply same fix

---

### PAGE 3 — ABOUT

#### Hero/Banner
- **Heading:** About
- **Subheading:** Committed to Your Visa Success
- **Description:** "We deliver budget-friendly visa solutions, removing financial barriers from your journey. Our goal is to provide quality services at reasonable rates."

#### Mission Section
- **Heading:** Guiding Your Path with Our Immigration Mission
- **Body:** "We're here to simplify immigration complexities, guiding you to success. Our mission is to unite families, open opportunities, and make your journey enriching. Your dreams are our focus on the path to a brighter future."

#### History Section
- **Heading:** Our Immigration Service history
- **Body:** "Our history began with a vision to make the immigration process smoother and more accessible for individuals and families around the world. With a deep understanding of the challenges that accompany moving to a new country..."

#### Stats Section
- Same as homepage — all zeros, need real numbers from client
  - We Have Worked With Clients: 00K
  - Successful Visa Process Rate: 00%
  - Application Approval Processing Time: 00DAY

#### Team Section
- **Heading:** Our trusted immigration support team
- **Current:** 8 fake template names — all link to wp.xpressbuddy.com
  - Esther Howard — Legal Advisor
  - Annette Black — Education Counsellor
  - Andrew Riis — Visa Specialist
  - Kristin Watson — Visa Coordinator
  - Jerome Bell — General Manager
  - Eleanor Pena — Case Manager
  - (2 more with duplicate/wrong names)
- **Fix:** Replace all with real team data from client

#### Partners Section
- **Heading:** We're proud to work with our preferred partners
- **Fix:** Same as homepage — get real partner names or remove

---

### PAGE 4 — COUNTRY

#### Main Page
- **Heading:** Make Your Choice for the Preferred Nation
- **Countries with individual pages (confirmed working):**
  - Canada, Belgium, Denmark, Australia, France, Germany, Greece, Hungary, Iceland, Ireland, Italy, Luxembourg

#### Individual Country Pages — CRITICAL ISSUE
- **Every single country page has IDENTICAL content**
- Australia's page body text says "Canada" — never updated
- All pages show Canadian universities regardless of country
- **Fix needed per country:**

| Country | Fix Required |
|---|---|
| Canada | Content is correct — keep |
| Australia | Replace all content with Australia-specific info |
| Belgium | Replace all content with Belgium-specific info |
| Denmark | Replace all content with Denmark-specific info |
| France | Replace all content with France-specific info |
| Germany | Replace all content with Germany-specific info |
| Greece | Replace all content with Greece-specific info |
| Hungary | Replace all content with Hungary-specific info |
| Iceland | Replace all content with Iceland-specific info |
| Ireland | Replace all content with Ireland-specific info |
| Italy | Replace all content with Italy-specific info |
| Luxembourg | Replace all content with Luxembourg-specific info |

#### Country Page Template (use for each)
- **Sections to include:**
  - Country hero with flag placeholder
  - "Why study in [Country]?" — 3-4 bullet points
  - "Why choose us?" — Supportive Environment, Student-Friendly Policies, Quality Higher Educations, Opportunities for Growth
  - "Top institutes" — list of real universities per country
  - CTA — Book Appointment

#### Real Universities Per Country (to use in rebuild)
- **Canada:** University of Toronto, University of British Columbia, University of Montreal, University of Waterloo, Queen's University
- **Australia:** University of Melbourne, Australian National University, University of Sydney, University of Queensland, Monash University
- **Germany:** TU Munich, LMU Munich, Heidelberg University, Humboldt University Berlin, RWTH Aachen
- **France:** Sorbonne University, Sciences Po, École Polytechnique, University of Paris-Saclay, HEC Paris
- **Ireland:** Trinity College Dublin, University College Dublin, University College Cork, NUI Galway, Dublin City University
- **Italy:** University of Bologna, Sapienza University Rome, University of Milan, Politecnico di Milano, University of Florence
- **Belgium:** KU Leuven, Ghent University, Université Libre de Bruxelles, University of Antwerp, VUB
- **Denmark:** University of Copenhagen, Technical University of Denmark, Aarhus University, University of Southern Denmark
- **Greece:** National & Kapodistrian University Athens, Aristotle University Thessaloniki, Athens Polytechnic
- **Hungary:** University of Budapest (ELTE), Budapest University of Technology, University of Debrecen, Semmelweis University
- **Iceland:** University of Iceland, Reykjavik University, Iceland University of the Arts
- **Luxembourg:** University of Luxembourg (only major university)

#### Downloads (on country pages — currently broken)
- TOEFL Application Form → link to `#` (broken)
- Terms & Conditions → link to `#` (broken)
- Fix: Get real files from client or remove section

---

### PAGE 5 — BLOG

#### Blog List Page
- **10 posts exist, all from December 2023**
- **Critical issue:** All 10 post summaries are IDENTICAL copy-paste text
- **One post** ("Elevating Visa Application Complexity") has financial consulting content — wrong content entirely
- **Fix:** Either write real content per post or ask client to provide — don't use the fake summaries

#### Blog Post Titles (real — keep these)
1. Elevating your visa application navigating complexity
2. Application Arsenal: Your Essential Toolkit for Successful Visa Application
3. Your Comprehensive Guide to Successfully Pursuing Study Abroad
4. How Student Visa Consulting Transforms the Journey
5. How Student Visa Consulting Lights the Way
6. Student Visa Consulting and the Road to Higher Education
7. The Impact of Student Visa Consulting on Study Abroad
8. How to Experience the World without Breaking the Bank
9. 10 Must-Visit Hidden Gems for Your Next Vacation
10. Elevating Visa Application Complexity with Expert Help

#### Blog Sidebar
- Categories: Blog, Business visa, Consulting, Immigration, Student, Travel, Visa quotas
- Tags: Abroad, family, Government, Immigration, Student, travel, Traveling, Visa, Work Visa
- These are real — keep them

---

### PAGE 6 — CONTACT

#### Contact Info Cards (3 cards)
1. **Call us on**
   - +91 99640 81555
   - +91 95386 71555
   - Fix: Link to `tel:+919964081555` (currently links to `#`)

2. **Email us on**
   - info@eduexpert.in
   - admission@eduexpert.in
   - Fix: Link to `mailto:info@eduexpert.in` (currently links to `#`)

3. **Visit us on**
   - New Central Jail Road, GK Layout, Hosa Road, PO, Electronic City, Bengaluru, Karnataka 560100
   - Fix: Link to Google Maps (currently links to `#`)

#### Contact Form
- Fields needed: Name, Email, Phone, Message, Submit
- Fix: Hook up to real backend (EmailJS / Resend / Formspree) — current form does nothing

#### Google Maps Embed
- Current: Bangladesh coordinates (completely wrong)
- Correct coordinates: 12.8399° N, 77.6770° E (Electronic City, Bengaluru)
- Correct embed: Replace iframe src with proper Bengaluru Electronic City embed

---

### PAGE 7 — COACHING (MISSING — NEEDS TO BE CREATED)

- Page currently returns server error — doesn't exist
- Need to ask client: what coaching services do they offer?
- Possible sections to build:
  - IELTS Coaching
  - TOEFL Coaching
  - PTE Coaching
  - GRE / GMAT Coaching
  - Batch types (Regular / Weekend / Online)
  - Faculty info
  - Fee structure
- **Cannot build this without client input**

---

## 4. FOOTER — SAME BROKEN STATE ON ALL PAGES

#### Current State (All Broken)
- "Explore Link" column → 5 links all `#`
- "Services" column → 5 links all `#`
- "Our Branches" column → 5 links all `#`
- Copyright: "Copyright © 2025 Eduexpert All rights reserved." ✅ Keep this

#### Corrected Footer Structure

**Column 1 — Explore**
- Home → `/`
- About Us → `/about`
- Blog → `/blog`
- Contact → `/contact`
- Testimonials → (section on homepage or separate page)

**Column 2 — Services**
- Student Visa → `/visa`
- Tourist Visa → `/visa`
- Working Visa → `/visa`
- Coaching → `/coaching`
- Book Appointment → `/contact`

**Column 3 — Our Branches**
- Electronic City, Bengaluru (confirmed)
- ASK CLIENT if more branches exist

**Column 4 — Contact**
- +91 99640 81555
- info@eduexpert.in
- Mon–Fri: 09:00 AM – 05:00 PM

---

## 5. GLOBAL ISSUES (Affects Every Page)

| Issue | Fix |
|---|---|
| Navbar search = javascript:void | Implement real search or remove |
| Language switcher = broken + typo "Aribic" | Remove entirely or implement properly |
| Coaching nav link = server error | Create coaching page first |
| Google Maps = Bangladesh coordinates | Fix to Electronic City, Bengaluru (12.8399, 77.6770) |
| Newsletter form = does nothing | Connect to Mailchimp / Resend / Formspree |
| Contact form = does nothing | Same as above |
| All footer links = dead `#` | Fix per footer section above |
| Scroll-to-top button = `#` | Fix to scroll to top |
| All team links = wp.xpressbuddy.com | Replace with real team data |
| Partner logos = `#` | Get real partners or remove section |

---

## 6. THINGS THAT NEED CLIENT INPUT BEFORE LAUNCH

> Do NOT make up these — ask the client directly

- [ ] Real team names, photos, designations
- [ ] Actual stats (clients served, success rate, years active)
- [ ] Real testimonials with client names
- [ ] Coaching page content (what they teach, batches, fees)
- [ ] Partner/university logos they're affiliated with
- [ ] Which countries they cover per continent (for tab filtering)
- [ ] Branch locations (how many offices?)
- [ ] Terms & Conditions page content
- [ ] Privacy Policy page content
- [ ] TOEFL Application Form file (PDF)
- [ ] Real blog content (or remove existing fakes)
- [ ] Newsletter provider preference

---

## 7. TECH STACK FOR REBUILD

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Resend or Formspree
- **Maps:** Google Maps Embed API (iframe with correct coordinates)
- **Images:** next/image with placeholder blur until client provides real ones
- **Deployment:** Vercel

---

## 8. PAGE STRUCTURE / ROUTES

```
/                    → Home
/visa                → Visa page
/about               → About page
/country             → Country listing
/country/[slug]      → Dynamic country detail page
/blog                → Blog listing
/blog/[slug]         → Dynamic blog post page
/contact             → Contact page
/coaching            → Coaching page (needs to be created)
```

---

## 9. SUMMARY — WHAT'S USABLE VS WHAT NEEDS REPLACING

| Content | Status |
|---|---|
| Business name, phone, email, address | ✅ Real — use it |
| Hero text and tagline | ✅ Real — use it |
| Visa types and descriptions | ✅ Real — use it |
| How it works steps | ✅ Real — use it |
| Country list (12 countries) | ✅ Real — use it |
| Blog post titles | ✅ Real — use it |
| FAQ questions | ✅ Real — use it |
| Canada university list | ✅ Real — use it |
| Stats (00+, 00K+) | ❌ Placeholder — need from client |
| Team members | ❌ Fake — need from client |
| Testimonials | ❌ Fake — need from client |
| Partner logos | ❌ Fake — need from client |
| FAQ answers | ❌ All same — need from client |
| Blog post content | ❌ All same — need from client |
| Country page content (except Canada) | ❌ All copy of Canada — need to rewrite |
| Coaching page | ❌ Doesn't exist — need from client |
| Footer links | ❌ All dead — fix in rebuild |
| All forms | ❌ Broken — fix in rebuild |
| Google Maps | ❌ Wrong location — fix in rebuild |

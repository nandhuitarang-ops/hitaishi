import { NextResponse } from "next/server";
import { appendLead, clearLeads, readLeads } from "@/lib/leadsStore";
import { leadSchema } from "@/lib/leadSchemas";
import type { InstitutionPartner, LeadInput } from "@/lib/leadTypes";
import { sendMentorWelcomeEmail, sendInstitutionPartnerEmail, sendAdminNotificationEmail } from "@/lib/emails/email-service";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32 * 1024;

export async function GET() {
  const leads = await readLeads();
  return NextResponse.json(
    { leads },
    { headers: { "Cache-Control": "private, max-age=0" } },
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
  }

  let body: unknown = null;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldLabels: Record<string, string> = {
      name: "Full name",
      email: "Email address",
      phone: "Phone number",
      city: "City",
      gender: "Gender",
      institute: "Institute / IIT name",
      branch: "Branch of study",
      yearOfStudy: "Year of study",
      jeeExam: "JEE exam",
      jeeYear: "JEE year",
      jeeRank: "JEE rank",
      subjects: "Subjects",
      preferredLevel: "Preferred student batches",
      languages: "Languages",
      weeklyHours: "Weekly hours",
      preferredSlots: "Availability slots",
      motivation: "Motivation statement",
      priorExperience: "Prior experience",
      currentClass: "Current class",
      coachingInstitute: "Coaching institute",
      institutionName: "Institution name",
      contactPerson: "Contact person",
      role: "Role",
      studentCount: "Student count",
      partnershipModel: "Partnership model",
      message: "Message",
    };
    const issues = parsed.error.issues.map((i) => {
      const field = i.path.join(".");
      const label = fieldLabels[field] || field;
      return `${label}: ${i.message}`;
    }).join("; ");
    console.warn("[/api/leads] validation failed", issues);
    return NextResponse.json({ ok: false, error: issues || "Validation failed." }, { status: 400 });
  }

  const data = parsed.data;
  if (data.website && data.website.trim().length > 0) {
    console.info("[/api/leads] honeypot tripped, dropping submission");
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const clean = { ...data } as Record<string, unknown>;
  delete clean.website;
  let input: LeadInput = clean as unknown as LeadInput;
  if (input.type === "institution-partner") {
    const ip = input as Omit<InstitutionPartner, "name">;
    input = { ...ip, name: ip.contactPerson } as InstitutionPartner;
  }

  try {
    const lead = await appendLead(input);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.hitaishii.com";
    
    // Trigger admin notification
    const { type: leadType, name: leadName, email: leadEmail, ...details } = input;
    sendAdminNotificationEmail(leadType, leadName, leadEmail, details).catch((e) => {
      console.error("Failed to send admin notification email:", e);
    });

    if (lead.type === "mentor-application") {
      sendMentorWelcomeEmail(lead.email, lead.name, `${appUrl}/mentor-onboarding`).catch((e) => {
        console.error("Failed to send mentor welcome email:", e);
      });
    } else if (lead.type === "institution-partner") {
      const leadData = input as InstitutionPartner;
      sendInstitutionPartnerEmail(lead.email, leadData.contactPerson, leadData.institutionName, `${appUrl}/institution-onboarding`).catch((e) => {
        console.error("Failed to send institution welcome email:", e);
      });
    }
    return NextResponse.json(
      { ok: true, lead },
      {
        status: 201,
        headers: { "Cache-Control": "private, max-age=0" },
      },
    );
  } catch (err) {
    console.error("[/api/leads] persist failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not save your message. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    await clearLeads();
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "private, max-age=0" } },
    );
  } catch (err) {
    console.error("[/api/leads] DELETE failed", err);
    return NextResponse.json({ ok: false, error: "Operation failed." }, { status: 500 });
  }
}

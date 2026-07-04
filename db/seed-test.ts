import postgres from "postgres";
import { hashPassword } from "../lib/auth";

const MENTORS = [
  { email: "mentor1@test.hitaishi.app", name: "Priya Iyer", institute: "IIT Bombay '22, CSE. AIR 312" },
  { email: "mentor2@test.hitaishi.app", name: "Rahul Verma", institute: "IIT Delhi '21, ME. AIR 521" },
  { email: "mentor3@test.hitaishi.app", name: "Sneha Patel", institute: "IIT Kanpur '23, EE. AIR 189" },
];

const STUDENTS = [
  { email: "student1@test.hitaishi.app", name: "Aarav Gupta", city: "Mumbai", board: "CBSE", class: "Class 12" },
  { email: "student2@test.hitaishi.app", name: "Ishita Sharma", city: "Delhi", board: "CBSE", class: "Class 12" },
  { email: "student3@test.hitaishi.app", name: "Rohan Desai", city: "Pune", board: "ICSE", class: "Class 11" },
  { email: "student4@test.hitaishi.app", name: "Ananya Reddy", city: "Hyderabad", board: "State board", class: "Class 12" },
  { email: "student5@test.hitaishi.app", name: "Kunal Singh", city: "Lucknow", board: "CBSE", class: "Dropper / Repeater" },
  { email: "student6@test.hitaishi.app", name: "Maya Joshi", city: "Bengaluru", board: "ICSE", class: "Class 11" },
  { email: "student7@test.hitaishi.app", name: "Vivaan Mehta", city: "Ahmedabad", board: "CBSE", class: "Class 12" },
  { email: "student8@test.hitaishi.app", name: "Sara Khan", city: "Kolkata", board: "CBSE", class: "Class 12" },
];

const ASSIGNMENTS: [number, number][] = [
  [0, 0], [0, 1], [0, 2],
  [1, 3], [1, 4],
  [2, 5], [2, 6], [2, 7],
];

async function main() {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) { console.error("DATABASE_URL or DIRECT_URL required"); process.exit(1); }
  const isLocal = url.includes("localhost") || url.includes("127.0.0.1");
  const sql = postgres(url, { max: 1, ssl: isLocal ? undefined : "require", prepare: false, onnotice: () => {} });
  const passwordHash = await hashPassword("demo1234");
  const now = new Date();

  const mentorIds: string[] = [];
  for (const m of MENTORS) {
    const [user] = await sql`INSERT INTO users (email, password_hash, role, status) VALUES (${m.email}, ${passwordHash}, 'mentor', 'active')
       ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}, status = 'active'
       RETURNING id`;
    const id = String(user.id);
    mentorIds.push(id);
    const subjects = JSON.stringify([{ subject: "physics", level: "strong" }, { subject: "math", level: "strong" }]);
    await sql`INSERT INTO profiles (user_id, full_name, institute, subjects_focus)
       VALUES (${id}, ${m.name}, ${m.institute}, ${subjects})
       ON CONFLICT (user_id) DO UPDATE SET full_name = ${m.name}, institute = ${m.institute}, subjects_focus = ${subjects}`;
    console.log(`✓ mentor ${m.email}`);
  }

  const studentIds: string[] = [];
  for (const s of STUDENTS) {
    const [user] = await sql`INSERT INTO users (email, password_hash, role, status) VALUES (${s.email}, ${passwordHash}, 'student', 'active')
       ON CONFLICT (email) DO UPDATE SET password_hash = ${passwordHash}, status = 'active'
       RETURNING id`;
    const id = String(user.id);
    studentIds.push(id);
    await sql`INSERT INTO profiles (user_id, full_name, city, board, current_class, target_exam, target_year, onboarding_step, onboarding_completed_at)
       VALUES (${id}, ${s.name}, ${s.city}, ${s.board}, ${s.class}, 'jee_main', 2026, 3, ${now})
       ON CONFLICT (user_id) DO UPDATE SET full_name = ${s.name}, city = ${s.city}, board = ${s.board}, current_class = ${s.class}, onboarding_step = 3, onboarding_completed_at = ${now}`;
    console.log(`✓ student ${s.email}`);
  }

  for (const [mentorIdx, studentIdx] of ASSIGNMENTS) {
    const existing = await sql`SELECT id FROM assignments WHERE student_id = ${studentIds[studentIdx]} AND status = 'active' LIMIT 1`;
    if (existing.length > 0) {
      await sql`UPDATE assignments SET status = 'ended', ended_at = ${now} WHERE id = ${existing[0].id}`;
    }
    await sql`INSERT INTO assignments (student_id, mentor_id, status, started_at) VALUES (${studentIds[studentIdx]}, ${mentorIds[mentorIdx]}, 'active', ${now})`;
    console.log(`  → ${MENTORS[mentorIdx].name} <-> ${STUDENTS[studentIdx].name}`);
  }

  const EXAM_DATA: { studentIdx: number; exams: { name: string; subject?: string; score: number; total: number; feedback?: string }[] }[] = [
    { studentIdx: 0, exams: [{ name: "JEE Main 2025 Mock", score: 180, total: 300, feedback: "Physics was tough, need more practice." }, { name: "12th Board Physics", subject: "Physics", score: 78, total: 100 }] },
    { studentIdx: 1, exams: [{ name: "JEE Main 2025 Mock", score: 220, total: 300, feedback: "Chemistry went well." }] },
    { studentIdx: 2, exams: [{ name: "JEE Main 2025 Mock", score: 145, total: 300, feedback: "Math needs improvement." }] },
    { studentIdx: 3, exams: [{ name: "JEE Main 2025 Mock", score: 250, total: 300, feedback: "Confident about the exam!" }, { name: "12th Board Chemistry", subject: "Chemistry", score: 92, total: 100 }] },
    { studentIdx: 4, exams: [{ name: "JEE Advanced 2024", score: 120, total: 360, feedback: "Need to work on speed." }] },
    { studentIdx: 5, exams: [{ name: "JEE Main 2025 Mock", score: 195, total: 300 }] },
    { studentIdx: 6, exams: [{ name: "JEE Main 2025 Mock", score: 210, total: 300, feedback: "Improving steadily." }, { name: "BITSAT Mock", subject: "Math", score: 85, total: 100 }] },
    { studentIdx: 7, exams: [{ name: "JEE Main 2025 Mock", score: 165, total: 300, feedback: "Chemistry pulled me down." }] },
  ];

  for (const entry of EXAM_DATA) {
    const uid = studentIds[entry.studentIdx];
    await sql`DELETE FROM exam_results WHERE user_id = ${uid}`;
    for (const ex of entry.exams) {
      await sql`INSERT INTO exam_results (user_id, exam_name, subject, score, total_marks, feedback) VALUES (${uid}, ${ex.name}, ${ex.subject ?? null}, ${String(ex.score)}, ${String(ex.total)}, ${ex.feedback ?? null})`;
    }
    console.log(`  ✓ exams for ${STUDENTS[entry.studentIdx].name}`);
  }

  console.log("\n✓ All test accounts created. Password for all: demo1234");
  await sql.end();
}

main().catch((err) => { console.error(err); process.exit(1); });

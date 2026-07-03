"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Input, Select } from "@/components/ui";

type Props = {
  initial: {
    fullName: string;
    email: string;
    phone: string;
    targetExam: string;
    targetYear: string;
    institute: string;
    subjects: string[];
  };
};

export function StudentProfileEditor({ initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [form, setForm] = useState({
    fullName: initial.fullName,
    phone: initial.phone,
    institute: initial.institute,
    targetExam: initial.targetExam,
    targetYear: initial.targetYear,
  });

  const handleChange = useCallback(
    (field: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value })),
    [],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ ok: false, text: data.error || "Failed to save." });
      } else {
        setMessage({ ok: true, text: "Profile saved successfully." });
        router.refresh();
      }
    } catch {
      setMessage({ ok: false, text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  }, [form, router]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Full name">
          <Input
            value={form.fullName}
            onChange={handleChange("fullName")}
          />
        </Field>
        <Field label="Email">
          <Input value={initial.email} readOnly />
        </Field>
        <Field label="Phone">
          <Input
            value={form.phone}
            onChange={handleChange("phone")}
          />
        </Field>
        <Field label="Target exam">
          <Select
            value={form.targetExam}
            onChange={handleChange("targetExam")}
          >
            <option value="jee_main">JEE Main</option>
            <option value="jee_advanced">JEE Advanced</option>
            <option value="both">JEE Main + Advanced</option>
          </Select>
        </Field>
        <Field label="Target year">
          <Input
            value={form.targetYear}
            onChange={handleChange("targetYear")}
            placeholder="e.g. 2026"
          />
        </Field>
        <Field label="Dream institute">
          <Input
            value={form.institute}
            onChange={handleChange("institute")}
          />
        </Field>
        <Field label="Subjects (priority order)">
          <div className="flex gap-2 flex-wrap">
            {initial.subjects.length === 0 ? (
              <span className="text-sm text-ink-faint">
                No subjects added yet.
              </span>
            ) : (
              initial.subjects.map((s, i) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-pill text-xs font-medium bg-primary-soft text-primary-deep"
                >
                  {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
              ))
            )}
          </div>
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        {message && (
          <span
            className={`text-sm ${message.ok ? "text-primary-deep" : "text-danger"}`}
          >
            {message.text}
          </span>
        )}
        <button
          className="chip-cta"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </>
  );
}

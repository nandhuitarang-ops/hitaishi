"use client";

import { useState } from "react";
import { MockTestScorePopup } from "./MockTestScorePopup";

interface Props {
  studentName: string;
  children: React.ReactNode;
}

export function StudentDashboardClient({ studentName, children }: Props) {
  const [showPopup, setShowPopup] = useState(true);

  return (
    <>
      {showPopup && (
        <MockTestScorePopup
          studentName={studentName}
          onDismiss={() => setShowPopup(false)}
        />
      )}
      {children}
    </>
  );
}

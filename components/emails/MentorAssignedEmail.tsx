import * as React from "react";

interface MentorAssignedEmailProps {
  studentName: string;
  mentorName: string;
  dashboardLink: string;
}

export function MentorAssignedEmail({
  studentName,
  mentorName,
  dashboardLink,
}: MentorAssignedEmailProps) {
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f7faf5",
        padding: "40px 20px",
        color: "#181d1a",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "40px",
          border: "1px solid #e0e8dc",
          boxShadow: "0 4px 12px rgba(47, 125, 92, 0.03)",
        }}
      >
        <div
          style={{
            marginBottom: "30px",
            borderBottom: "1px solid #f0f4f0",
            paddingBottom: "20px",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "24px",
              fontWeight: "bold",
              fontStyle: "italic",
              color: "#2f7d5c",
            }}
          >
            Hitaishi
          </span>
        </div>

        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "28px",
            fontWeight: "semibold",
            lineHeight: "1.3",
            margin: "0 0 20px 0",
            color: "#0b6445",
          }}
        >
          Hi {studentName},
        </h1>
        <p
          style={{
            fontSize: "15px",
            lineHeight: "1.6",
            margin: "0 0 24px 0",
            color: "#3f4943",
          }}
        >
          Great news! You have been matched with{" "}
          <strong>{mentorName}</strong> as your IITian mentor.
        </p>
        <p
          style={{
            fontSize: "15px",
            lineHeight: "1.6",
            margin: "0 0 30px 0",
            color: "#3f4943",
          }}
        >
          Head over to your dashboard to start the conversation and plan your
          JEE preparation journey.
        </p>

        <div style={{ marginBottom: "30px" }}>
          <a
            href={dashboardLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              backgroundColor: "#2f7d5c",
              color: "#ffffff",
              padding: "14px 28px",
              borderRadius: "14px",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
              boxShadow: "0 4px 10px rgba(47, 125, 92, 0.15)",
            }}
          >
            Go to Dashboard →
          </a>
        </div>

        <div
          style={{
            borderTop: "1px solid #f0f4f0",
            paddingTop: "20px",
            marginTop: "40px",
            fontSize: "12px",
            color: "#6f7a72",
            lineHeight: "1.5",
          }}
        >
          You are receiving this because you are a student on Hitaishi.
          <br />
          Hitaishi Mentorship · IIT Bombay & IIT Delhi alumni network.
        </div>
      </div>
    </div>
  );
}

export default MentorAssignedEmail;

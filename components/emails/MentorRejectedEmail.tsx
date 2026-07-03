import * as React from "react";

interface MentorRejectedEmailProps {
  fullName: string;
  reason: string;
}

export function MentorRejectedEmail({ fullName, reason }: MentorRejectedEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f7faf5", padding: "40px 20px", color: "#181d1a" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", padding: "40px", border: "1px solid #e0e8dc", boxShadow: "0 4px 12px rgba(47, 125, 92, 0.03)" }}>
        {/* Logo */}
        <div style={{ marginBottom: "30px", borderBottom: "1px solid #f0f4f0", paddingBottom: "20px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "bold", fontStyle: "italic", color: "#2f7d5c" }}>Hitaishi</span>
        </div>

        {/* Content */}
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "semibold", lineHeight: "1.3", margin: "0 0 20px 0", color: "#b33a3a" }}>
          Application Update, {fullName}
        </h1>
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", color: "#3f4943" }}>
          Thank you for your interest in becoming a Hitaishi mentor. After reviewing your application, we regret to inform you that we are <strong>unable to approve</strong> your application at this time.
        </p>

        {reason ? (
          <>
            <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 12px 0", color: "#3f4943", fontWeight: "600" }}>
              Reason:
            </p>
            <div style={{ backgroundColor: "#fef6f0", border: "1px solid #f5d6c6", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", fontSize: "14px", lineHeight: "1.6", color: "#5a3e2e" }}>
              {reason}
            </div>
          </>
        ) : null}

        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", color: "#3f4943" }}>
          If you believe there has been a mistake or would like further clarification, please reach out to our admin team. We value your interest and would be happy to discuss any concerns.
        </p>

        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 30px 0", color: "#3f4943" }}>
          You can contact us by replying to this email, and we will get back to you as soon as possible.
        </p>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0f4f0", paddingTop: "20px", marginTop: "40px", fontSize: "12px", color: "#6f7a72", lineHeight: "1.5" }}>
          You are receiving this because you submitted a mentor application on Hitaishi.<br />
          Hitaishi Mentorship · IIT Bombay & IIT Delhi alumni network.
        </div>
      </div>
    </div>
  );
}
export default MentorRejectedEmail;

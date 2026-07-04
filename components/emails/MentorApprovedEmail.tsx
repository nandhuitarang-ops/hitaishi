import * as React from "react";

interface MentorApprovedEmailProps {
  fullName: string;
  dashboardLink: string;
  email?: string;
  password?: string;
  resetLink?: string;
}

export function MentorApprovedEmail({ fullName, dashboardLink, email, password, resetLink }: MentorApprovedEmailProps) {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f7faf5", padding: "40px 20px", color: "#181d1a" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "24px", padding: "40px", border: "1px solid #e0e8dc", boxShadow: "0 4px 12px rgba(47, 125, 92, 0.03)" }}>
        
        {/* Header Logo */}
        <div style={{ marginBottom: "30px", borderBottom: "1px solid #f0f4f0", paddingBottom: "20px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "bold", fontStyle: "italic", color: "#2f7d5c" }}>Hitaishii</span>
        </div>

        {/* Content Title */}
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: "semibold", lineHeight: "1.3", margin: "0 0 20px 0", color: "#0b6445" }}>
          Welcome to the team, {fullName}! 🎉
        </h1>

        {/* Inspiring Quote */}
        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", fontStyle: "italic", color: "#2f7d5c", borderLeft: "3px solid #2f7d5c", paddingLeft: "15px" }}>
          &ldquo;A mentor is not someone who walks ahead of you to show how great they are, but someone who walks beside you to show how great you can be. By sharing your experience and guidance, you are directly shaping the dreams of young minds embarking on their IIT journey.&rdquo;
        </p>

        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", color: "#3f4943" }}>
          We are thrilled to inform you that your mentor application has been <strong>approved</strong>! You are now part of the Hitaishii mentorship community, where you can guide and inspire the next generation of JEE aspirants.
        </p>

        {/* Credentials Box */}
        {email && password && (
          <div style={{ backgroundColor: "#f4faf6", border: "1px solid #cce2d6", padding: "24px", borderRadius: "16px", marginBottom: "24px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: "600", color: "#0b6445" }}>Your Portal Login Credentials</h3>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#3f4943" }}><strong>Email / Username:</strong> <code style={{ fontSize: "14px", backgroundColor: "#e8f4ed", padding: "2px 6px", borderRadius: "4px", color: "#0b6445" }}>{email}</code></p>
            <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#3f4943" }}><strong>Temporary Password:</strong> <code style={{ fontSize: "14px", backgroundColor: "#e8f4ed", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold", color: "#0b6445" }}>{password}</code></p>
            <p style={{ margin: "0", fontSize: "12px", color: "#6f7a72", lineHeight: "1.5" }}>
              Please note down these credentials. You can change your password at any time in your Profile settings after logging in.
            </p>
          </div>
        )}

        {/* Reset Password CTA */}
        {resetLink && (
          <div style={{ margin: "24px 0", padding: "24px", border: "1px dashed #2f7d5c", borderRadius: "16px", backgroundColor: "#f7faf5", textAlign: "center" }}>
            <p style={{ fontSize: "14px", margin: "0 0 16px 0", color: "#3f4943", lineHeight: "1.5" }}>
              We highly recommend setting up a custom, secure password before you log in. This link is valid for **24 hours**:
            </p>
            <a
              href={resetLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", backgroundColor: "#2f7d5c", color: "#ffffff", padding: "14px 28px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", textDecoration: "none", boxShadow: "0 4px 10px rgba(47, 125, 92, 0.15)" }}
            >
              Set Secure Password
            </a>
          </div>
        )}

        <p style={{ fontSize: "15px", lineHeight: "1.6", margin: "0 0 24px 0", color: "#3f4943" }}>
          Once done, you can access your mentor dashboard to set up your profile, manage your availability, and start connecting with students.
        </p>

        {/* Main Dashboard CTA */}
        {!resetLink && (
          <div style={{ marginBottom: "30px" }}>
            <a
              href={dashboardLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", backgroundColor: "#2f7d5c", color: "#ffffff", padding: "14px 28px", borderRadius: "14px", fontSize: "14px", fontWeight: "600", textDecoration: "none", boxShadow: "0 4px 10px rgba(47, 125, 92, 0.15)" }}
            >
              Go to Dashboard →
            </a>
          </div>
        )}

        {/* Signature & Seal */}
        <div style={{ borderTop: "1px solid #f0f4f0", paddingTop: "24px", marginTop: "36px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px double #2f7d5c", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f8f3", color: "#2f7d5c", fontFamily: "Georgia, serif", fontSize: "9px", fontWeight: "bold", textTransform: "uppercase", textAlign: "center", lineHeight: "1.1", flexShrink: 0 }}>
            Hitaishii<br/>Network
          </div>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: "bold", color: "#0b6445", fontStyle: "italic" }}>The Hitaishii Team</div>
            <div style={{ fontSize: "12px", color: "#6f7a72" }}>IIT Alumni Mentorship Network</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0f4f0", paddingTop: "20px", marginTop: "30px", fontSize: "12px", color: "#6f7a72", lineHeight: "1.5" }}>
          You are receiving this because your mentor application was approved on Hitaishii.<br />
          Hitaishii Mentorship · IIT Bombay & IIT Delhi alumni network.
        </div>

      </div>
    </div>
  );
}

export default MentorApprovedEmail;

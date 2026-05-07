import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface SendAuditEmailParams {
  to: string;
  monthlySavings: number;
  annualSavings: number;
  isHighSavings: boolean;
  auditId: string;
}

export async function sendAuditEmail({
  to,
  monthlySavings,
  annualSavings,
  isHighSavings,
  auditId,
}: SendAuditEmailParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const auditUrl = `${appUrl}/audit/${auditId}`;

  const subject =
    monthlySavings > 0
      ? `Your AI Spend Audit — $${monthlySavings}/mo in savings found`
      : "Your AI Spend Audit — You're spending well";

  const body =
    monthlySavings > 0
      ? `
        <h2>Your SpendLens Audit is ready</h2>
        <p>We found <strong>$${monthlySavings}/month ($${annualSavings}/year)</strong> in potential savings across your AI tools.</p>
        ${
          isHighSavings
            ? `<p><strong>You qualify for a free Credex consultation</strong> — our team will reach out to help you capture these savings with discounted AI credits.</p>`
            : ""
        }
        <p><a href="${auditUrl}">View your full audit report →</a></p>
        <hr/>
        <p style="color:#666;font-size:12px">SpendLens by Credex · credex.rocks</p>
      `
      : `
        <h2>Your SpendLens Audit is ready</h2>
        <p>Good news — your AI tool stack looks well optimized. No significant overspend detected.</p>
        <p>We'll keep an eye out for new savings opportunities for your stack.</p>
        <p><a href="${auditUrl}">View your audit report →</a></p>
        <hr/>
        <p style="color:#666;font-size:12px">SpendLens by Credex · credex.rocks</p>
      `;

  await resend.emails.send({
    from: "SpendLens <onboarding@resend.dev>",
    to,
    subject,
    html: body,
  });
}
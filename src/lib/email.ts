import { Resend } from "resend";

const FROM_ADDRESS = process.env.EMAIL_FROM || "DevisImmo <onboarding@resend.dev>";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquante dans .env");
  }
  return new Resend(apiKey);
}

function emailHtml({
  clientNom,
  emetteurNom,
  devisNumber,
  totalTTC,
}: {
  clientNom: string;
  emetteurNom: string;
  devisNumber: string;
  totalTTC: string;
}) {
  return `
<div style="font-family: Helvetica, Arial, sans-serif; color: #1C1F26; max-width: 480px; margin: 0 auto;">
  <h1 style="font-size: 18px; margin-bottom: 4px;">DevisImmo</h1>
  <p style="color: #6B6B65; font-size: 13px; margin-top: 0;">${emetteurNom}</p>
  <p>Bonjour ${clientNom},</p>
  <p>Veuillez trouver ci-joint le devis <strong>${devisNumber}</strong>, d'un montant total de <strong>${totalTTC}</strong> TTC.</p>
  <p>N'hésitez pas à nous contacter pour toute question.</p>
  <p style="margin-top: 24px; color: #6B6B65; font-size: 12px;">Envoyé via DevisImmo.</p>
</div>`.trim();
}

export async function envoyerEmailDevis({
  to,
  clientNom,
  emetteurNom,
  devisNumber,
  totalTTC,
  pdfBuffer,
}: {
  to: string;
  clientNom: string;
  emetteurNom: string;
  devisNumber: string;
  totalTTC: string;
  pdfBuffer: Buffer;
}) {
  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Devis ${devisNumber} — ${emetteurNom}`,
    html: emailHtml({ clientNom, emetteurNom, devisNumber, totalTTC }),
    attachments: [
      {
        filename: `${devisNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (error) {
    throw new Error(error.message);
  }
}

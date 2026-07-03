export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, clientName, venue, eventDate, ownerEmail } = req.body;

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  const toEmail = ownerEmail || "hi@josue.work";
  const actionText = action === "aprobada" ? "aprobó" : "rechazó";
  const actionColor = action === "aprobada" ? "#16a34a" : "#dc2626";
  const actionLabel = action === "aprobada" ? "Aprobada" : "Rechazada";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;">
      <div style="background:#353535;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
        <h1 style="color:white;font-size:20px;margin:0;">CotizaYa by Vēlum</h1>
      </div>
      <div style="padding:24px;background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
        <h2 style="color:#1a1a1a;font-size:18px;margin-top:0;">Actualización de cotización</h2>
        <p style="color:#666;font-size:14px;line-height:1.6;">
          El cliente <strong>${clientName || "—"}</strong> ${actionText} la cotización para el evento en <strong>${venue || "—"}</strong> (${eventDate || "—"}).
        </p>
        <div style="text-align:center;margin:24px 0;">
          <span style="display:inline-block;padding:10px 24px;border-radius:8px;font-weight:600;font-size:14px;color:white;background:${actionColor};">
            ${actionLabel}
          </span>
        </div>
        <p style="color:#999;font-size:12px;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px;">
          CotizaYa by Vēlum
        </p>
      </div>
    </div>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CotizaYa <no.reply@velum.events>",
        to: [toEmail],
        subject: `Cotización ${actionLabel} — ${clientName || "Cliente"}`,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

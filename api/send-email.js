import { readFileSync } from 'fs'
import { join } from 'path'

function loadTemplate(name) {
  const templatePath = join(process.cwd(), 'api', 'templates', `${name}.html`)
  return readFileSync(templatePath, 'utf-8')
}

function renderTemplate(html, data) {
  return html.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '')
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, clientName, clientEmail, venue, eventDate, ownerEmail, paymentStage, paymentAmount, paymentTotal } = req.body;

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  const toEmail = action === "payment_reminder"
    ? (clientEmail || ownerEmail || "hi@josue.work")
    : (ownerEmail || "hi@josue.work");

  let html = "";
  let subject = "";

  if (action === "payment_reminder") {
    subject = `Recordatorio de pago — ${clientName || "Cliente"}`;
    const template = loadTemplate('payment-reminder')
    html = renderTemplate(template, { clientName, paymentStage, paymentAmount, paymentTotal })
  } else if (action === "aprobada") {
    subject = `Cotización Aprobada — ${clientName || "Cliente"}`;
    const template = loadTemplate('approved')
    html = renderTemplate(template, { clientName, venue, eventDate })
  } else if (action === "rechazada") {
    subject = `Cotización Rechazada — ${clientName || "Cliente"}`;
    const template = loadTemplate('rejected')
    html = renderTemplate(template, { clientName, venue, eventDate })
  }

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
        subject,
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

const templates = {
  approved: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;padding:20px;">
  <div style="text-align:center;padding:32px 0 24px;">
    <div style="font-size:24px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">CotizaYa</div>
    <div style="font-size:12px;color:#9ca3af;margin-top:4px;">Plataforma de cotizaciones para organizadores de eventos</div>
  </div>
  <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px;margin-bottom:24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#dcfce7;color:#16a34a;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.5px;">✓ APROBADA</div>
    </div>
    <h1 style="font-size:22px;font-weight:700;color:#1a1a1a;text-align:center;margin:0 0 8px;">¡Excelente noticia!</h1>
    <p style="font-size:15px;color:#6b7280;text-align:center;margin:0 0 28px;line-height:1.5;">Tu cliente <strong style="color:#1a1a1a;">{{clientName}}</strong> acaba de aprobar la cotización.</p>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;font-size:13px;color:#9ca3af;">Cliente</td><td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-weight:500;text-align:right;">{{clientName}}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#9ca3af;">Evento</td><td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-weight:500;text-align:right;">{{venue}}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#9ca3af;">Fecha</td><td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-weight:500;text-align:right;">{{eventDate}}</td></tr>
      </table>
    </div>
    <div style="text-align:center;"><a href="https://cotizador.velum.events/dashboard" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">Ver cotización</a></div>
  </div>
  <div style="text-align:center;padding:0 0 20px;">
    <p style="font-size:12px;color:#9ca3af;margin:0 0 8px;">Este correo fue enviado automáticamente por CotizaYa by Vēlum</p>
    <p style="font-size:12px;color:#9ca3af;margin:0;"><a href="https://cotizador.velum.events" style="color:#C9A86A;text-decoration:none;">Ingresar a la plataforma</a></p>
    <p style="font-size:11px;color:#d1d5db;margin:16px 0 0;">© 2026 CotizaYa. Todos los derechos reservados.</p>
  </div>
</div>`,

  rejected: `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;padding:20px;">
  <div style="text-align:center;padding:32px 0 24px;">
    <div style="font-size:24px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">CotizaYa</div>
    <div style="font-size:12px;color:#9ca3af;margin-top:4px;">Plataforma de cotizaciones para organizadores de eventos</div>
  </div>
  <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px;margin-bottom:24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#fef2f2;color:#dc2626;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.5px;">RECHAZADA</div>
    </div>
    <h1 style="font-size:22px;font-weight:700;color:#1a1a1a;text-align:center;margin:0 0 8px;">La cotización no fue aprobada</h1>
    <p style="font-size:15px;color:#6b7280;text-align:center;margin:0 0 28px;line-height:1.5;">El cliente <strong style="color:#1a1a1a;">{{clientName}}</strong> decidió no continuar con la propuesta.</p>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;font-size:13px;color:#9ca3af;">Cliente</td><td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-weight:500;text-align:right;">{{clientName}}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#9ca3af;">Evento</td><td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-weight:500;text-align:right;">{{venue}}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#9ca3af;">Fecha</td><td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-weight:500;text-align:right;">{{eventDate}}</td></tr>
      </table>
    </div>
    <div style="text-align:center;"><a href="https://cotizador.velum.events/dashboard" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">Revisar cotización</a></div>
  </div>
  <div style="text-align:center;padding:0 0 20px;">
    <p style="font-size:12px;color:#9ca3af;margin:0 0 8px;">Este correo fue enviado automáticamente por CotizaYa by Vēlum</p>
    <p style="font-size:12px;color:#9ca3af;margin:0;"><a href="https://cotizador.velum.events" style="color:#C9A86A;text-decoration:none;">Ingresar a la plataforma</a></p>
    <p style="font-size:11px;color:#d1d5db;margin:16px 0 0;">© 2026 CotizaYa. Todos los derechos reservados.</p>
  </div>
</div>`,

  'payment-reminder': `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;padding:20px;">
  <div style="text-align:center;padding:32px 0 24px;">
    <div style="font-size:24px;font-weight:700;color:#1a1a1a;letter-spacing:-0.5px;">CotizaYa</div>
    <div style="font-size:12px;color:#9ca3af;margin-top:4px;">Plataforma de cotizaciones para organizadores de eventos</div>
  </div>
  <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:32px;margin-bottom:24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:#fef3c7;color:#d97706;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;letter-spacing:0.5px;">⏳ PAGO PENDIENTE</div>
    </div>
    <h1 style="font-size:22px;font-weight:700;color:#1a1a1a;text-align:center;margin:0 0 8px;">Recordatorio de pago</h1>
    <p style="font-size:15px;color:#6b7280;text-align:center;margin:0 0 28px;line-height:1.5;">Hola <strong style="color:#1a1a1a;">{{clientName}}</strong>, tienes un pago pendiente por tu evento.</p>
    <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:20px;text-align:center;margin-bottom:24px;">
      <p style="font-size:12px;color:#92400e;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.5px;">Monto pendiente</p>
      <p style="font-size:28px;font-weight:700;color:#92400e;margin:0;">${{paymentAmount}}</p>
    </div>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;font-size:13px;color:#9ca3af;">Etapa</td><td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-weight:500;text-align:right;">{{paymentStage}}</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#9ca3af;">Total cotización</td><td style="padding:8px 0;font-size:14px;color:#1a1a1a;font-weight:500;text-align:right;">${{paymentTotal}}</td></tr>
      </table>
    </div>
    <p style="font-size:14px;color:#6b7280;text-align:center;margin:0 0 24px;line-height:1.6;">Gracias por confiar en nosotros. Este recordatorio tiene como objetivo ayudarte a mantener al día los pagos de tu evento.</p>
    <div style="text-align:center;"><a href="mailto:hola@velum.events?subject=Comprobante de pago - {{clientName}}" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">Enviar comprobante</a></div>
  </div>
  <div style="text-align:center;padding:0 0 20px;">
    <p style="font-size:12px;color:#9ca3af;margin:0 0 8px;">Este correo fue enviado automáticamente por CotizaYa by Vēlum</p>
    <p style="font-size:12px;color:#9ca3af;margin:0;"><a href="https://cotizador.velum.events" style="color:#C9A86A;text-decoration:none;">Ingresar a la plataforma</a></p>
    <p style="font-size:11px;color:#d1d5db;margin:16px 0 0;">© 2026 CotizaYa. Todos los derechos reservados.</p>
  </div>
</div>`,
}

function renderTemplate(name, data) {
  const html = templates[name]
  return html.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '')
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { action, clientName, clientEmail, venue, eventDate, ownerEmail, paymentStage, paymentAmount = '', paymentTotal = '' } = req.body;

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
    html = renderTemplate('payment-reminder', { clientName, paymentStage, paymentAmount, paymentTotal })
  } else if (action === "aprobada") {
    subject = `Cotización Aprobada — ${clientName || "Cliente"}`;
    html = renderTemplate('approved', { clientName, venue, eventDate })
  } else if (action === "rechazada") {
    subject = `Cotización Rechazada — ${clientName || "Cliente"}`;
    html = renderTemplate('rejected', { clientName, venue, eventDate })
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

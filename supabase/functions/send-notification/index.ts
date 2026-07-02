import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { quotationId, action, ownerEmail, clientName, venue, eventDate } = await req.json()

    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    const supabase = createClient(supabaseUrl, supabaseKey)

    const actionText = action === "aprobada" ? "aprobó" : "rechazó"
    const actionColor = action === "aprobada" ? "#16a34a" : "#dc2626"

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #353535; padding: 24px; text-align: center;">
          <h1 style="color: white; font-size: 20px; margin: 0;">CotizaYa by Vēlum</h1>
        </div>
        <div style="padding: 24px; background: #f9fafb;">
          <h2 style="color: #1a1a1a; font-size: 18px;">Actualización de cotización</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            El cliente <strong>${clientName || "—"}</strong> ${actionText} la cotización para el evento en <strong>${venue || "—"}</strong> (${eventDate || "—"}).
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; padding: 8px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; color: white; background: ${actionColor};">
              ${action === "aprobada" ? "Aprobada" : "Rechazada"}
            </span>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            CotizaYa by Vēlum — Sistema de cotizaciones
          </p>
        </div>
      </div>
    `

    // Using Resend API for email sending
    const resendKey = Deno.env.get("RESEND_API_KEY")
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "CotizaYa <notificaciones@cotizador.velum.events>",
          to: [ownerEmail],
          subject: `Cotización ${action === "aprobada" ? "aprobada" : "rechazada"} — ${clientName || "Cliente"}`,
          html: emailHtml,
        }),
      })
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

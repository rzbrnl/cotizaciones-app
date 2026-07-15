import { useToastStore } from '../stores/toast'

export function useWhatsApp() {
  const toast = useToastStore()

  async function sendPaymentWhatsApp(quotation, paymentInfo, profile) {
    if (!paymentInfo || (!paymentInfo.bank && !paymentInfo.clabe && !paymentInfo.paypal)) {
      toast.error('Configura tus datos de pago en tu perfil')
      return
    }

    const q = quotation
    let total = 0
    for (const section of q.sections || []) {
      for (const item of section.items || []) {
        total += (item.qty || 0) * (item.unitPrice || 0)
      }
    }

    const userName = profile?.full_name || ''
    const stages = q.paymentStages || []

    let message = `✨ *Cotización aprobada*\n\n`
    message += `Hola ${q.clientName || ''},\n\n`
    message += `Tu cotización ha sido aprobada. A continuación los datos para realizar el depósito:\n\n`
    message += `📅 *Evento:* ${q.eventType || '—'}\n`
    message += `📍 *Venue:* ${q.venue || '—'}\n`
    message += `📆 *Fecha:* ${q.eventDate || '—'}\n`
    message += `💰 *Total:* $${total.toLocaleString('es-MX')} MXN\n\n`

    if (stages.length > 0) {
      message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
      message += `📋 *Cronograma de pago:*\n\n`
      stages.forEach((stage, index) => {
        const status = stage.status === 'paid' ? '✓ Pagado' : '○ Pendiente'
        message += `${index + 1}. ${stage.label} (${stage.percent}%) - $${stage.amount.toLocaleString('es-MX')} - ${status}\n`
      })
      message += `\n`
    }

    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
    message += `🏦 *Datos de pago:*\n\n`

    if (paymentInfo.bank) message += `*Banco:* ${paymentInfo.bank}\n`
    if (paymentInfo.clabe) message += `*CLABE:* ${paymentInfo.clabe}\n`
    if (paymentInfo.account) message += `*Cuenta:* ${paymentInfo.account}\n`
    if (paymentInfo.holder) message += `*Titular:* ${paymentInfo.holder}\n`
    if (paymentInfo.paypal) message += `*PayPal:* ${paymentInfo.paypal}\n`

    const nextStage = stages.find(s => s.status !== 'paid')
    if (nextStage) {
      message += `\n📝 *Próximo pago:* ${nextStage.label} - $${nextStage.amount.toLocaleString('es-MX')}\n`
    }

    message += `\nUna vez realizado el pago, por favor envíame el comprobante 🙏\n\n`
    message += `Saludos,\n${userName}`

    const encoded = encodeURIComponent(message)
    const clientPhone = q.clientPhone?.replace(/\D/g, '')

    if (clientPhone) {
      window.open(`https://api.whatsapp.com/send?phone=52${clientPhone}&text=${encoded}`, '_blank')
    } else {
      await navigator.clipboard.writeText(message)
      toast.info('No se encontró teléfono. Mensaje copiado al portapapeles.')
    }
  }

  return { sendPaymentWhatsApp }
}

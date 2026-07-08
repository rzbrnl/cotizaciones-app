import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

function getPaymentDueDates(stages, eventDate) {
  if (!stages || !eventDate || stages.length === 0) return []

  const event = new Date(eventDate)
  const now = new Date()
  const dueDates = []

  // Calculate based on preset pattern
  if (stages.length === 2) {
    // 50/50 or 40/60 pattern
    // Stage 1: When approved (already passed)
    // Stage 2: 20 days before event
    const stage2Date = new Date(event)
    stage2Date.setDate(stage2Date.getDate() - 20)
    dueDates.push({
      stageIndex: 1,
      dueDate: stage2Date,
      label: stages[1].label,
      amount: stages[1].amount,
    })
  } else if (stages.length === 3) {
    // 30/30/40 pattern
    // Stage 1: When approved (already passed)
    // Stage 2: Halfway between approval and event
    // Stage 3: 20 days before event
    const stage2Date = new Date(event)
    stage2Date.setDate(stage2Date.getDate() - 40) // Approximate halfway
    const stage3Date = new Date(event)
    stage3Date.setDate(stage3Date.getDate() - 20)

    dueDates.push({
      stageIndex: 1,
      dueDate: stage2Date,
      label: stages[1].label,
      amount: stages[1].amount,
    })
    dueDates.push({
      stageIndex: 2,
      dueDate: stage3Date,
      label: stages[2].label,
      amount: stages[2].amount,
    })
  }

  return dueDates
}

function isDueSoon(dueDate, daysBefore = 3) {
  const now = new Date()
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  return diffDays >= 0 && diffDays <= daysBefore
}

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Fetch all quotations with payment stages
    const { data: quotations, error } = await supabase
      .from('quotations')
      .select('id, user_id, data')

    if (error) throw error

    let remindersSent = 0

    for (const quotation of quotations || []) {
      const data = quotation.data
      if (!data || !data.paymentStages || data.paymentStages.length === 0) continue
      if (data.status !== 'aprobada') continue

      const pendingStages = data.paymentStages.filter(s => s.status !== 'paid')
      if (pendingStages.length === 0) continue

      const dueDates = getPaymentDueDates(data.paymentStages, data.eventDate)

      for (const due of dueDates) {
        if (isDueSoon(due.dueDate, 3)) {
          // Send reminder email
          const clientEmail = data.clientEmail
          if (!clientEmail) continue

          const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'https://cotizador.velum.events'

          await fetch(`${baseUrl}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'payment_reminder',
              clientName: data.clientName,
              clientEmail: clientEmail,
              paymentStage: due.label,
              paymentAmount: due.amount,
              paymentTotal: data.sections?.reduce((sum, s) =>
                sum + (s.items?.reduce((sum2, i) => sum2 + (i.qty || 0) * (i.unitPrice || 0), 0) || 0), 0) || 0,
              ownerEmail: data.ownerEmail,
            }),
          })

          remindersSent++
        }
      }
    }

    return res.status(200).json({ success: true, remindersSent })
  } catch (error) {
    console.error('Cron error:', error)
    return res.status(500).json({ error: error.message })
  }
}

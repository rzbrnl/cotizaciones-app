import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { formatCurrency } from './format'

export function encodeQuotation(quotation) {
  const json = JSON.stringify(quotation)
  return compressToEncodedURIComponent(json)
}

export function decodeQuotation(hash) {
  const json = decompressFromEncodedURIComponent(hash)
  if (!json) return null
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function generateShareUrl(quotation, baseUrl) {
  const hash = encodeQuotation(quotation)
  return `${baseUrl}/compartir/${hash}`
}

export function generateWhatsAppText(quotation) {
  const lines = []
  lines.push(`✨ *Cotización*`)
  lines.push('')
  if (quotation.eventDate) {
    lines.push(`📅 Fecha: ${quotation.eventDate}`)
  }
  if (quotation.venue) {
    lines.push(`📍 Venue: ${quotation.venue}`)
  }
  if (quotation.eventType) {
    lines.push(`📌 Tipo: ${quotation.eventType}`)
  }
  lines.push('')
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━')

  for (const section of quotation.sections) {
    lines.push('')
    lines.push(`*SECCIÓN: ${section.name}*`)
    for (const item of section.items) {
      const subtotal = (item.qty || 1) * (item.unitPrice || 0)
      lines.push(`• ${item.name || 'Sin nombre'} ×${item.qty || 1} — ${formatCurrency(subtotal)}`)
    }
  }

  lines.push('')
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━')

  let total = 0
  for (const section of quotation.sections) {
    for (const item of section.items) {
      total += (item.qty || 1) * (item.unitPrice || 0)
    }
  }
  lines.push(`💰 *TOTAL: ${formatCurrency(total)}*`)

  if (quotation.notes) {
    lines.push('')
    lines.push(`📝 ${quotation.notes}`)
  }

  lines.push('')
  lines.push('Cordialmente,')
  lines.push(quotation.companyName || '')

  return lines.join('\n')
}

export function generateEmailHtml(quotation) {
  let total = 0
  let sectionsHtml = ''

  for (const section of quotation.sections) {
    let rows = ''
    for (const item of section.items) {
      const subtotal = (item.qty || 1) * (item.unitPrice || 0)
      total += subtotal
      rows += `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e0e0e0;font-size:14px;">${item.name || ''}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e0e0e0;text-align:right;font-size:14px;">${item.qty || 1}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e0e0e0;text-align:right;font-size:14px;">${formatCurrency(item.unitPrice || 0)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e0e0e0;text-align:right;font-size:14px;font-weight:600;">${formatCurrency(subtotal)}</td>
        </tr>`
    }

    sectionsHtml += `
      <div style="margin-top:24px;">
        <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:2px;color:#666;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #1a1a1a;">${section.name}</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;">Concepto</th>
              <th style="text-align:right;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;">Cant.</th>
              <th style="text-align:right;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;">Precio</th>
              <th style="text-align:right;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`
  }

  return `
    <div style="font-family:'Inter',Helvetica,Arial,sans-serif;max-width:700px;margin:0 auto;color:#1a1a1a;">
      <div style="background:#1a1a1a;padding:32px 40px;text-align:center;">
        <h1 style="font-family:Georgia,'Times New Roman',serif;color:#fff;font-size:28px;font-weight:400;margin:0;">Cotización</h1>
        <p style="color:#c9a96e;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">${quotation.companyName || ''}</p>
      </div>
      <div style="padding:24px 40px;border-bottom:1px solid #e0e0e0;display:flex;gap:32px;flex-wrap:wrap;">
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#999;">Fecha</div>
          <div style="font-size:14px;font-weight:500;">${quotation.date || '—'}</div>
        </div>
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#999;">Evento</div>
          <div style="font-size:14px;font-weight:500;">${quotation.eventDate || '—'}</div>
        </div>
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#999;">Venue</div>
          <div style="font-size:14px;font-weight:500;">${quotation.venue || '—'}</div>
        </div>
        <div>
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#999;">Tipo</div>
          <div style="font-size:14px;font-weight:500;">${quotation.eventType || '—'}</div>
        </div>
      </div>
      <div style="padding:24px 40px;">
        ${sectionsHtml}
        <div style="margin-top:24px;padding-top:16px;border-top:2px solid #1a1a1a;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:3px;">Total</span>
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;">${formatCurrency(total)}</span>
        </div>
      </div>
      ${quotation.notes ? `<div style="padding:16px 40px 32px;border-top:1px solid #e0e0e0;"><div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#999;margin-bottom:6px;">Notas</div><div style="font-size:13px;color:#666;line-height:1.6;">${quotation.notes}</div></div>` : ''}
    </div>`
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

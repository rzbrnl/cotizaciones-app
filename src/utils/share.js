import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'

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

import { Claim } from '../types'
import { formatCurrency, formatDate } from './dataLoader'

export function fillTemplate(text: string, claim: Claim): string {
  const values: Record<string, string> = {
    AZ: claim.AZ,
    Name1: claim.Name1,
    V_Name1: claim.V_Name1,
    Betreff: claim.Betreff,
    Forderungsart: claim.Forderungsart,
    Forderungsgrund: claim.Forderungsgrund,
    Verfahrensstand: claim.Verfahrensstand,
    Hauptforderung: formatCurrency(claim.Hauptforderung),
    Kosten: formatCurrency(claim.Kosten),
    Zinsen: formatCurrency(claim.Zinsen),
    Gesamtforderung: formatCurrency(claim.Gesamtforderung),
    Regulierungssumme: formatCurrency(claim.Regulierungssumme || 0),
    Regulierungsrate: formatCurrency(claim.Regulierungsrate || 0),
    Laufzeit: String(claim.Laufzeit || 0),
    Stand: formatDate(claim.Stand),
  }

  let result = text
  for (const [key, value] of Object.entries(values)) {
    const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    result = result.replace(pattern, value)
  }
  return result
}

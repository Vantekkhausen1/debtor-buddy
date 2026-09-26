import { Claim } from '../types'

export async function loadClaimsData(): Promise<Claim[]> {
  try {
    const response = await fetch('/claims_data.json')
    if (!response.ok) throw new Error('Failed to load claims data')
    return await response.json()
  } catch (error) { console.error('Error loading claims:', error); return [] }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  try {
    const [day, month, year] = dateStr.split('.')
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('de-DE')
  } catch { return dateStr }
}

export function getProcedureColor(status: string): string {
  const colors: Record<string, string> = {
    'Vorgerichtliches Inkasso': 'bg-yellow-100 text-yellow-800',
    'Mahnung': 'bg-orange-100 text-orange-800',
    'Mahnverfahren': 'bg-red-100 text-red-800',
    'Vollstreckungsbescheid': 'bg-red-200 text-red-900',
    'Kontopfändung': 'bg-purple-100 text-purple-800',
    'Zwangsvollstreckung': 'bg-red-300 text-red-900',
    'EV/Vollstreckungsbescheid': 'bg-red-200 text-red-900',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

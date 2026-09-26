import { useState } from 'react'
import { useClaimsStore } from '../store/useClaimsStore'
import { formatCurrency, formatDate, getProcedureColor } from '../utils/dataLoader'
import { X, Euro, Building, User, AlertTriangle, CheckCircle, FileText, Mail as MailIcon, Info } from 'lucide-react'
import DocumentsList from './DocumentsList'
import TemplateGenerator from './TemplateGenerator'

interface ClaimDetailProps { az: string; onClose: () => void; }
type Tab = 'overview' | 'documents' | 'templates'

export default function ClaimDetail({ az, onClose }: ClaimDetailProps) {
  const claims = useClaimsStore((state) => state.claims)
  const updateClaim = useClaimsStore((state) => state.updateClaim)
  const [tab, setTab] = useState<Tab>('overview')

  const claim = claims.find(c => c.AZ === az)

  if (!claim) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <h3 className="text-xl font-bold mb-4">Forderung nicht gefunden</h3>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Schließen</button>
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Übersicht', icon: Info },
    { id: 'documents', label: 'Dokumente', icon: FileText },
    { id: 'templates', label: 'Vorlagen / E-Mail', icon: MailIcon },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold">Forderung: {claim.AZ}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
        </div>

        <div className="sticky top-[65px] bg-white border-b px-6 flex gap-1 z-10">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><Building className="w-5 h-5" /> Gläubiger</h3>
                  <div className="space-y-2">
                    <div><span className="text-sm text-gray-600">Name:</span><p className="font-medium">{claim.Name1}</p></div>
                    <div><span className="text-sm text-gray-600">Betreff:</span><p className="text-sm">{claim.Betreff}</p></div>
                    <div><span className="text-sm text-gray-600">Forderungsart:</span><p className="text-sm">{claim.Forderungsart}</p></div>
                    <div><span className="text-sm text-gray-600">Forderungsgrund:</span><p className="text-sm">{claim.Forderungsgrund}</p></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><User className="w-5 h-5" /> Inkassounternehmen</h3>
                  <div className="space-y-2">
                    <div><span className="text-sm text-gray-600">Name:</span><p className="font-medium">{claim.V_Name1}</p></div>
                    <div><span className="text-sm text-gray-600">Verfahrensstand:</span><span className={`ml-2 px-2 py-1 rounded-full text-xs ${getProcedureColor(claim.Verfahrensstand)}`}>{claim.Verfahrensstand}</span></div>
                    <div><span className="text-sm text-gray-600">Stand:</span><p className="text-sm">{formatDate(claim.Stand)}</p></div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Euro className="w-5 h-5" /> Forderungsaufstellung</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><span className="text-sm text-gray-600">Hauptforderung</span><p className="text-lg font-bold">{formatCurrency(claim.Hauptforderung)}</p></div>
                  <div><span className="text-sm text-gray-600">Kosten</span><p className="text-lg font-bold">{formatCurrency(claim.Kosten)}</p></div>
                  <div><span className="text-sm text-gray-600">Zinsen</span><p className="text-lg font-bold">{formatCurrency(claim.Zinsen)}</p></div>
                  <div><span className="text-sm text-gray-600">Gesamtforderung</span><p className="text-lg font-bold text-green-600">{formatCurrency(claim.Gesamtforderung)}</p></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Status & Merkmale</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><span className="text-sm text-gray-600">Geprüft:</span><p className="font-medium">{claim.geprueft ? 'Ja' : 'Nein'}</p></div>
                  <div><span className="text-sm text-gray-600">Insolvenz:</span><p className={`font-medium ${claim.Inso ? 'text-red-600' : ''}`}>{claim.Inso ? 'Ja' : 'Nein'}</p></div>
                  <div><span className="text-sm text-gray-600">Deliktisch:</span><p className={`font-medium ${claim.Deliktisch ? 'text-red-600' : ''}`}>{claim.Deliktisch ? 'Ja' : 'Nein'}</p></div>
                  <div>
                    <span className="text-sm text-gray-600">Erledigt:</span>
                    <button onClick={() => updateClaim(claim.AZ, { Erledigt: !claim.Erledigt })} className={`px-3 py-1 rounded-full text-xs font-medium ${claim.Erledigt ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {claim.Erledigt ? '✓ Erledigt' : '○ Offen'}
                    </button>
                  </div>
                </div>
              </div>

              {(claim.Regulierungssumme || claim.Rate || claim.Laufzeit) && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Regulierung</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><span className="text-sm text-gray-600">Regulierungssumme:</span><p className="font-bold">{formatCurrency(claim.Regulierungssumme)}</p></div>
                    <div><span className="text-sm text-gray-600">Anteil:</span><p className="font-bold">{claim.Anteil}%</p></div>
                    {claim.Rate > 0 && (<>
                      <div><span className="text-sm text-gray-600">Rate:</span><p className="font-bold">{formatCurrency(claim.Rate)}</p></div>
                      <div><span className="text-sm text-gray-600">Laufzeit:</span><p className="font-bold">{claim.Laufzeit} Monate</p></div>
                    </>)}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'documents' && <DocumentsList az={claim.AZ} />}
          {tab === 'templates' && <TemplateGenerator claim={claim} />}
        </div>
      </div>
    </div>
  )
}

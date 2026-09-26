import { useState } from 'react'
import { Claim } from '../types'
import { DocumentTemplate } from '../types_documents'
import { fillTemplate } from '../utils/templateEngine'
import { sendEmail, openMailClient } from '../utils/emailService'
import templatesData from '../data/templates.json'
import { FileText, Mail, Download, Send, Copy, Check } from 'lucide-react'

interface TemplateGeneratorProps { claim: Claim; }

const templates = templatesData as DocumentTemplate[]

export default function TemplateGenerator({ claim }: TemplateGeneratorProps) {
  const [selectedId, setSelectedId] = useState(templates[0]?.id || '')
  const [generatedSubject, setGeneratedSubject] = useState('')
  const [generatedBody, setGeneratedBody] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const template = templates.find((t) => t.id === selectedId)
    if (!template) return
    setGeneratedSubject(fillTemplate(template.subject, claim))
    setGeneratedBody(fillTemplate(template.body, claim))
    setStatus(null)
  }

  const handleDownloadTxt = () => {
    const blob = new Blob([`${generatedSubject}\n\n${generatedBody}`], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${claim.AZ}_${generatedSubject.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSendEmail = async () => {
    if (!recipientEmail) { setStatus('Bitte E-Mail-Adresse angeben.'); return }
    setSending(true)
    const result = await sendEmail({ to_email: recipientEmail, subject: generatedSubject, message: generatedBody, az: claim.AZ })
    if (result.success) { setStatus('✓ E-Mail wurde versendet.') }
    else { setStatus(`Hinweis: ${result.error} — nutze stattdessen den Mail-Client-Button.`) }
    setSending(false)
  }

  const handleOpenMailClient = () => {
    if (!recipientEmail) { setStatus('Bitte E-Mail-Adresse angeben.'); return }
    openMailClient(recipientEmail, generatedSubject, generatedBody)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${generatedSubject}\n\n${generatedBody}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-sm text-gray-700">Vorlage auswählen</h4>
        <div className="flex gap-3">
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
            {templates.map((t) => (<option key={t.id} value={t.id}>{t.name} ({t.category})</option>))}
          </select>
          <button onClick={generate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <FileText className="w-4 h-4" /> Generieren
          </button>
        </div>
      </div>

      {generatedBody && (
        <div className="bg-white border rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Betreff</label>
            <input type="text" value={generatedSubject} onChange={(e) => setGeneratedSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Text (bearbeitbar)</label>
            <textarea value={generatedBody} onChange={(e) => setGeneratedBody(e.target.value)} rows={10} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleDownloadTxt} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
              <Download className="w-4 h-4" /> Als Datei speichern
            </button>
            <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Kopiert!' : 'Text kopieren'}
            </button>
          </div>
          <div className="border-t pt-3 space-y-2">
            <label className="block text-xs font-medium text-gray-500">E-Mail-Adresse des Empfängers</label>
            <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="empfaenger@beispiel.de" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleSendEmail} disabled={sending} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium">
                <Send className="w-4 h-4" /> {sending ? 'Sende...' : 'Direkt senden'}
              </button>
              <button onClick={handleOpenMailClient} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium">
                <Mail className="w-4 h-4" /> Im Mail-Programm öffnen
              </button>
            </div>
            {status && <p className="text-sm text-gray-600">{status}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

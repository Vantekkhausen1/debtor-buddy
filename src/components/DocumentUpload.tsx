import { useState } from 'react'
import { uploadDocument } from '../utils/documentService'
import { Upload, Loader2 } from 'lucide-react'

interface DocumentUploadProps { az: string; onUploaded: () => void; }

const FILE_TYPES = ['Mahnung', 'Schriftverkehr', 'Beleg', 'Vertrag', 'Bescheid', 'Sonstiges']

export default function DocumentUpload({ az, onUploaded }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState(FILE_TYPES[0])
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)
    const result = await uploadDocument(az, file, fileType, notes)
    if (result.success) { setFile(null); setNotes(''); onUploaded() }
    else { setError(result.error || 'Fehler beim Hochladen') }
    setUploading(false)
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h4 className="font-medium text-sm text-gray-700">Neues Dokument hochladen</h4>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium" />
      <div className="grid grid-cols-2 gap-3">
        <select value={fileType} onChange={(e) => setFileType(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          {FILE_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
        </select>
        <input type="text" placeholder="Notiz (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={handleUpload} disabled={!file || uploading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? 'Wird hochgeladen...' : 'Hochladen'}
      </button>
    </div>
  )
}

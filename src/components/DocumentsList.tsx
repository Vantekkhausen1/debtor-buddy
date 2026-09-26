import { useEffect, useState, useCallback } from 'react'
import { getDocumentsForClaim, getDocumentDownloadUrl, deleteDocument } from '../utils/documentService'
import { ClaimDocument } from '../types_documents'
import DocumentUpload from './DocumentUpload'
import { FileText, Download, Trash2, Loader2 } from 'lucide-react'

interface DocumentsListProps { az: string; }

export default function DocumentsList({ az }: DocumentsListProps) {
  const [documents, setDocuments] = useState<ClaimDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const loadDocuments = useCallback(async () => {
    setLoading(true)
    const docs = await getDocumentsForClaim(az)
    setDocuments(docs)
    setLoading(false)
  }, [az])

  useEffect(() => { loadDocuments() }, [loadDocuments])

  const handleDownload = async (doc: ClaimDocument) => {
    setBusyId(doc.id)
    const url = await getDocumentDownloadUrl(doc.file_path)
    if (url) window.open(url, '_blank')
    setBusyId(null)
  }

  const handleDelete = async (doc: ClaimDocument) => {
    if (!confirm(`"${doc.file_name}" wirklich löschen?`)) return
    setBusyId(doc.id)
    const result = await deleteDocument(doc.id, doc.file_path)
    if (result.success) { await loadDocuments() } else { alert(result.error) }
    setBusyId(null)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      <DocumentUpload az={az} onUploaded={loadDocuments} />
      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
      ) : documents.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">Noch keine Dokumente hochgeladen.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between bg-white border rounded-lg p-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{doc.file_name}</p>
                  <p className="text-xs text-gray-500">{doc.file_type} · {formatSize(doc.file_size)}{doc.notes && ` · ${doc.notes}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleDownload(doc)} disabled={busyId === doc.id} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50" title="Herunterladen">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(doc)} disabled={busyId === doc.id} className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50" title="Löschen">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

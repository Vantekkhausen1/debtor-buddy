import { supabase } from '../lib/supabaseClient'
import { ClaimDocument } from '../types_documents'

const BUCKET = 'claim-documents'

export async function uploadDocument(
  az: string,
  file: File,
  fileType: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = `${az}/${Date.now()}_${file.name}`

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file)
    if (uploadError) throw uploadError

    const { error: dbError } = await supabase.from('documents').insert({
      az, file_name: file.name, file_path: filePath, file_type: fileType,
      file_size: file.size, notes: notes || null,
    })
    if (dbError) throw dbError

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Upload fehlgeschlagen' }
  }
}

export async function getDocumentsForClaim(az: string): Promise<ClaimDocument[]> {
  const { data, error } = await supabase.from('documents').select('*').eq('az', az).order('uploaded_at', { ascending: false })
  if (error) { console.error('Fehler beim Laden der Dokumente:', error); return [] }
  return data as ClaimDocument[]
}

export async function getDocumentDownloadUrl(filePath: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(filePath, 60 * 10)
  if (error) { console.error('Fehler beim Erstellen der Download-URL:', error); return null }
  return data.signedUrl
}

export async function deleteDocument(id: string, filePath: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove([filePath])
    if (storageError) throw storageError
    const { error: dbError } = await supabase.from('documents').delete().eq('id', id)
    if (dbError) throw dbError
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error?.message || 'Löschen fehlgeschlagen' }
  }
}

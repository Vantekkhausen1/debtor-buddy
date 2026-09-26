export interface ClaimDocument {
  id: string;
  az: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  notes?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  created_at?: string;
}

export interface GeneratedDocument {
  id: string;
  az: string;
  template_id: string;
  subject: string;
  content: string;
  generated_at: string;
  sent_by_email: boolean;
  recipient_email?: string;
}

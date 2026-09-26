-- Supabase SQL Editor: einmalig ausführen

create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  az text not null,
  file_name text not null,
  file_path text not null,
  file_type text not null,
  file_size bigint not null,
  notes text,
  uploaded_at timestamptz default now()
);

create index if not exists idx_documents_az on documents(az);

alter table documents enable row level security;

create policy "Allow all access to documents"
  on documents
  for all
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('claim-documents', 'claim-documents', false)
on conflict (id) do nothing;

create policy "Allow all access to claim-documents bucket"
  on storage.objects
  for all
  using (bucket_id = 'claim-documents')
  with check (bucket_id = 'claim-documents');

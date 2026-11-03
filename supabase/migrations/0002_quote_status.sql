alter table public.leads
  add column if not exists quote_sent_at timestamptz;

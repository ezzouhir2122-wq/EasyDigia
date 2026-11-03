alter table public.leads
  add column if not exists quote_requested boolean not null default false;

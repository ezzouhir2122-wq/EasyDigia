create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  service text,
  message text not null,
  locale text not null check (locale in ('fr','en','ar'))
);

alter table public.leads enable row level security;
-- Aucune policy publique : seules les clés service (côté serveur) écrivent/lisent.

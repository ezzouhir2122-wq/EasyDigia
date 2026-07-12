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

-- Le formulaire public écrit avec la clé anon : on autorise UNIQUEMENT l'insertion.
-- Aucune policy de lecture => la table n'est pas lisible publiquement.
drop policy if exists "Allow anonymous inserts" on public.leads;
create policy "Allow anonymous inserts"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

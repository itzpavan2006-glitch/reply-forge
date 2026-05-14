
-- CLIENTS
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  email text,
  company text,
  role text,
  stage text not null default 'new_lead' check (stage in ('new_lead','proposal_sent','negotiation','won','lost')),
  value numeric not null default 0,
  currency text not null default 'USD',
  tags text[] not null default '{}',
  notes text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Clients: owner select" on public.clients for select using (auth.uid() = user_id);
create policy "Clients: owner insert" on public.clients for insert with check (auth.uid() = user_id);
create policy "Clients: owner update" on public.clients for update using (auth.uid() = user_id);
create policy "Clients: owner delete" on public.clients for delete using (auth.uid() = user_id);

create index clients_user_stage_idx on public.clients(user_id, stage);
create index clients_user_updated_idx on public.clients(user_id, updated_at desc);

create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

-- CLIENT ACTIVITIES
create table public.client_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  client_id uuid not null references public.clients(id) on delete cascade,
  type text not null default 'note' check (type in ('note','email','call','meeting','status_change','generation')),
  body text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.client_activities enable row level security;

create policy "Activities: owner select" on public.client_activities for select using (auth.uid() = user_id);
create policy "Activities: owner insert" on public.client_activities for insert with check (auth.uid() = user_id);
create policy "Activities: owner update" on public.client_activities for update using (auth.uid() = user_id);
create policy "Activities: owner delete" on public.client_activities for delete using (auth.uid() = user_id);

create index client_activities_client_idx on public.client_activities(client_id, created_at desc);

-- LINK GENERATIONS TO CLIENTS
alter table public.generations
  add column client_id uuid references public.clients(id) on delete set null;

create index generations_client_idx on public.generations(client_id);

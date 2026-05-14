-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Profiles: owner select" on public.profiles for select using (auth.uid() = id);
create policy "Profiles: owner insert" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles: owner update" on public.profiles for update using (auth.uid() = id);

-- Generations
create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('proposal','reply')),
  tone text not null,
  title text not null default 'Untitled',
  inputs jsonb not null default '{}'::jsonb,
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.generations enable row level security;

create policy "Generations: owner select" on public.generations for select using (auth.uid() = user_id);
create policy "Generations: owner insert" on public.generations for insert with check (auth.uid() = user_id);
create policy "Generations: owner update" on public.generations for update using (auth.uid() = user_id);
create policy "Generations: owner delete" on public.generations for delete using (auth.uid() = user_id);

create index generations_user_created_idx on public.generations(user_id, created_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
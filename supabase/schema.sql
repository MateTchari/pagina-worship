create extension if not exists "pgcrypto";

create type user_role as enum ('admin', 'musico', 'invitado');
create type event_type as enum ('VDM', 'CAMPA', 'OTRO');
create type song_category as enum ('Alabanza', 'Adoracion', 'Rapida', 'Lenta', 'Ministracion', 'Santa Cena', 'Ofrenda', 'Juvenil', 'Otro');

create table public.users_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null default '',
  role user_role not null default 'musico',
  created_at timestamptz not null default now()
);

create table public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null default '',
  category song_category not null default 'Otro',
  default_key text not null default 'C',
  original_key text not null default 'C',
  bpm integer,
  time_signature text,
  capo text,
  tags text[] not null default '{}',
  youtube_url text,
  spotify_url text,
  cifraclub_url text,
  lyrics_chords text not null,
  internal_notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time time not null,
  location text not null default '',
  type event_type not null,
  description text,
  is_public boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_sections (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  order_index integer not null default 1,
  created_at timestamptz not null default now()
);

create table public.event_songs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  section_id uuid not null references public.event_sections(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete restrict,
  selected_key text not null,
  order_index integer not null default 1,
  event_notes text,
  created_at timestamptz not null default now()
);

create table public.practice_status (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  song_id uuid not null references public.songs(id) on delete cascade,
  practiced boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, event_id, song_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_songs_updated_at before update on public.songs for each row execute function public.set_updated_at();
create trigger set_events_updated_at before update on public.events for each row execute function public.set_updated_at();
create trigger set_practice_status_updated_at before update on public.practice_status for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns user_role
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select role from public.users_profiles where user_id = auth.uid()), 'invitado'::user_role);
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users_profiles (user_id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), ''),
    'musico'
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.users_profiles enable row level security;
alter table public.songs enable row level security;
alter table public.events enable row level security;
alter table public.event_sections enable row level security;
alter table public.event_songs enable row level security;
alter table public.practice_status enable row level security;

create policy "profiles read own or admin" on public.users_profiles
for select using (user_id = auth.uid() or public.current_user_role() = 'admin');

create policy "profiles insert own" on public.users_profiles
for insert with check (user_id = auth.uid());

create policy "profiles update own or admin" on public.users_profiles
for update using (user_id = auth.uid() or public.current_user_role() = 'admin')
with check (user_id = auth.uid() or public.current_user_role() = 'admin');

create policy "songs read authenticated" on public.songs
for select using (auth.role() = 'authenticated');

create policy "songs admin write" on public.songs
for all using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "events read authenticated or public" on public.events
for select using (auth.role() = 'authenticated' or is_public = true);

create policy "events admin write" on public.events
for all using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "sections read through event" on public.event_sections
for select using (
  exists (
    select 1 from public.events e
    where e.id = event_sections.event_id
    and (auth.role() = 'authenticated' or e.is_public = true)
  )
);

create policy "sections admin write" on public.event_sections
for all using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "event songs read through event" on public.event_songs
for select using (
  exists (
    select 1 from public.events e
    where e.id = event_songs.event_id
    and (auth.role() = 'authenticated' or e.is_public = true)
  )
);

create policy "event songs admin write" on public.event_songs
for all using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "practice read own" on public.practice_status
for select using (user_id = auth.uid());

create policy "practice upsert own" on public.practice_status
for all using (user_id = auth.uid())
with check (user_id = auth.uid());

create index songs_search_idx on public.songs using gin (to_tsvector('spanish', title || ' ' || artist || ' ' || array_to_string(tags, ' ')));
create index event_sections_event_order_idx on public.event_sections (event_id, order_index);
create index event_songs_section_order_idx on public.event_songs (section_id, order_index);

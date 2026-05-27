-- ============================================================
--  ChurchPresent — Complete Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Themes ──────────────────────────────────────────────────
create table if not exists themes (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  font_family  text not null default 'DM Sans',
  font_size    integer not null default 56,
  font_weight  integer not null default 700,
  text_align   text not null default 'center',
  text_color   text not null default '#FFFFFF',
  shadow       boolean not null default true,
  shadow_blur  integer not null default 24,
  stroke       boolean not null default false,
  stroke_color text not null default '#000000',
  stroke_width integer not null default 2,
  bg_opacity   numeric(4,3) not null default 0.30,
  position     text not null default 'center',
  is_default   boolean not null default false,
  created_at   timestamptz not null default now()
);

insert into themes (name, is_default) values ('Default', true)
  on conflict do nothing;

-- ─── Songs ───────────────────────────────────────────────────
create table if not exists songs (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  artist      text,
  lyrics_raw  text not null default '',
  tags        text[] not null default '{}',
  category    text,
  favorite    boolean not null default false,
  theme_id    uuid references themes(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists songs_tags_idx on songs using gin (tags);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists songs_updated_at on songs;
create trigger songs_updated_at
  before update on songs
  for each row execute function update_updated_at();

-- ─── Bible ───────────────────────────────────────────────────
create table if not exists bible_translations (
  id   text primary key,
  name text not null
);

insert into bible_translations values
  ('KJV','King James Version'),
  ('NIV','New International Version'),
  ('ESV','English Standard Version'),
  ('NLT','New Living Translation')
  on conflict do nothing;

create table if not exists bible_verses (
  id          uuid primary key default gen_random_uuid(),
  translation text not null references bible_translations(id),
  book        text not null,
  book_number integer not null,
  chapter     integer not null,
  verse       integer not null,
  content     text not null,
  unique (translation, book, chapter, verse)
);

create index if not exists bible_content_idx
  on bible_verses using gin (to_tsvector('english', content));

-- ─── Services ────────────────────────────────────────────────
create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  date        date,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists services_updated_at on services;
create trigger services_updated_at
  before update on services
  for each row execute function update_updated_at();

create table if not exists service_items (
  id          uuid primary key default gen_random_uuid(),
  service_id  uuid not null references services(id) on delete cascade,
  type        text not null check (type in ('song','bible','video','image','announcement')),
  ref_id      uuid,
  label       text not null,
  notes       text,
  item_order  integer not null,
  metadata    jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists service_items_service_id_idx
  on service_items(service_id);

-- ─── Media ───────────────────────────────────────────────────
create table if not exists media (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null check (type in ('image','video','loop','countdown')),
  path        text not null,
  url         text,
  size_bytes  bigint,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- ─── Live Session (Realtime Sync) ────────────────────────────
-- One row per active service session. Updated by operator,
-- subscribed to by /output and /stage screens.
create table if not exists live_sessions (
  id                      uuid primary key default gen_random_uuid(),
  session_key             text not null unique default 'default',
  current_slide_id        text,
  current_slide_content   text,
  current_slide_section   text,
  next_slide_content      text,
  next_slide_section      text,
  mode                    text not null default 'clear',
  theme                   jsonb,
  stage_message           text,
  timer_seconds           integer not null default 300,
  timer_running           boolean not null default false,
  updated_at              timestamptz not null default now()
);

-- Create default session row
insert into live_sessions (session_key) values ('default')
  on conflict (session_key) do nothing;

-- Enable realtime on live_sessions
alter publication supabase_realtime add table live_sessions;

-- ─── Row Level Security ──────────────────────────────────────
-- Enable RLS (safe for public church use — no sensitive data)
alter table songs enable row level security;
alter table themes enable row level security;
alter table services enable row level security;
alter table service_items enable row level security;
alter table media enable row level security;
alter table bible_verses enable row level security;
alter table live_sessions enable row level security;

-- Public read + write (restrict later when adding auth)
do $$ begin
  if not exists (select 1 from pg_policies where tablename='songs' and policyname='Public all') then
    create policy "Public all" on songs for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='themes' and policyname='Public all') then
    create policy "Public all" on themes for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='services' and policyname='Public all') then
    create policy "Public all" on services for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='service_items' and policyname='Public all') then
    create policy "Public all" on service_items for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='media' and policyname='Public all') then
    create policy "Public all" on media for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='bible_verses' and policyname='Public read') then
    create policy "Public read" on bible_verses for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='live_sessions' and policyname='Public all') then
    create policy "Public all" on live_sessions for all using (true) with check (true);
  end if;
end $$;

-- ─── Storage Buckets ─────────────────────────────────────────
-- Create storage buckets for media uploads
insert into storage.buckets (id, name, public)
  values ('media', 'media', true)
  on conflict do nothing;

insert into storage.buckets (id, name, public)
  values ('backgrounds', 'backgrounds', true)
  on conflict do nothing;

-- Storage policies
do $$ begin
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='Public media read') then
    create policy "Public media read" on storage.objects
      for select using (bucket_id in ('media', 'backgrounds'));
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='Public media write') then
    create policy "Public media write" on storage.objects
      for insert with check (bucket_id in ('media', 'backgrounds'));
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='Public media delete') then
    create policy "Public media delete" on storage.objects
      for delete using (bucket_id in ('media', 'backgrounds'));
  end if;
end $$;

-- ─── Done ────────────────────────────────────────────────────
-- Schema created successfully!
-- Next step: Go to Settings > API and copy your URL + anon key

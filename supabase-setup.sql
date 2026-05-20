-- ─────────────────────────────────────────────
-- Mijn Broodboek — database setup
-- Plak dit in Supabase SQL Editor en voer uit
-- ─────────────────────────────────────────────

-- 1. Profiles (automatisch aangemaakt bij registratie)
create table if not exists broodboek_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  location    text not null default '',
  badge       text not null default 'Beginnende bakker',
  created_at  timestamptz not null default now()
);

-- 2. Recepten
create table if not exists broodboek_recipes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  description     text not null default '',
  category        text not null default 'Wit brood',
  rijsmiddel      text not null default 'Gist',
  difficulty      text not null default 'Makkelijk',
  bak_time        text not null default '',
  total_time      text not null default '',
  hydration       int  not null default 65,
  zout_pct        numeric(4,1) not null default 2.0,
  rijsmiddel_pct  numeric(4,1) not null default 1.0,
  total_meel      int  not null default 0,
  image_url       text,
  shared          boolean not null default false,
  rating          numeric(2,1) not null default 0,
  created_at      timestamptz not null default now()
);

-- 3. Ingrediënten (genormaliseerd)
create table if not exists broodboek_ingredients (
  id          bigint generated always as identity primary key,
  recipe_id   uuid not null references broodboek_recipes(id) on delete cascade,
  name        text not null,
  grams       int  not null default 0,
  percentage  numeric(5,1),
  type        text not null default 'overig',
  sort_order  int  not null default 0
);

-- 4. Werkwijze-stappen
create table if not exists broodboek_steps (
  id          bigint generated always as identity primary key,
  recipe_id   uuid not null references broodboek_recipes(id) on delete cascade,
  nr          int  not null,
  title       text not null,
  description text not null default '',
  duration    text
);

-- 5. Opgeslagen recepten (favorieten)
create table if not exists broodboek_saved (
  user_id    uuid not null references auth.users(id) on delete cascade,
  recipe_id  uuid not null references broodboek_recipes(id) on delete cascade,
  saved_at   timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────

alter table broodboek_profiles    enable row level security;
alter table broodboek_recipes     enable row level security;
alter table broodboek_ingredients enable row level security;
alter table broodboek_steps       enable row level security;
alter table broodboek_saved       enable row level security;

-- Profiles: alleen eigen profiel lezen/bewerken
create policy "Eigen profiel lezen"    on broodboek_profiles for select using (auth.uid() = id);
create policy "Eigen profiel aanmaken" on broodboek_profiles for insert with check (auth.uid() = id);
create policy "Eigen profiel bijwerken" on broodboek_profiles for update using (auth.uid() = id);

-- Recepten: eigen recepten volledig beheren, gedeelde recepten publiek leesbaar
create policy "Eigen recepten beheren"  on broodboek_recipes for all    using (auth.uid() = user_id);
create policy "Gedeelde recepten lezen" on broodboek_recipes for select using (shared = true);

-- Ingrediënten: leesbaar als het recept van jou is of gedeeld
create policy "Ingrediënten lezen" on broodboek_ingredients for select
  using (exists (
    select 1 from broodboek_recipes r
    where r.id = recipe_id and (r.user_id = auth.uid() or r.shared = true)
  ));
create policy "Ingrediënten beheren" on broodboek_ingredients for all
  using (exists (
    select 1 from broodboek_recipes r
    where r.id = recipe_id and r.user_id = auth.uid()
  ));

-- Stappen: zelfde logica
create policy "Stappen lezen" on broodboek_steps for select
  using (exists (
    select 1 from broodboek_recipes r
    where r.id = recipe_id and (r.user_id = auth.uid() or r.shared = true)
  ));
create policy "Stappen beheren" on broodboek_steps for all
  using (exists (
    select 1 from broodboek_recipes r
    where r.id = recipe_id and r.user_id = auth.uid()
  ));

-- Opgeslagen: eigen favorieten beheren
create policy "Eigen opgeslagen beheren" on broodboek_saved for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Trigger: profiel automatisch aanmaken bij registratie
-- ─────────────────────────────────────────────
create or replace function handle_new_broodboek_user()
returns trigger language plpgsql security definer as $$
begin
  insert into broodboek_profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$;

create or replace trigger on_broodboek_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_broodboek_user();

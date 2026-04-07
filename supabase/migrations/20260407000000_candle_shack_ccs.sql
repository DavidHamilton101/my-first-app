-- ============================================================
-- Candle Shack Change Control System — Initial Migration
-- ============================================================

-- SYSTEMS TABLE
create table if not exists public.systems (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  hidden     boolean not null default false,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- APPROVERS TABLE
create table if not exists public.approvers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null unique,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- CHANGES TABLE
create table if not exists public.changes (
  id                     uuid primary key default gen_random_uuid(),
  title                  text not null,
  type                   text not null default 'normal',
  system_id              uuid references public.systems(id) on delete set null,
  system_name            text,
  description            text,
  planned_start          timestamptz,
  planned_end            timestamptz,
  business_justification text,
  assignee_name          text,
  assignee_email         text,
  approver_name          text,
  approver_email         text,
  risk_level             text,
  impact_level           text,
  back_out_plan          text,
  cab_review_date        date,
  status                 text not null default 'draft',
  requester_name         text not null,
  requester_email        text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger changes_updated_at
  before update on public.changes
  for each row execute procedure public.set_updated_at();

-- AUDIT ENTRIES TABLE (immutable, append-only)
create table if not exists public.audit_entries (
  id         uuid primary key default gen_random_uuid(),
  change_id  uuid not null references public.changes(id) on delete cascade,
  action     text not null,
  actor_name text not null,
  note       text,
  created_at timestamptz not null default now()
);

-- Prevent updates/deletes on audit_entries
create or replace function public.audit_immutable()
returns trigger language plpgsql as $$
begin
  raise exception 'audit_entries rows are immutable';
end;
$$;

create trigger audit_no_update
  before update on public.audit_entries
  for each row execute procedure public.audit_immutable();

create trigger audit_no_delete
  before delete on public.audit_entries
  for each row execute procedure public.audit_immutable();

-- INDEXES
create index if not exists idx_changes_status on public.changes(status);
create index if not exists idx_changes_system_id on public.changes(system_id);
create index if not exists idx_changes_created on public.changes(created_at desc);
create index if not exists idx_audit_change_id on public.audit_entries(change_id);

-- RLS (open policies — no auth in this app)
alter table public.systems       enable row level security;
alter table public.approvers     enable row level security;
alter table public.changes       enable row level security;
alter table public.audit_entries enable row level security;

create policy "anon all systems"   on public.systems       for all to anon using (true) with check (true);
create policy "anon all approvers" on public.approvers     for all to anon using (true) with check (true);
create policy "anon all changes"   on public.changes       for all to anon using (true) with check (true);
create policy "anon read audit"    on public.audit_entries for select to anon using (true);
create policy "anon insert audit"  on public.audit_entries for insert to anon with check (true);

-- REALTIME
alter publication supabase_realtime add table public.changes;

-- ============================================================
-- SEED DATA
-- ============================================================

insert into public.systems (name, is_default) values
  ('Orderwise ERP',           true),
  ('Orderwise User Settings', true),
  ('Shopify',                 true),
  ('New Start',               true),
  ('Leaver',                  true),
  ('Other',                   true)
on conflict (name) do nothing;

insert into public.approvers (name, email) values
  ('David Hamilton',  'david.hamilton@candle-shack.co.uk'),
  ('Lynne McNulty',   'lynne.mcnulty@candle-shack.co.uk'),
  ('Duncan MacLean',  'duncan.maclean@candle-shack.co.uk')
on conflict (email) do nothing;

-- KPI metrics
create table if not exists kpi_metrics (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  change_pct numeric not null,
  period_label text not null default 'vs last month',
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text not null unique,
  units_sold integer not null default 0,
  revenue text not null,
  stock integer not null default 0,
  status text not null default 'healthy' check (status in ('healthy', 'low', 'out')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sales channels
create table if not exists sales_channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  orders integer not null default 0,
  revenue text not null,
  share_pct integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Monthly revenue
create table if not exists monthly_revenue (
  id uuid primary key default gen_random_uuid(),
  month_label text not null,
  sort_order integer not null default 0,
  value bigint not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Disable RLS for demo (enable + add policies before going to production)
alter table kpi_metrics disable row level security;
alter table products disable row level security;
alter table sales_channels disable row level security;
alter table monthly_revenue disable row level security;

-- Seed data
insert into kpi_metrics (label, value, change_pct, period_label, sort_order) values
  ('Total Revenue',    '£2,847,320', 12.4,  'vs last month', 1),
  ('Orders',           '18,492',      8.1,  'vs last month', 2),
  ('Avg. Order Value', '£154',        -2.3, 'vs last month', 3),
  ('Conversion Rate',  '3.8%',         0.4, 'vs last month', 4),
  ('New Customers',    '4,201',        15.2, 'vs last month', 5),
  ('Return Rate',      '6.2%',         -1.1, 'vs last month', 6)
on conflict do nothing;

insert into products (name, sku, units_sold, revenue, stock, status) values
  ('Luxury Soy Candle — Vanilla & Amber', 'CSC-001', 3842, '£192,100', 412, 'healthy'),
  ('Reed Diffuser Set — Bergamot',         'RDS-014', 2910, '£145,500',  88, 'low'),
  ('Beeswax Pillar Candle — Twin Pack',    'BWP-007', 2540, '£127,000',   0, 'out'),
  ('Gift Set — Relaxation Collection',     'GS-022',  2101, '£210,100', 203, 'healthy'),
  ('Scented Candle — Rose & Oud',          'CSC-019', 1876,  '£93,800',  34, 'low')
on conflict (sku) do nothing;

insert into sales_channels (name, orders, revenue, share_pct, sort_order) values
  ('Direct / Website', 8420, '£1,284,720', 45, 1),
  ('Amazon',           5210,   '£796,330', 28, 2),
  ('Etsy',             2840,   '£341,880', 12, 3),
  ('Wholesale',        1420,   '£341,880', 12, 4),
  ('Other',             602,    '£82,510',  3, 5)
on conflict do nothing;

insert into monthly_revenue (month_label, value, sort_order) values
  ('Oct', 2100000, 1),
  ('Nov', 2680000, 2),
  ('Dec', 3920000, 3),
  ('Jan', 1840000, 4),
  ('Feb', 2210000, 5),
  ('Mar', 2847320, 6)
on conflict do nothing;

-- Canti OS Supabase Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- CLIENTS Table
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  alias text,
  email text unique,
  phone text,
  instagram text,
  tiktok text,
  bio text,
  whatsapp_link text,
  source text,
  brand text check (brand in ('Canti Records', 'Canti Media')),
  status text default 'Active',
  last_contact_date timestamp with time zone default now(),
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- PROJECTS Table
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete cascade,
  title text not null,
  type text,
  status text default 'Active',
  progress integer default 0,
  value numeric(10, 2) default 0,
  start_date timestamp with time zone default now(),
  target_date timestamp with time zone,
  genre text,
  created_at timestamp with time zone default now()
);

-- PAYMENTS Table
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  amount numeric(10, 2) not null,
  date timestamp with time zone default now(),
  description text,
  created_at timestamp with time zone default now()
);

-- INVOICES Table
create table if not exists public.invoices (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete cascade,
  amount numeric(10, 2) not null,
  status text default 'Draft',
  due_date timestamp with time zone,
  items text[] default '{}',
  sent_at timestamp with time zone,
  viewed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- LEADS Table
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  source text,
  date timestamp with time zone default now(),
  platform text,
  status text default 'Cold',
  initial_budget numeric(10, 2),
  created_at timestamp with time zone default now()
);

-- ASSETS Table
create table if not exists public.assets (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  type text,
  url text not null,
  uploaded_at timestamp with time zone default now(),
  size text,
  created_at timestamp with time zone default now()
);

-- CONVERSATIONS Table
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete cascade,
  sender text check (sender in ('client', 'operator')),
  text text not null,
  timestamp timestamp with time zone default now(),
  platform text,
  created_at timestamp with time zone default now()
);

-- RLS Policies (Basic setup, adjust as needed)
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.leads enable row level security;
alter table public.assets enable row level security;
alter table public.messages enable row level security;

-- Simple policy: All authenticated users can read/write (Modify for production!)
create policy "Allow authenticated all" on public.clients for all using (auth.role() = 'authenticated');
create policy "Allow authenticated all" on public.projects for all using (auth.role() = 'authenticated');
create policy "Allow authenticated all" on public.payments for all using (auth.role() = 'authenticated');
create policy "Allow authenticated all" on public.invoices for all using (auth.role() = 'authenticated');
create policy "Allow authenticated all" on public.leads for all using (auth.role() = 'authenticated');
create policy "Allow authenticated all" on public.assets for all using (auth.role() = 'authenticated');
create policy "Allow authenticated all" on public.messages for all using (auth.role() = 'authenticated');

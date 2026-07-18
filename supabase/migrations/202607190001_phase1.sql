create extension if not exists pgcrypto;
create schema if not exists private;

create type public.app_role as enum ('super_admin', 'academy_ops', 'assessor', 'candidate');
create type public.account_status as enum ('active', 'invited', 'disabled');
create type public.application_status as enum ('new', 'screening', 'interview', 'accepted', 'waitlisted', 'declined');
create type public.application_source as enum ('website', 'manual', 'referral');
create type public.cohort_status as enum ('draft', 'enrolling', 'active', 'completed');
create type public.enrollment_status as enum ('invited', 'enrolled', 'active', 'completed', 'withdrawn');
create type public.activity_entity as enum ('application', 'cohort', 'enrollment', 'session', 'user');

create sequence public.caio_application_number_seq start with 26081;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role public.app_role not null default 'candidate',
  status public.account_status not null default 'active',
  application_id uuid,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  application_number text not null unique default ('CAIO-' || nextval('public.caio_application_number_seq')),
  full_name text not null,
  email text not null,
  phone text not null,
  location text not null,
  "current_role" text not null,
  industry text not null,
  experience text not null default 'Not provided',
  ai_level text not null default 'Not assessed',
  track text not null,
  workflow_goal text not null default '',
  motivation text not null default '',
  schedule_commitment text not null default 'Not confirmed',
  investment_readiness text not null default 'Not confirmed',
  linkedin_url text not null default '',
  status public.application_status not null default 'new',
  score smallint check (score between 0 and 100),
  notes text not null default '',
  source public.application_source not null default 'website',
  consent boolean not null default true,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_application_id_fkey foreign key (application_id) references public.applications(id) on delete set null;

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  program text not null default 'Certified AI Operations Professional',
  start_date date not null,
  end_date date not null,
  schedule text not null,
  capacity integer not null check (capacity > 0 and capacity <= 500),
  status public.cohort_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  status public.enrollment_status not null default 'invited',
  progress smallint not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  unique (cohort_id, application_id)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type public.activity_entity not null,
  entity_id text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create index applications_status_idx on public.applications(status);
create index applications_email_idx on public.applications(lower(email));
create index applications_created_at_idx on public.applications(created_at desc);
create index enrollments_cohort_idx on public.enrollments(cohort_id);
create index activities_created_at_idx on public.activities(created_at desc);

create or replace function private.actor_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select coalesce(private.actor_role() in ('super_admin', 'academy_ops', 'assessor'), false) $$;

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    'candidate'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure private.handle_new_auth_user();

create or replace function private.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger applications_set_updated_at before update on public.applications
for each row execute procedure private.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute procedure private.set_updated_at();

alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.cohorts enable row level security;
alter table public.enrollments enable row level security;
alter table public.activities enable row level security;

create policy "profiles self or staff read" on public.profiles for select to authenticated
using (id = auth.uid() or private.is_staff());
create policy "super admins manage profiles" on public.profiles for all to authenticated
using (private.actor_role() = 'super_admin') with check (private.actor_role() = 'super_admin');

create policy "staff read applications" on public.applications for select to authenticated
using (private.is_staff());
create policy "staff manage applications" on public.applications for all to authenticated
using (private.is_staff()) with check (private.is_staff());
create policy "candidate reads linked application" on public.applications for select to authenticated
using (id = (select application_id from public.profiles where id = auth.uid()));

create policy "staff manage cohorts" on public.cohorts for all to authenticated
using (private.is_staff()) with check (private.is_staff());
create policy "candidate reads enrolled cohort" on public.cohorts for select to authenticated
using (exists (
  select 1 from public.enrollments e
  join public.profiles p on p.application_id = e.application_id
  where e.cohort_id = cohorts.id and p.id = auth.uid()
));

create policy "staff manage enrollments" on public.enrollments for all to authenticated
using (private.is_staff()) with check (private.is_staff());
create policy "candidate reads own enrollment" on public.enrollments for select to authenticated
using (application_id = (select application_id from public.profiles where id = auth.uid()));

create policy "staff read activities" on public.activities for select to authenticated
using (private.is_staff());
create policy "staff write activities" on public.activities for insert to authenticated
with check (private.is_staff());

revoke all on function private.actor_role() from public;
revoke all on function private.is_staff() from public;
revoke all on function private.handle_new_auth_user() from public;
revoke all on function private.set_updated_at() from public;

grant usage on schema private to authenticated;
grant execute on function private.actor_role() to authenticated;
grant execute on function private.is_staff() to authenticated;

grant select, insert, update, delete on table
  public.profiles,
  public.applications,
  public.cohorts,
  public.enrollments,
  public.activities
to authenticated;

grant select, insert, update, delete on table
  public.profiles,
  public.applications,
  public.cohorts,
  public.enrollments,
  public.activities
to service_role;

grant usage, select on sequence public.caio_application_number_seq to authenticated, service_role;

comment on table public.applications is 'CAIO admissions records received from the public website and staff intake.';
comment on table public.activities is 'Append-only operational audit events for Lymora OS.';

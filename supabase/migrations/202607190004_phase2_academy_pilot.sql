alter type public.activity_entity add value if not exists 'assessment';
alter type public.activity_entity add value if not exists 'credential';

create type public.learning_module_status as enum ('draft', 'published', 'archived');
create type public.cohort_module_status as enum ('locked', 'open', 'completed');
create type public.session_delivery_mode as enum ('live_online', 'in_person', 'hybrid');
create type public.session_status as enum ('scheduled', 'live', 'completed', 'cancelled');
create type public.attendance_status as enum ('present', 'late', 'excused', 'absent');
create type public.submission_status as enum ('not_started', 'submitted', 'under_review', 'revision_requested', 'accepted');
create type public.assessment_outcome as enum ('pass', 'resubmit', 'fail');
create type public.credential_status as enum ('eligible', 'issued', 'revoked', 'expired');
create type public.credential_classification as enum ('pass', 'distinction');

create table public.learning_modules (
  id uuid primary key default gen_random_uuid(),
  program_code text not null default 'CAIO',
  code text not null,
  week_number smallint not null check (week_number between 1 and 52),
  title text not null,
  summary text not null,
  competency_domain text not null,
  live_hours numeric(4,1) not null default 0 check (live_hours between 0 and 40),
  status public.learning_module_status not null default 'draft',
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  unique (program_code, code)
);

create table public.cohort_modules (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  module_id uuid not null references public.learning_modules(id) on delete restrict,
  opens_at timestamptz not null,
  due_at timestamptz not null,
  status public.cohort_module_status not null default 'locked',
  unique (cohort_id, module_id),
  check (due_at > opens_at)
);

create table public.cohort_sessions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  module_id uuid references public.learning_modules(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  delivery_mode public.session_delivery_mode not null default 'live_online',
  join_url text not null default '',
  status public.session_status not null default 'scheduled',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.cohort_sessions(id) on delete cascade,
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  status public.attendance_status not null,
  minutes_attended smallint not null default 0 check (minutes_attended between 0 and 1440),
  notes text not null default '',
  marked_by uuid references public.profiles(id) on delete set null,
  marked_at timestamptz not null default now(),
  unique (session_id, enrollment_id)
);

create table public.assessment_components (
  id uuid primary key default gen_random_uuid(),
  program_code text not null default 'CAIO',
  code text not null,
  title text not null,
  description text not null,
  weight smallint not null check (weight between 1 and 100),
  pass_threshold smallint not null default 60 check (pass_threshold between 0 and 100),
  responsible_ai_gate boolean not null default false,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  unique (program_code, code)
);

create table public.assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  component_id uuid not null references public.assessment_components(id) on delete restrict,
  status public.submission_status not null default 'not_started',
  evidence_url text not null default '',
  submission_notes text not null default '',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, component_id)
);

create table public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.assessment_submissions(id) on delete cascade,
  score numeric(5,2) not null check (score between 0 and 100),
  outcome public.assessment_outcome not null,
  feedback text not null default '',
  graded_by uuid references public.profiles(id) on delete set null,
  graded_at timestamptz not null default now()
);

create table public.credentials (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null unique references public.enrollments(id) on delete cascade,
  credential_number text not null unique,
  status public.credential_status not null default 'eligible',
  overall_score numeric(5,2) not null check (overall_score between 0 and 100),
  classification public.credential_classification not null,
  issued_at timestamptz,
  expires_at timestamptz,
  verification_code text not null unique default encode(gen_random_bytes(12), 'hex'),
  issued_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (expires_at is null or issued_at is null or expires_at > issued_at)
);

create index cohort_modules_cohort_id_idx on public.cohort_modules(cohort_id);
create index cohort_modules_module_id_idx on public.cohort_modules(module_id);
create index cohort_sessions_cohort_id_idx on public.cohort_sessions(cohort_id);
create index cohort_sessions_module_id_idx on public.cohort_sessions(module_id);
create index cohort_sessions_starts_at_idx on public.cohort_sessions(starts_at);
create index cohort_sessions_created_by_idx on public.cohort_sessions(created_by);
create index attendance_records_enrollment_id_idx on public.attendance_records(enrollment_id);
create index attendance_records_marked_by_idx on public.attendance_records(marked_by);
create index assessment_submissions_component_id_idx on public.assessment_submissions(component_id);
create index assessment_results_graded_by_idx on public.assessment_results(graded_by);
create index credentials_issued_by_idx on public.credentials(issued_by);

create trigger assessment_submissions_set_updated_at before update on public.assessment_submissions
for each row execute procedure private.set_updated_at();

create or replace function private.owns_enrollment(target_enrollment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollments e
    join public.profiles p on p.application_id = e.application_id
    where e.id = target_enrollment_id
      and p.id = (select auth.uid())
  )
$$;

create or replace function private.can_access_cohort(target_cohort_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.enrollments e
    join public.profiles p on p.application_id = e.application_id
    where e.cohort_id = target_cohort_id
      and p.id = (select auth.uid())
  )
$$;

revoke all on function private.owns_enrollment(uuid) from public;
revoke all on function private.can_access_cohort(uuid) from public;
grant execute on function private.owns_enrollment(uuid) to authenticated;
grant execute on function private.can_access_cohort(uuid) to authenticated;

alter table public.learning_modules enable row level security;
alter table public.cohort_modules enable row level security;
alter table public.cohort_sessions enable row level security;
alter table public.attendance_records enable row level security;
alter table public.assessment_components enable row level security;
alter table public.assessment_submissions enable row level security;
alter table public.assessment_results enable row level security;
alter table public.credentials enable row level security;

create policy "authenticated read learning modules" on public.learning_modules for select to authenticated
using ((select private.is_staff()) or status = 'published');
create policy "staff insert learning modules" on public.learning_modules for insert to authenticated
with check ((select private.is_staff()));
create policy "staff update learning modules" on public.learning_modules for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete learning modules" on public.learning_modules for delete to authenticated
using ((select private.is_staff()));

create policy "authorised read cohort modules" on public.cohort_modules for select to authenticated
using ((select private.is_staff()) or private.can_access_cohort(cohort_id));
create policy "staff insert cohort modules" on public.cohort_modules for insert to authenticated
with check ((select private.is_staff()));
create policy "staff update cohort modules" on public.cohort_modules for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete cohort modules" on public.cohort_modules for delete to authenticated
using ((select private.is_staff()));

create policy "authorised read cohort sessions" on public.cohort_sessions for select to authenticated
using ((select private.is_staff()) or private.can_access_cohort(cohort_id));
create policy "staff insert cohort sessions" on public.cohort_sessions for insert to authenticated
with check ((select private.is_staff()));
create policy "staff update cohort sessions" on public.cohort_sessions for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete cohort sessions" on public.cohort_sessions for delete to authenticated
using ((select private.is_staff()));

create policy "authorised read attendance" on public.attendance_records for select to authenticated
using ((select private.is_staff()) or private.owns_enrollment(enrollment_id));
create policy "staff insert attendance" on public.attendance_records for insert to authenticated
with check ((select private.is_staff()));
create policy "staff update attendance" on public.attendance_records for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete attendance" on public.attendance_records for delete to authenticated
using ((select private.is_staff()));

create policy "authenticated read assessment components" on public.assessment_components for select to authenticated
using (true);
create policy "staff insert assessment components" on public.assessment_components for insert to authenticated
with check ((select private.is_staff()));
create policy "staff update assessment components" on public.assessment_components for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete assessment components" on public.assessment_components for delete to authenticated
using ((select private.is_staff()));

create policy "authorised read submissions" on public.assessment_submissions for select to authenticated
using ((select private.is_staff()) or private.owns_enrollment(enrollment_id));
create policy "authorised insert submissions" on public.assessment_submissions for insert to authenticated
with check ((select private.is_staff()) or private.owns_enrollment(enrollment_id));
create policy "authorised update submissions" on public.assessment_submissions for update to authenticated
using ((select private.is_staff()) or private.owns_enrollment(enrollment_id))
with check ((select private.is_staff()) or private.owns_enrollment(enrollment_id));
create policy "staff delete submissions" on public.assessment_submissions for delete to authenticated
using ((select private.is_staff()));

create policy "authorised read assessment results" on public.assessment_results for select to authenticated
using (
  (select private.is_staff())
  or exists (
    select 1 from public.assessment_submissions s
    where s.id = assessment_results.submission_id
      and private.owns_enrollment(s.enrollment_id)
  )
);
create policy "staff insert assessment results" on public.assessment_results for insert to authenticated
with check ((select private.is_staff()));
create policy "staff update assessment results" on public.assessment_results for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete assessment results" on public.assessment_results for delete to authenticated
using ((select private.is_staff()));

create policy "authorised read credentials" on public.credentials for select to authenticated
using ((select private.is_staff()) or private.owns_enrollment(enrollment_id));
create policy "staff insert credentials" on public.credentials for insert to authenticated
with check ((select private.is_staff()));
create policy "staff update credentials" on public.credentials for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete credentials" on public.credentials for delete to authenticated
using ((select private.is_staff()));

grant select, insert, update, delete on table
  public.learning_modules,
  public.cohort_modules,
  public.cohort_sessions,
  public.attendance_records,
  public.assessment_components,
  public.assessment_submissions,
  public.assessment_results,
  public.credentials
to authenticated, service_role;

comment on table public.assessment_results is 'Independent scores and feedback for CAIO assessment evidence.';
comment on table public.credentials is 'Internal credential registry for issued and revocable Lymora certifications.';

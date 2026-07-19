create type public.proof_content_status as enum ('draft', 'review', 'approved', 'published');
create type public.proof_engagement_type as enum ('academy', 'team_enablement', 'workforce', 'workflow_implementation');
create type public.metric_direction as enum ('increase', 'decrease', 'maintain');
create type public.testimonial_permission as enum ('pending', 'approved', 'declined');
create type public.role_specialisation_status as enum ('draft', 'pilot', 'proven', 'retired');
create type public.partnership_type as enum ('business_community', 'training_provider', 'professional_association', 'recruiter', 'technology_provider', 'referral_partner');
create type public.partnership_status as enum ('prospect', 'conversation', 'active', 'paused', 'closed');
create type public.partner_referral_status as enum ('referred', 'qualified', 'converted', 'lost');
create type public.benchmark_status as enum ('emerging', 'validated', 'reference');

alter type public.activity_entity add value if not exists 'outcome_report';
alter type public.activity_entity add value if not exists 'case_study';
alter type public.activity_entity add value if not exists 'testimonial';
alter type public.activity_entity add value if not exists 'specialisation';
alter type public.activity_entity add value if not exists 'partnership';
alter type public.activity_entity add value if not exists 'referral';
alter type public.activity_entity add value if not exists 'benchmark';

create table public.outcome_reports (
  id uuid primary key default gen_random_uuid(),
  report_number text not null unique,
  account_id uuid references public.corporate_accounts(id) on delete set null,
  opportunity_id uuid references public.corporate_opportunities(id) on delete set null,
  deployment_id uuid references public.workforce_deployments(id) on delete set null,
  cohort_id uuid references public.cohorts(id) on delete set null,
  expansion_opportunity_id uuid references public.corporate_opportunities(id) on delete set null,
  title text not null,
  engagement_type public.proof_engagement_type not null,
  status public.proof_content_status not null default 'draft',
  period_start date not null,
  period_end date not null,
  executive_summary text not null default '',
  baseline_summary text not null default '',
  outcomes_summary text not null default '',
  recommendations text not null default '',
  client_approved boolean not null default false,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_end >= period_start),
  check (account_id is not null or deployment_id is not null or cohort_id is not null or opportunity_id is not null),
  check (status <> 'published' or client_approved)
);

create index outcome_reports_account_idx on public.outcome_reports(account_id);
create index outcome_reports_opportunity_idx on public.outcome_reports(opportunity_id);
create index outcome_reports_deployment_idx on public.outcome_reports(deployment_id);
create index outcome_reports_cohort_idx on public.outcome_reports(cohort_id);
create index outcome_reports_expansion_idx on public.outcome_reports(expansion_opportunity_id);
create index outcome_reports_approved_by_idx on public.outcome_reports(approved_by);
create index outcome_reports_created_by_idx on public.outcome_reports(created_by);
create index outcome_reports_status_period_idx on public.outcome_reports(status, period_end desc);

create table public.outcome_metrics (
  id uuid primary key default gen_random_uuid(),
  outcome_report_id uuid not null references public.outcome_reports(id) on delete cascade,
  name text not null,
  unit text not null,
  baseline_value numeric(14,2) not null,
  current_value numeric(14,2) not null,
  target_value numeric(14,2),
  direction public.metric_direction not null default 'increase',
  evidence_source text not null default '',
  verified boolean not null default false,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (outcome_report_id, name)
);

create index outcome_metrics_report_idx on public.outcome_metrics(outcome_report_id, sort_order);

create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  outcome_report_id uuid not null unique references public.outcome_reports(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  client_display_name text not null,
  industry text not null default '',
  summary text not null default '',
  challenge text not null default '',
  intervention text not null default '',
  result text not null default '',
  evidence_note text not null default '',
  status public.proof_content_status not null default 'draft',
  featured boolean not null default false,
  publication_consent boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'published' or publication_consent)
);

create index case_studies_created_by_idx on public.case_studies(created_by);
create index case_studies_published_idx on public.case_studies(published_at desc) where status = 'published';

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references public.corporate_accounts(id) on delete set null,
  case_study_id uuid references public.case_studies(id) on delete set null,
  quote text not null,
  attribution_name text not null,
  attribution_title text not null default '',
  attribution_company text not null default '',
  permission public.testimonial_permission not null default 'pending',
  source text not null default '',
  status public.proof_content_status not null default 'draft',
  collected_at date not null default current_date,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'published' or permission = 'approved')
);

create index testimonials_account_idx on public.testimonials(account_id);
create index testimonials_case_study_idx on public.testimonials(case_study_id);
create index testimonials_created_by_idx on public.testimonials(created_by);
create index testimonials_permission_idx on public.testimonials(permission, status);

create table public.role_specialisations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  operator_type public.workforce_operator_type not null,
  target_department text not null,
  promise text not null default '',
  responsibilities text[] not null default '{}',
  approved_tools text[] not null default '{}',
  success_metrics text[] not null default '{}',
  readiness_requirements text not null default '',
  target_hours_saved_month numeric(8,2) not null default 0 check (target_hours_saved_month >= 0),
  status public.role_specialisation_status not null default 'draft',
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index role_specialisations_owner_idx on public.role_specialisations(owner_id);
create index role_specialisations_status_type_idx on public.role_specialisations(status, operator_type);

create table public.partnerships (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  type public.partnership_type not null,
  status public.partnership_status not null default 'prospect',
  contact_name text not null default '',
  contact_email text not null default '',
  contact_phone text not null default '',
  website text not null default '',
  value_proposition text not null default '',
  next_step text not null default '',
  next_step_due_at date,
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partnerships_owner_idx on public.partnerships(owner_id);
create index partnerships_status_due_idx on public.partnerships(status, next_step_due_at);

create table public.partner_referrals (
  id uuid primary key default gen_random_uuid(),
  partnership_id uuid not null references public.partnerships(id) on delete cascade,
  account_id uuid references public.corporate_accounts(id) on delete set null,
  opportunity_id uuid references public.corporate_opportunities(id) on delete set null,
  contact_name text not null default '',
  company_name text not null,
  status public.partner_referral_status not null default 'referred',
  estimated_value_aed numeric(12,2) not null default 0 check (estimated_value_aed >= 0),
  notes text not null default '',
  referred_at date not null default current_date,
  converted_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index partner_referrals_partnership_idx on public.partner_referrals(partnership_id, referred_at desc);
create index partner_referrals_account_idx on public.partner_referrals(account_id);
create index partner_referrals_opportunity_idx on public.partner_referrals(opportunity_id);
create index partner_referrals_created_by_idx on public.partner_referrals(created_by);
create index partner_referrals_status_idx on public.partner_referrals(status, referred_at desc);

create table public.repeatability_benchmarks (
  id uuid primary key default gen_random_uuid(),
  specialisation_id uuid references public.role_specialisations(id) on delete set null,
  engagement_type public.proof_engagement_type not null,
  industry text not null default 'Cross-industry',
  metric_name text not null,
  unit text not null,
  sample_size integer not null default 1 check (sample_size > 0),
  median_baseline numeric(14,2) not null,
  median_result numeric(14,2) not null,
  improvement_percent numeric(8,2) not null,
  evidence_threshold integer not null default 3 check (evidence_threshold > 0),
  status public.benchmark_status not null default 'emerging',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (specialisation_id, engagement_type, industry, metric_name)
);

create index repeatability_benchmarks_specialisation_idx on public.repeatability_benchmarks(specialisation_id);
create index repeatability_benchmarks_reviewed_by_idx on public.repeatability_benchmarks(reviewed_by);
create index repeatability_benchmarks_status_idx on public.repeatability_benchmarks(status, sample_size desc);

create trigger outcome_reports_set_updated_at before update on public.outcome_reports
for each row execute function private.set_updated_at();
create trigger outcome_metrics_set_updated_at before update on public.outcome_metrics
for each row execute function private.set_updated_at();
create trigger case_studies_set_updated_at before update on public.case_studies
for each row execute function private.set_updated_at();
create trigger testimonials_set_updated_at before update on public.testimonials
for each row execute function private.set_updated_at();
create trigger role_specialisations_set_updated_at before update on public.role_specialisations
for each row execute function private.set_updated_at();
create trigger partnerships_set_updated_at before update on public.partnerships
for each row execute function private.set_updated_at();
create trigger partner_referrals_set_updated_at before update on public.partner_referrals
for each row execute function private.set_updated_at();
create trigger repeatability_benchmarks_set_updated_at before update on public.repeatability_benchmarks
for each row execute function private.set_updated_at();

create or replace function private.can_manage_proof()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(private.actor_role()::text in ('super_admin', 'academy_ops', 'talent_ops'), false)
$$;

revoke all on function private.can_manage_proof() from public;
grant execute on function private.can_manage_proof() to authenticated;

alter table public.outcome_reports enable row level security;
alter table public.outcome_metrics enable row level security;
alter table public.case_studies enable row level security;
alter table public.testimonials enable row level security;
alter table public.role_specialisations enable row level security;
alter table public.partnerships enable row level security;
alter table public.partner_referrals enable row level security;
alter table public.repeatability_benchmarks enable row level security;

create policy "proof staff manage outcome reports" on public.outcome_reports for all to authenticated
using ((select private.can_manage_proof())) with check ((select private.can_manage_proof()));
create policy "proof staff manage outcome metrics" on public.outcome_metrics for all to authenticated
using ((select private.can_manage_proof())) with check ((select private.can_manage_proof()));
create policy "proof staff manage case studies" on public.case_studies for all to authenticated
using ((select private.can_manage_proof())) with check ((select private.can_manage_proof()));
create policy "proof staff manage testimonials" on public.testimonials for all to authenticated
using ((select private.can_manage_proof())) with check ((select private.can_manage_proof()));
create policy "proof staff manage role specialisations" on public.role_specialisations for all to authenticated
using ((select private.can_manage_proof())) with check ((select private.can_manage_proof()));
create policy "proof staff manage partnerships" on public.partnerships for all to authenticated
using ((select private.can_manage_proof())) with check ((select private.can_manage_proof()));
create policy "proof staff manage partner referrals" on public.partner_referrals for all to authenticated
using ((select private.can_manage_proof())) with check ((select private.can_manage_proof()));
create policy "proof staff manage repeatability benchmarks" on public.repeatability_benchmarks for all to authenticated
using ((select private.can_manage_proof())) with check ((select private.can_manage_proof()));

grant select, insert, update, delete on table
  public.outcome_reports,
  public.outcome_metrics,
  public.case_studies,
  public.testimonials,
  public.role_specialisations,
  public.partnerships,
  public.partner_referrals,
  public.repeatability_benchmarks
to authenticated, service_role;

comment on table public.outcome_reports is 'Client-approved outcome narratives linking delivery evidence to expansion decisions.';
comment on table public.outcome_metrics is 'Verified baseline, result and target measures supporting outcome reports.';
comment on table public.case_studies is 'Consent-controlled case studies derived from approved outcome evidence.';
comment on table public.testimonials is 'Permission-tracked client testimonials for approved publication.';
comment on table public.role_specialisations is 'Repeatable AI operator role blueprints with measurable success standards.';
comment on table public.partnerships is 'Strategic partner pipeline across communities, training, recruitment and technology.';
comment on table public.partner_referrals is 'Partner-sourced commercial opportunities and conversion value.';
comment on table public.repeatability_benchmarks is 'Evidence thresholds and reference performance for repeatable Lymora engagements.';

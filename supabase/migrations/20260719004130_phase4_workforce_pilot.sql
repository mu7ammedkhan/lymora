alter type public.app_role add value if not exists 'talent_ops';
alter type public.app_role add value if not exists 'operator';

create type public.workforce_operator_type as enum (
  'executive_assistant',
  'marketing',
  'sales',
  'operations',
  'customer_experience',
  'recruitment'
);
create type public.workforce_operator_status as enum (
  'applicant',
  'screening',
  'onboarding',
  'available',
  'matched',
  'deployed',
  'paused',
  'inactive'
);
create type public.workforce_work_mode as enum ('remote', 'on_site', 'hybrid');
create type public.onboarding_task_status as enum ('pending', 'in_progress', 'complete', 'waived');
create type public.workforce_match_status as enum ('suggested', 'shortlisted', 'client_review', 'approved', 'rejected', 'withdrawn');
create type public.workforce_plan as enum ('starter', 'growth', 'scale', 'custom');
create type public.workforce_deployment_status as enum ('preparing', 'active', 'paused', 'completed', 'terminated');
create type public.client_sop_status as enum ('draft', 'review', 'approved', 'retired');
create type public.quality_review_outcome as enum ('on_track', 'coaching', 'at_risk');

alter type public.activity_entity add value if not exists 'operator';
alter type public.activity_entity add value if not exists 'match';
alter type public.activity_entity add value if not exists 'deployment';
alter type public.activity_entity add value if not exists 'sop';
alter type public.activity_entity add value if not exists 'quality_review';

create table public.workforce_operators (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  application_id uuid unique references public.applications(id) on delete set null,
  credential_id uuid unique references public.credentials(id) on delete set null,
  operator_number text not null unique,
  full_name text not null,
  email text not null,
  phone text not null default '',
  location text not null default 'United Arab Emirates',
  operator_type public.workforce_operator_type not null,
  status public.workforce_operator_status not null default 'applicant',
  work_mode public.workforce_work_mode not null default 'hybrid',
  specialisation text not null default '',
  skills text[] not null default '{}',
  experience_summary text not null default '',
  readiness_score smallint not null default 0 check (readiness_score between 0 and 100),
  monthly_cost_aed numeric(12,2) not null default 0 check (monthly_cost_aed >= 0),
  capacity_hours_month smallint not null default 160 check (capacity_hours_month between 1 and 744),
  available_from date,
  background_check_complete boolean not null default false,
  nda_signed_at timestamptz,
  data_policy_signed_at timestamptz,
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index workforce_operators_email_unique_idx on public.workforce_operators (lower(email));
create index workforce_operators_profile_idx on public.workforce_operators(profile_id);
create index workforce_operators_application_idx on public.workforce_operators(application_id);
create index workforce_operators_credential_idx on public.workforce_operators(credential_id);
create index workforce_operators_owner_idx on public.workforce_operators(owner_id);
create index workforce_operators_status_type_idx on public.workforce_operators(status, operator_type);

create table public.operator_onboarding_items (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references public.workforce_operators(id) on delete cascade,
  task_key text not null,
  label text not null,
  category text not null,
  status public.onboarding_task_status not null default 'pending',
  due_date date,
  completed_at timestamptz,
  completed_by uuid references public.profiles(id) on delete set null,
  notes text not null default '',
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (operator_id, task_key)
);

create index operator_onboarding_operator_idx on public.operator_onboarding_items(operator_id);
create index operator_onboarding_completed_by_idx on public.operator_onboarding_items(completed_by);
create index operator_onboarding_open_idx on public.operator_onboarding_items(operator_id, status)
  where status in ('pending', 'in_progress');

create table public.workforce_matches (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid not null references public.workforce_operators(id) on delete cascade,
  account_id uuid not null references public.corporate_accounts(id) on delete cascade,
  opportunity_id uuid references public.corporate_opportunities(id) on delete set null,
  role_title text not null,
  status public.workforce_match_status not null default 'suggested',
  match_score smallint not null default 0 check (match_score between 0 and 100),
  proposed_rate_aed numeric(12,2) not null default 0 check (proposed_rate_aed >= 0),
  rationale text not null default '',
  client_requirements text not null default '',
  submitted_at timestamptz,
  decided_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workforce_matches_operator_idx on public.workforce_matches(operator_id);
create index workforce_matches_account_idx on public.workforce_matches(account_id);
create index workforce_matches_opportunity_idx on public.workforce_matches(opportunity_id);
create index workforce_matches_created_by_idx on public.workforce_matches(created_by);
create index workforce_matches_status_idx on public.workforce_matches(status, created_at desc);

create table public.workforce_deployments (
  id uuid primary key default gen_random_uuid(),
  deployment_number text not null unique,
  match_id uuid unique references public.workforce_matches(id) on delete set null,
  operator_id uuid not null references public.workforce_operators(id) on delete restrict,
  account_id uuid not null references public.corporate_accounts(id) on delete restrict,
  opportunity_id uuid references public.corporate_opportunities(id) on delete set null,
  plan public.workforce_plan not null default 'starter',
  role_title text not null,
  status public.workforce_deployment_status not null default 'preparing',
  starts_on date not null,
  ends_on date,
  minimum_term_months smallint not null default 3 check (minimum_term_months between 1 and 36),
  client_rate_monthly_aed numeric(12,2) not null check (client_rate_monthly_aed >= 0),
  operator_cost_monthly_aed numeric(12,2) not null check (operator_cost_monthly_aed >= 0),
  management_allocation_aed numeric(12,2) not null default 1000 check (management_allocation_aed >= 0),
  tools_overhead_aed numeric(12,2) not null default 500 check (tools_overhead_aed >= 0),
  target_hours_month smallint not null default 160 check (target_hours_month between 1 and 744),
  account_manager_id uuid references public.profiles(id) on delete set null,
  client_owner_name text not null,
  client_owner_email text not null,
  outcomes text not null default '',
  success_measures text not null default '',
  next_review_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on is null or ends_on >= starts_on)
);

create index workforce_deployments_match_idx on public.workforce_deployments(match_id);
create index workforce_deployments_operator_idx on public.workforce_deployments(operator_id);
create index workforce_deployments_account_idx on public.workforce_deployments(account_id);
create index workforce_deployments_opportunity_idx on public.workforce_deployments(opportunity_id);
create index workforce_deployments_manager_idx on public.workforce_deployments(account_manager_id);
create index workforce_deployments_status_review_idx on public.workforce_deployments(status, next_review_at);

create table public.client_sops (
  id uuid primary key default gen_random_uuid(),
  deployment_id uuid not null references public.workforce_deployments(id) on delete cascade,
  title text not null,
  department text not null,
  version smallint not null default 1 check (version between 1 and 1000),
  status public.client_sop_status not null default 'draft',
  risk_level public.ai_risk_level not null default 'amber',
  purpose text not null,
  approved_tools text[] not null default '{}',
  inputs text not null default '',
  procedure text not null,
  review_criteria text not null,
  data_controls text not null,
  human_approver text not null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (deployment_id, title, version)
);

create index client_sops_deployment_idx on public.client_sops(deployment_id);
create index client_sops_approved_by_idx on public.client_sops(approved_by);
create index client_sops_active_idx on public.client_sops(deployment_id, status)
  where status in ('review', 'approved');

create table public.operator_quality_reviews (
  id uuid primary key default gen_random_uuid(),
  deployment_id uuid not null references public.workforce_deployments(id) on delete cascade,
  operator_id uuid not null references public.workforce_operators(id) on delete restrict,
  review_date date not null,
  period_start date not null,
  period_end date not null,
  reviewer_id uuid references public.profiles(id) on delete set null,
  quality_score smallint not null check (quality_score between 0 and 100),
  reliability_score smallint not null check (reliability_score between 0 and 100),
  responsible_ai_score smallint not null check (responsible_ai_score between 0 and 100),
  client_satisfaction_score smallint not null check (client_satisfaction_score between 0 and 100),
  utilisation_percent smallint not null check (utilisation_percent between 0 and 200),
  hours_worked numeric(8,2) not null default 0 check (hours_worked >= 0),
  hours_saved numeric(8,2) not null default 0 check (hours_saved >= 0),
  risk_incidents smallint not null default 0 check (risk_incidents >= 0),
  client_feedback text not null default '',
  strengths text not null default '',
  actions text not null default '',
  outcome public.quality_review_outcome not null default 'on_track',
  created_at timestamptz not null default now(),
  check (period_end >= period_start)
);

create index operator_quality_deployment_idx on public.operator_quality_reviews(deployment_id, review_date desc);
create index operator_quality_operator_idx on public.operator_quality_reviews(operator_id, review_date desc);
create index operator_quality_reviewer_idx on public.operator_quality_reviews(reviewer_id);

create trigger workforce_operators_set_updated_at before update on public.workforce_operators
for each row execute procedure private.set_updated_at();
create trigger operator_onboarding_set_updated_at before update on public.operator_onboarding_items
for each row execute procedure private.set_updated_at();
create trigger workforce_matches_set_updated_at before update on public.workforce_matches
for each row execute procedure private.set_updated_at();
create trigger workforce_deployments_set_updated_at before update on public.workforce_deployments
for each row execute procedure private.set_updated_at();
create trigger client_sops_set_updated_at before update on public.client_sops
for each row execute procedure private.set_updated_at();

create or replace function private.can_manage_workforce()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(private.actor_role()::text in ('super_admin', 'academy_ops', 'talent_ops'), false)
$$;

create or replace function private.is_workforce_operator(target_operator_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1 from public.workforce_operators
    where id = target_operator_id and profile_id = (select auth.uid())
  )
$$;

create or replace function private.operator_has_deployment(target_deployment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.workforce_deployments deployment
    join public.workforce_operators operator on operator.id = deployment.operator_id
    where deployment.id = target_deployment_id and operator.profile_id = (select auth.uid())
  )
$$;

revoke all on function private.can_manage_workforce() from public;
revoke all on function private.is_workforce_operator(uuid) from public;
revoke all on function private.operator_has_deployment(uuid) from public;
grant execute on function private.can_manage_workforce() to authenticated;
grant execute on function private.is_workforce_operator(uuid) to authenticated;
grant execute on function private.operator_has_deployment(uuid) to authenticated;

alter table public.workforce_operators enable row level security;
alter table public.operator_onboarding_items enable row level security;
alter table public.workforce_matches enable row level security;
alter table public.workforce_deployments enable row level security;
alter table public.client_sops enable row level security;
alter table public.operator_quality_reviews enable row level security;

create policy "workforce staff manage operators" on public.workforce_operators for all to authenticated
using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "operators read own workforce profile" on public.workforce_operators for select to authenticated
using ((select private.is_workforce_operator(id)));

create policy "workforce staff manage onboarding" on public.operator_onboarding_items for all to authenticated
using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "operators read own onboarding" on public.operator_onboarding_items for select to authenticated
using ((select private.is_workforce_operator(operator_id)));

create policy "workforce staff manage matches" on public.workforce_matches for all to authenticated
using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "operators read approved matches" on public.workforce_matches for select to authenticated
using (status = 'approved' and (select private.is_workforce_operator(operator_id)));

create policy "workforce staff manage deployments" on public.workforce_deployments for all to authenticated
using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "operators read own deployments" on public.workforce_deployments for select to authenticated
using ((select private.is_workforce_operator(operator_id)));

create policy "workforce staff manage client sops" on public.client_sops for all to authenticated
using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "operators read own approved sops" on public.client_sops for select to authenticated
using (status = 'approved' and (select private.operator_has_deployment(deployment_id)));

create policy "workforce staff manage quality reviews" on public.operator_quality_reviews for all to authenticated
using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "operators read own quality reviews" on public.operator_quality_reviews for select to authenticated
using ((select private.is_workforce_operator(operator_id)));

grant select, insert, update, delete on table
  public.workforce_operators,
  public.operator_onboarding_items,
  public.workforce_matches,
  public.workforce_deployments,
  public.client_sops,
  public.operator_quality_reviews
to authenticated, service_role;

comment on table public.workforce_operators is 'Qualified AI operator bench and deployment readiness record.';
comment on table public.operator_onboarding_items is 'Controlled onboarding checklist for workforce operators.';
comment on table public.workforce_matches is 'Evidence-led operator-to-client matching decisions.';
comment on table public.workforce_deployments is 'Recurring managed workforce subscriptions and deployment economics.';
comment on table public.client_sops is 'Versioned client workflow SOPs with risk and human-review controls.';
comment on table public.operator_quality_reviews is 'Periodic operator quality, utilisation, impact, risk and client-satisfaction review.';

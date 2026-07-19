create type public.corporate_account_status as enum ('prospect', 'active', 'client', 'inactive');
create type public.opportunity_stage as enum ('lead', 'qualified', 'diagnosis', 'proposal', 'proof', 'won', 'lost');
create type public.corporate_package as enum ('team_enablement_15', 'team_enablement_30', 'private_caio', 'enterprise');
create type public.diagnostic_status as enum ('draft', 'completed');
create type public.ai_maturity_level as enum ('emerging', 'developing', 'ready', 'leading');
create type public.ai_risk_level as enum ('green', 'amber', 'red');
create type public.proposal_status as enum ('draft', 'sent', 'accepted', 'declined', 'expired');
create type public.corporate_workshop_type as enum ('executive_readiness', 'team_enablement', 'manager_coaching', 'workflow_lab');
create type public.workshop_status as enum ('planned', 'confirmed', 'completed', 'cancelled');

alter type public.activity_entity add value if not exists 'account';
alter type public.activity_entity add value if not exists 'opportunity';
alter type public.activity_entity add value if not exists 'diagnostic';
alter type public.activity_entity add value if not exists 'proposal';
alter type public.activity_entity add value if not exists 'workshop';

create table public.corporate_accounts (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  website text not null default '',
  industry text not null,
  employee_band text not null,
  location text not null default 'United Arab Emirates',
  primary_contact_name text not null,
  primary_contact_email text not null,
  primary_contact_phone text not null default '',
  primary_contact_title text not null default '',
  owner_id uuid references public.profiles(id) on delete set null,
  source text not null default 'outbound',
  status public.corporate_account_status not null default 'prospect',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.corporate_opportunities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.corporate_accounts(id) on delete cascade,
  title text not null,
  package public.corporate_package not null default 'team_enablement_15',
  participant_count integer not null default 15 check (participant_count between 1 and 10000),
  stage public.opportunity_stage not null default 'lead',
  value_aed numeric(12,2) not null default 0 check (value_aed >= 0),
  probability smallint not null default 10 check (probability between 0 and 100),
  expected_close_date date,
  next_step text not null default '',
  next_step_due_at date,
  owner_id uuid references public.profiles(id) on delete set null,
  lost_reason text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.readiness_assessments (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null unique references public.corporate_opportunities(id) on delete cascade,
  status public.diagnostic_status not null default 'draft',
  respondent_name text not null default '',
  leadership_score smallint not null default 0 check (leadership_score between 0 and 100),
  people_score smallint not null default 0 check (people_score between 0 and 100),
  process_score smallint not null default 0 check (process_score between 0 and 100),
  data_score smallint not null default 0 check (data_score between 0 and 100),
  tools_score smallint not null default 0 check (tools_score between 0 and 100),
  governance_score smallint not null default 0 check (governance_score between 0 and 100),
  adoption_score smallint not null default 0 check (adoption_score between 0 and 100),
  overall_score smallint not null default 0 check (overall_score between 0 and 100),
  maturity public.ai_maturity_level not null default 'emerging',
  executive_summary text not null default '',
  priorities text not null default '',
  risks text not null default '',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_opportunities (
  id uuid primary key default gen_random_uuid(),
  readiness_assessment_id uuid not null references public.readiness_assessments(id) on delete cascade,
  workflow_name text not null,
  department text not null,
  current_pain text not null default '',
  frequency text not null default '',
  value_score smallint not null default 50 check (value_score between 0 and 100),
  feasibility_score smallint not null default 50 check (feasibility_score between 0 and 100),
  risk_level public.ai_risk_level not null default 'amber',
  human_oversight text not null default '',
  recommendation text not null default '',
  priority smallint not null default 1 check (priority between 1 and 100),
  created_at timestamptz not null default now()
);

create table public.corporate_proposals (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.corporate_opportunities(id) on delete cascade,
  proposal_number text not null unique,
  package public.corporate_package not null,
  participant_count integer not null check (participant_count between 1 and 10000),
  subtotal_aed numeric(12,2) not null check (subtotal_aed >= 0),
  vat_rate numeric(5,2) not null default 5 check (vat_rate between 0 and 100),
  vat_aed numeric(12,2) not null default 0 check (vat_aed >= 0),
  total_aed numeric(12,2) not null check (total_aed >= 0),
  scope text not null,
  timeline text not null,
  assumptions text not null default '',
  status public.proposal_status not null default 'draft',
  valid_until date not null,
  sent_at timestamptz,
  accepted_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.corporate_workshops (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.corporate_opportunities(id) on delete cascade,
  proposal_id uuid references public.corporate_proposals(id) on delete set null,
  title text not null,
  workshop_type public.corporate_workshop_type not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  delivery_mode public.session_delivery_mode not null default 'in_person',
  location text not null default '',
  join_url text not null default '',
  status public.workshop_status not null default 'planned',
  facilitator text not null default '',
  participant_target integer not null default 1 check (participant_target between 1 and 10000),
  outcomes text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index corporate_accounts_owner_idx on public.corporate_accounts(owner_id);
create index corporate_accounts_status_idx on public.corporate_accounts(status);
create index corporate_opportunities_account_idx on public.corporate_opportunities(account_id);
create index corporate_opportunities_owner_idx on public.corporate_opportunities(owner_id);
create index corporate_opportunities_stage_idx on public.corporate_opportunities(stage);
create index corporate_opportunities_close_idx on public.corporate_opportunities(expected_close_date);
create index workflow_opportunities_assessment_idx on public.workflow_opportunities(readiness_assessment_id);
create index corporate_proposals_opportunity_idx on public.corporate_proposals(opportunity_id);
create index corporate_workshops_opportunity_idx on public.corporate_workshops(opportunity_id);
create index corporate_workshops_proposal_idx on public.corporate_workshops(proposal_id);
create index corporate_workshops_starts_idx on public.corporate_workshops(starts_at);

create trigger corporate_accounts_set_updated_at before update on public.corporate_accounts
for each row execute procedure private.set_updated_at();
create trigger corporate_opportunities_set_updated_at before update on public.corporate_opportunities
for each row execute procedure private.set_updated_at();
create trigger readiness_assessments_set_updated_at before update on public.readiness_assessments
for each row execute procedure private.set_updated_at();
create trigger corporate_proposals_set_updated_at before update on public.corporate_proposals
for each row execute procedure private.set_updated_at();
create trigger corporate_workshops_set_updated_at before update on public.corporate_workshops
for each row execute procedure private.set_updated_at();

create or replace function private.can_manage_corporate()
returns boolean
language sql
stable
security definer
set search_path = public
as $$ select coalesce(private.actor_role() in ('super_admin', 'academy_ops'), false) $$;

revoke all on function private.can_manage_corporate() from public;
grant execute on function private.can_manage_corporate() to authenticated;

alter table public.corporate_accounts enable row level security;
alter table public.corporate_opportunities enable row level security;
alter table public.readiness_assessments enable row level security;
alter table public.workflow_opportunities enable row level security;
alter table public.corporate_proposals enable row level security;
alter table public.corporate_workshops enable row level security;

create policy "corporate operators manage accounts" on public.corporate_accounts for all to authenticated
using ((select private.can_manage_corporate())) with check ((select private.can_manage_corporate()));
create policy "corporate operators manage opportunities" on public.corporate_opportunities for all to authenticated
using ((select private.can_manage_corporate())) with check ((select private.can_manage_corporate()));
create policy "corporate operators manage diagnostics" on public.readiness_assessments for all to authenticated
using ((select private.can_manage_corporate())) with check ((select private.can_manage_corporate()));
create policy "corporate operators manage workflows" on public.workflow_opportunities for all to authenticated
using ((select private.can_manage_corporate())) with check ((select private.can_manage_corporate()));
create policy "corporate operators manage proposals" on public.corporate_proposals for all to authenticated
using ((select private.can_manage_corporate())) with check ((select private.can_manage_corporate()));
create policy "corporate operators manage workshops" on public.corporate_workshops for all to authenticated
using ((select private.can_manage_corporate())) with check ((select private.can_manage_corporate()));

grant select, insert, update, delete on table
  public.corporate_accounts,
  public.corporate_opportunities,
  public.readiness_assessments,
  public.workflow_opportunities,
  public.corporate_proposals,
  public.corporate_workshops
to authenticated, service_role;

comment on table public.corporate_accounts is 'Corporate prospects and customers for Lymora AI workforce engagements.';
comment on table public.readiness_assessments is 'Seven-dimension organisational AI readiness diagnostics.';
comment on table public.workflow_opportunities is 'Prioritised workflow use cases with value, feasibility and risk classification.';
comment on table public.corporate_proposals is 'Commercial proposals with UAE VAT calculations and package scope.';

drop policy if exists "workforce staff manage operators" on public.workforce_operators;
drop policy if exists "operators read own workforce profile" on public.workforce_operators;
drop policy if exists "workforce staff manage onboarding" on public.operator_onboarding_items;
drop policy if exists "operators read own onboarding" on public.operator_onboarding_items;
drop policy if exists "workforce staff manage matches" on public.workforce_matches;
drop policy if exists "operators read approved matches" on public.workforce_matches;
drop policy if exists "workforce staff manage deployments" on public.workforce_deployments;
drop policy if exists "operators read own deployments" on public.workforce_deployments;
drop policy if exists "workforce staff manage client sops" on public.client_sops;
drop policy if exists "operators read own approved sops" on public.client_sops;
drop policy if exists "workforce staff manage quality reviews" on public.operator_quality_reviews;
drop policy if exists "operators read own quality reviews" on public.operator_quality_reviews;

create policy "authorised workforce profiles are readable" on public.workforce_operators
for select to authenticated
using ((select private.can_manage_workforce()) or (select private.is_workforce_operator(id)));
create policy "workforce staff insert operators" on public.workforce_operators
for insert to authenticated with check ((select private.can_manage_workforce()));
create policy "workforce staff update operators" on public.workforce_operators
for update to authenticated using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "workforce staff delete operators" on public.workforce_operators
for delete to authenticated using ((select private.can_manage_workforce()));

create policy "authorised onboarding is readable" on public.operator_onboarding_items
for select to authenticated
using ((select private.can_manage_workforce()) or (select private.is_workforce_operator(operator_id)));
create policy "workforce staff insert onboarding" on public.operator_onboarding_items
for insert to authenticated with check ((select private.can_manage_workforce()));
create policy "workforce staff update onboarding" on public.operator_onboarding_items
for update to authenticated using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "workforce staff delete onboarding" on public.operator_onboarding_items
for delete to authenticated using ((select private.can_manage_workforce()));

create policy "authorised matches are readable" on public.workforce_matches
for select to authenticated
using ((select private.can_manage_workforce()) or (status = 'approved' and (select private.is_workforce_operator(operator_id))));
create policy "workforce staff insert matches" on public.workforce_matches
for insert to authenticated with check ((select private.can_manage_workforce()));
create policy "workforce staff update matches" on public.workforce_matches
for update to authenticated using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "workforce staff delete matches" on public.workforce_matches
for delete to authenticated using ((select private.can_manage_workforce()));

create policy "authorised deployments are readable" on public.workforce_deployments
for select to authenticated
using ((select private.can_manage_workforce()) or (select private.is_workforce_operator(operator_id)));
create policy "workforce staff insert deployments" on public.workforce_deployments
for insert to authenticated with check ((select private.can_manage_workforce()));
create policy "workforce staff update deployments" on public.workforce_deployments
for update to authenticated using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "workforce staff delete deployments" on public.workforce_deployments
for delete to authenticated using ((select private.can_manage_workforce()));

create policy "authorised client sops are readable" on public.client_sops
for select to authenticated
using ((select private.can_manage_workforce()) or (status = 'approved' and (select private.operator_has_deployment(deployment_id))));
create policy "workforce staff insert client sops" on public.client_sops
for insert to authenticated with check ((select private.can_manage_workforce()));
create policy "workforce staff update client sops" on public.client_sops
for update to authenticated using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "workforce staff delete client sops" on public.client_sops
for delete to authenticated using ((select private.can_manage_workforce()));

create policy "authorised quality reviews are readable" on public.operator_quality_reviews
for select to authenticated
using ((select private.can_manage_workforce()) or (select private.is_workforce_operator(operator_id)));
create policy "workforce staff insert quality reviews" on public.operator_quality_reviews
for insert to authenticated with check ((select private.can_manage_workforce()));
create policy "workforce staff update quality reviews" on public.operator_quality_reviews
for update to authenticated using ((select private.can_manage_workforce())) with check ((select private.can_manage_workforce()));
create policy "workforce staff delete quality reviews" on public.operator_quality_reviews
for delete to authenticated using ((select private.can_manage_workforce()));

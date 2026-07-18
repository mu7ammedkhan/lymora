create index activities_actor_id_idx on public.activities(actor_id);
create index applications_reviewed_by_idx on public.applications(reviewed_by);
create index enrollments_application_id_idx on public.enrollments(application_id);
create index profiles_application_id_idx on public.profiles(application_id);

drop policy "profiles self or staff read" on public.profiles;
drop policy "super admins manage profiles" on public.profiles;
create policy "authenticated read profiles" on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select private.is_staff()));
create policy "super admins insert profiles" on public.profiles for insert to authenticated
with check ((select private.actor_role()) = 'super_admin');
create policy "super admins update profiles" on public.profiles for update to authenticated
using ((select private.actor_role()) = 'super_admin')
with check ((select private.actor_role()) = 'super_admin');
create policy "super admins delete profiles" on public.profiles for delete to authenticated
using ((select private.actor_role()) = 'super_admin');

drop policy "staff read applications" on public.applications;
drop policy "staff manage applications" on public.applications;
drop policy "candidate reads linked application" on public.applications;
create policy "authenticated read applications" on public.applications for select to authenticated
using (
  (select private.is_staff())
  or id = (
    select application_id
    from public.profiles
    where id = (select auth.uid())
  )
);
create policy "staff insert applications" on public.applications for insert to authenticated
with check ((select private.is_staff()));
create policy "staff update applications" on public.applications for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete applications" on public.applications for delete to authenticated
using ((select private.is_staff()));

drop policy "staff manage cohorts" on public.cohorts;
drop policy "candidate reads enrolled cohort" on public.cohorts;
create policy "authenticated read cohorts" on public.cohorts for select to authenticated
using (
  (select private.is_staff())
  or exists (
    select 1
    from public.enrollments e
    join public.profiles p on p.application_id = e.application_id
    where e.cohort_id = cohorts.id
      and p.id = (select auth.uid())
  )
);
create policy "staff insert cohorts" on public.cohorts for insert to authenticated
with check ((select private.is_staff()));
create policy "staff update cohorts" on public.cohorts for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete cohorts" on public.cohorts for delete to authenticated
using ((select private.is_staff()));

drop policy "staff manage enrollments" on public.enrollments;
drop policy "candidate reads own enrollment" on public.enrollments;
create policy "authenticated read enrollments" on public.enrollments for select to authenticated
using (
  (select private.is_staff())
  or application_id = (
    select application_id
    from public.profiles
    where id = (select auth.uid())
  )
);
create policy "staff insert enrollments" on public.enrollments for insert to authenticated
with check ((select private.is_staff()));
create policy "staff update enrollments" on public.enrollments for update to authenticated
using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "staff delete enrollments" on public.enrollments for delete to authenticated
using ((select private.is_staff()));

drop policy "staff read activities" on public.activities;
drop policy "staff write activities" on public.activities;
create policy "staff read activities" on public.activities for select to authenticated
using ((select private.is_staff()));
create policy "staff write activities" on public.activities for insert to authenticated
with check ((select private.is_staff()));

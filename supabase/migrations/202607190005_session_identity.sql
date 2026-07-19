create unique index cohort_sessions_identity_idx
on public.cohort_sessions(cohort_id, starts_at, title);

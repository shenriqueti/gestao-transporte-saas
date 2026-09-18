-- The application authenticates requests in Express before querying Supabase.
-- Keep these tables consistent with the existing API tables and refresh PostgREST
-- after the feature migration has been applied.
alter table public.rotas disable row level security;
alter table public.rota_alunos disable row level security;
alter table public.embarques_diarios disable row level security;

notify pgrst, 'reload schema';

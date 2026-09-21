alter table public.alunos
    add column if not exists proprietario_id uuid references auth.users(id) on delete restrict;

alter table public.mensalidades
    add column if not exists proprietario_id uuid references auth.users(id) on delete restrict;

create index if not exists alunos_proprietario_idx
    on public.alunos (proprietario_id, nome);

create index if not exists mensalidades_proprietario_idx
    on public.mensalidades (proprietario_id, competencia);

notify pgrst, 'reload schema';

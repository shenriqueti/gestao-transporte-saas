alter table public.rotas
    add column if not exists proprietario_id uuid references auth.users(id) on delete restrict;

create index if not exists rotas_proprietario_idx
    on public.rotas (proprietario_id, ativa, nome);

notify pgrst, 'reload schema';

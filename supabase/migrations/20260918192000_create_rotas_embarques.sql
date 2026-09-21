create extension if not exists pgcrypto;

create table if not exists public.rotas (
    id uuid primary key default gen_random_uuid(),
    nome text not null check (btrim(nome) <> ''),
    descricao text,
    ativa boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.rota_alunos (
    id uuid primary key default gen_random_uuid(),
    rota_id uuid not null references public.rotas(id) on delete cascade,
    aluno_id uuid references public.alunos(id) on delete set null,
    aluno_nome text not null,
    escola text,
    ordem integer not null check (ordem > 0),
    created_at timestamptz not null default now(),
    unique (rota_id, aluno_id),
    unique (rota_id, ordem)
);

create table if not exists public.embarques_diarios (
    id uuid primary key default gen_random_uuid(),
    rota_id uuid not null,
    rota_aluno_id uuid not null,
    aluno_id uuid references public.alunos(id) on delete set null,
    aluno_nome text not null,
    escola text,
    data_embarque date not null,
    status text not null default 'Pendente'
        check (status in ('Pendente', 'Embarcou', 'Faltou', 'Não utilizará')),
    confirmado_em timestamptz,
    confirmado_por uuid,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (rota_aluno_id, data_embarque)
);

create index if not exists rota_alunos_rota_ordem_idx
    on public.rota_alunos (rota_id, ordem);
create index if not exists embarques_diarios_filtros_idx
    on public.embarques_diarios (rota_id, aluno_id, data_embarque);

alter table public.rotas enable row level security;
alter table public.rota_alunos enable row level security;
alter table public.embarques_diarios enable row level security;

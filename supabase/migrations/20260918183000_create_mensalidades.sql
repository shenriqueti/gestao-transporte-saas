create table if not exists public.mensalidades (
    id uuid primary key default gen_random_uuid(),
    aluno_id uuid references public.alunos(id) on delete set null,
    aluno_nome text not null,
    escola text not null,
    competencia date not null,
    valor numeric(12, 2) not null check (valor > 0),
    dia_vencimento integer not null check (dia_vencimento between 1 and 31),
    status text not null default 'Pendente' check (status in ('Pendente', 'Pago')),
    data_pagamento date,
    valor_pago numeric(12, 2),
    pago_em_atraso boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint mensalidades_competencia_primeiro_dia
        check (extract(day from competencia) = 1),
    constraint mensalidades_pagamento_consistente
        check (
            (status = 'Pendente' and data_pagamento is null and valor_pago is null)
            or
            (status = 'Pago' and data_pagamento is not null and valor_pago is not null and valor_pago > 0)
        )
);

create unique index if not exists mensalidades_aluno_competencia_unique
    on public.mensalidades (aluno_id, competencia)
    where aluno_id is not null;

create index if not exists mensalidades_competencia_index
    on public.mensalidades (competencia);

create index if not exists mensalidades_status_index
    on public.mensalidades (status);

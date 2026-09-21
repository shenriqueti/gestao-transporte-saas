update public.alunos
set proprietario_id = 'b4a975b0-76ff-46ed-8938-08e72acc25cf'
where proprietario_id is null;

update public.mensalidades
set proprietario_id = 'b4a975b0-76ff-46ed-8938-08e72acc25cf'
where proprietario_id is null;

update public.rotas
set proprietario_id = 'b4a975b0-76ff-46ed-8938-08e72acc25cf'
where proprietario_id is null;

notify pgrst, 'reload schema';

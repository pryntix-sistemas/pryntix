-- PRYNTIX v2.0 — RESET DOS DADOS DE TESTE
-- ATENÇÃO: esta operação apaga definitivamente os dados operacionais.
-- Preserva auth.users, usuários/perfis e public.config (identidade da Printer & Co.).
-- Depois do reset, a numeração dos orçamentos volta a ORC-000001.

begin;

create temporary table reset_conferencia (
  tabela text primary key,
  registros bigint not null
) on commit preserve rows;

do $$
declare
  tabelas text;
begin
  select string_agg(format('%I.%I', schemaname, tablename), ', ' order by ordem)
    into tabelas
  from (
    select n.nspname as schemaname, c.relname as tablename,
           array_position(
             array['recebimentos','contas_receber','contas_pagar','orcamentos','clientes','fornecedores'],
             c.relname
           ) as ordem
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind in ('r','p')
      and c.relname = any(array[
        'recebimentos','contas_receber','contas_pagar',
        'orcamentos','clientes','fornecedores'
      ])
  ) existentes;

  if tabelas is not null then
    execute 'truncate table ' || tabelas || ' restart identity cascade';
  end if;
end $$;

do $$
declare
  t text;
  qtd bigint;
begin
  foreach t in array array[
    'orcamentos','clientes','fornecedores',
    'contas_pagar','contas_receber','recebimentos'
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('select count(*) from public.%I', t) into qtd;
      insert into reset_conferencia(tabela, registros) values (t, qtd);
    end if;
  end loop;
end $$;

commit;

-- Conferência: todas as quantidades abaixo devem retornar zero.
select tabela, registros from reset_conferencia order by tabela;

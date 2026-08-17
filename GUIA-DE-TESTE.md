# PRYNTIX v2.0 — Guia de homologação

## Antes de abrir o sistema

1. Entre no projeto `pryntix` do Supabase.
2. Abra o SQL Editor.
3. Copie todo o conteúdo de `sql/001_financeiro_v2.sql`.
4. Execute o SQL uma única vez.
5. Abra `login.html` por um servidor local ou publique esta pasta em um endereço de homologação.

## Começar a homologação com o banco vazio

Se quiser apagar todos os cadastros e movimentos de teste, execute uma única vez
`sql/002_reset_dados_teste.sql` no SQL Editor do Supabase. O reset preserva os
usuários, o login e a identidade da Printer & Co., e reinicia o primeiro orçamento
como `ORC-000001`.

Os anexos do bucket `documentos-financeiro` devem ser removidos pela tela Storage
do Supabase. Não apague diretamente a tabela interna `storage.objects`.

## Roteiro principal

### Login e sessão

- Entre com o usuário habitual.
- Deixe uma tela aberta e confirme que a sessão continua após a renovação do token.

### Orçamentos

- Abra **Novo orçamento**.
- Selecione um cliente e adicione dois itens.
- Salve e confirme a numeração no padrão `ORC-000001`.
- Gere o PDF e envie pelo WhatsApp; confirme o mesmo número nos dois.
- Clique em **Salvar e criar outro** e confirme que uma ficha limpa é aberta sem fechar a tela.
- Salve o segundo orçamento e confirme que o número é posterior ao primeiro.
- Abra o link público e confirme cliente, itens, total e observações.

### Contas a Pagar

- Cadastre R$ 100,00 em 3 parcelas.
- Confirme valores de R$ 33,33, R$ 33,33 e R$ 33,34.
- Confirme vencimentos separados por 30 dias.
- Edite somente a segunda parcela.
- Anexe documento e comprovante.
- Teste filtros de mês, situação, tipo e fornecedor.

### Contas a Receber

- Cadastre uma conta para InterEventos com 2 parcelas.
- Registre um recebimento parcial de 50%.
- Registre o saldo restante e confirme a mudança para **Recebido**.
- Teste filtros por cliente, situação e período.

### Cadastros

- Crie e edite um cliente.
- Teste a exclusão de um cliente sem movimentações.
- Crie, edite e consulte um fornecedor.

## Observações desta homologação

- Parcelas são calculadas em intervalos de 30 dias corridos.
- Pagamento parcial está disponível em Contas a Receber.
- O comprovante de pagamento fica associado à parcela.
- Configurações da empresa já podem ser editadas por administrador.
- Medição de armazenamento e backup ZIP exigem uma função administrativa e continuam sinalizados como próxima etapa.
- Estoque e Relatórios permanecem como módulos futuros.

Se algo falhar, anote a tela, a ação executada e a mensagem exibida.

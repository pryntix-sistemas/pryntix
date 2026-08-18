/* ============================================================
   PRYNTIX — menu.js v1.4
   Sidebar e navegação
   ============================================================ */

function renderizarMenu(paginaAtiva) {
  const s = getSessao();
  if (!s) return;

  const secoes = [
    {
      label: 'PRINCIPAL',
      itens: [
        { href: 'dashboard.html',  icone: 'ti-layout-dashboard', label: 'Dashboard'  },
        { href: 'orcamentos.html?novo=1', icone: 'ti-file-plus', label: 'Novo orçamento' },
        { href: 'historico.html',  icone: 'ti-file-invoice',     label: 'Histórico'  },
        { href: 'clientes.html',   icone: 'ti-users',            label: 'Clientes'   },
      ]
    },
    {
      label: 'GESTÃO',
      itens: [
        { href: 'financeiro.html',   icone: 'ti-coin',      label: 'Financeiro'   },
        { href: 'estoque.html',      icone: 'ti-box',       label: 'Estoque', emBreve: true },
        { href: 'fornecedores.html', icone: 'ti-truck',     label: 'Fornecedores' },
      ]
    },
    {
      label: 'ANÁLISE',
      itens: [
        { href: 'relatorios.html', icone: 'ti-chart-bar', label: 'Relatórios', emBreve: true },
      ]
    }
  ];

  if (isAdmin()) {
    secoes[2].itens.push({ href: 'configuracoes.html', icone: 'ti-settings', label: 'Configurações' });
  }

  const iniciais = s.nome ? escHtml(s.nome.substring(0, 2).toUpperCase()) : 'US';

  let navHtml = '';
  secoes.forEach(sec => {
    navHtml += `<div class="nav-section">${sec.label}</div>`;
    sec.itens.forEach(item => {
      navHtml += `
        <a href="${item.href}" class="nav-item ${paginaAtiva === item.href.split('?')[0] ? 'ativo' : ''}">
          <i class="ti ${item.icone}" aria-hidden="true"></i>
          <span class="nav-item-label">${item.label}</span>
          ${item.emBreve ? '<span class="nav-badge">Em breve</span>' : ''}
        </a>`;
    });
  });

  const html = `
    <div class="sidebar-logo">
      <div class="logo-mark">PRYN<span>TIX</span></div>
    </div>
    <nav class="sidebar-nav">${navHtml}</nav>
    <div class="sidebar-footer">
      <div class="user-row">
        <div class="user-avatar">${iniciais}</div>
        <div class="user-info">
          <div class="user-name">${escHtml(s.nome)}</div>
          <button class="btn-sair" onclick="sair()">Sair</button>
        </div>
      </div>
    </div>
  `;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = html;
  iniciarMenuMobile();
}

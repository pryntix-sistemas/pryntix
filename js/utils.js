/* ============================================================
   PRYNTIX — utils.js
   Funções utilitárias compartilhadas
   ============================================================ */

// Formatação
function fmtMoeda(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
}

function fmtData(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('pt-BR');
}

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

// Toast
function toast(msg, tipo = 'info', dur = 3500) {
  let c = document.getElementById('toast-container');
  if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
  const el = document.createElement('div');
  el.className = `toast toast-${tipo}`;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, dur);
}

// Modal
function abrirModal(id) { document.getElementById(id)?.classList.add('aberto'); }
function fecharModal(id) { document.getElementById(id)?.classList.remove('aberto'); }
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('aberto');
});

// Supabase REST
async function supaGet(tabela, filtros = '') {
  const res = await fetch(`${SUPA_URL}/rest/v1/${tabela}?${filtros}`, {
    headers: { ...headersAuth(), 'Prefer': 'return=representation' }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supaPost(tabela, dados) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${tabela}`, {
    method: 'POST',
    headers: { ...headersAuth(), 'Prefer': 'return=representation' },
    body: JSON.stringify(dados)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supaPatch(tabela, filtro, dados) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${tabela}?${filtro}`, {
    method: 'PATCH',
    headers: { ...headersAuth(), 'Prefer': 'return=representation' },
    body: JSON.stringify(dados)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supaDelete(tabela, filtro) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${tabela}?${filtro}`, {
    method: 'DELETE',
    headers: headersAuth()
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

// Menu mobile
function iniciarMenuMobile() {
  const btn     = document.getElementById('btn-menu-mobile');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (btn && sidebar) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('aberto');
      overlay?.classList.toggle('aberto');
    });
  }
  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('aberto');
    overlay.classList.remove('aberto');
  });
}

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
  const apenasData = /^\d{4}-\d{2}-\d{2}$/.test(String(d).substring(0, 10));
  const dt = apenasData ? dataLocal(String(d).substring(0, 10)) : new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('pt-BR');
}

function numeroOrcamento(id) {
  if (id === null || id === undefined || id === '') return 'A gerar';
  return 'ORC-' + String(id).padStart(6, '0');
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
async function supaRequest(url, opcoes = {}, repetir = true) {
  await garantirSessaoValida();
  const res = await fetch(url, {
    ...opcoes,
    headers: { ...headersAuth(), ...(opcoes.headers || {}) }
  });
  if (res.status === 401 && repetir) {
    await renovarSessao();
    return supaRequest(url, opcoes, false);
  }
  return res;
}

async function supaGet(tabela, filtros = '') {
  const res = await supaRequest(`${SUPA_URL}/rest/v1/${tabela}?${filtros}`, {
    headers: { 'Prefer': 'return=representation' }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supaPost(tabela, dados) {
  const res = await supaRequest(`${SUPA_URL}/rest/v1/${tabela}`, {
    method: 'POST',
    headers: { 'Prefer': 'return=representation' },
    body: JSON.stringify(dados)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supaPatch(tabela, filtro, dados) {
  const res = await supaRequest(`${SUPA_URL}/rest/v1/${tabela}?${filtro}`, {
    method: 'PATCH',
    headers: { 'Prefer': 'return=representation' },
    body: JSON.stringify(dados)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function supaDelete(tabela, filtro) {
  const res = await supaRequest(`${SUPA_URL}/rest/v1/${tabela}?${filtro}`, {
    method: 'DELETE',
    headers: {}
  });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

function escHtml(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function codificarArgumento(valor) {
  return encodeURIComponent(String(valor ?? '')).replace(/'/g, '%27');
}

function parseMoedaBR(valor) {
  if (typeof valor === 'number') return valor;
  const limpo = String(valor || '').replace(/\s/g, '').replace(/R\$/gi, '').replace(/\./g, '').replace(',', '.');
  const numero = Number(limpo);
  return Number.isFinite(numero) ? numero : NaN;
}

function dataLocal(d) {
  if (!d) return null;
  const parte = String(d).substring(0, 10).split('-').map(Number);
  if (parte.length !== 3 || parte.some(Number.isNaN)) return null;
  return new Date(parte[0], parte[1] - 1, parte[2]);
}

// Retorna a data do calendário local no formato aceito por <input type="date">.
// Evita o avanço/retrocesso de um dia causado pela conversão UTC de toISOString().
function dataISOLocal(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Links e clipboard
function urlOrcamentoPublico(token) {
  const basePublica = typeof PUBLIC_BASE_URL === 'string' && PUBLIC_BASE_URL
    ? PUBLIC_BASE_URL
    : window.location.href;
  const url = new URL('ver.html', basePublica);
  url.search = '';
  url.hash = '';
  url.searchParams.set('token', token);
  return url.href;
}

async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const campo = document.createElement('textarea');
    campo.value = texto;
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    document.body.appendChild(campo);
    campo.select();
    const copiado = document.execCommand('copy');
    campo.remove();
    return copiado;
  }
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

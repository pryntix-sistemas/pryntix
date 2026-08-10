/* ============================================================
   PRYNTIX — auth.js
   Autenticação e controle de sessão
   ============================================================ */

function verificarSessao() {
  const raw = localStorage.getItem(SESSAO_KEY);
  if (!raw) { window.location.href = 'login.html'; return null; }
  try {
    const s = JSON.parse(raw);
    if (Date.now() > s.expira) {
      localStorage.removeItem(SESSAO_KEY);
      window.location.href = 'login.html';
      return null;
    }
    return s;
  } catch {
    localStorage.removeItem(SESSAO_KEY);
    window.location.href = 'login.html';
    return null;
  }
}

function getSessao() {
  const raw = localStorage.getItem(SESSAO_KEY);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    if (Date.now() > s.expira) { localStorage.removeItem(SESSAO_KEY); return null; }
    return s;
  } catch { return null; }
}

function isAdmin() {
  const s = getSessao();
  return s && s.perfil === 'admin';
}

function sair() {
  localStorage.removeItem(SESSAO_KEY);
  window.location.href = 'login.html';
}

function headersAuth() {
  const s = getSessao();
  const token = s?.token || SUPA_ANON;
  return {
    'Content-Type': 'application/json',
    'apikey': SUPA_ANON,
    'Authorization': `Bearer ${token}`
  };
}

function headersAnon() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPA_ANON,
    'Authorization': `Bearer ${SUPA_ANON}`
  };
}

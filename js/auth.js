/* ============================================================
   PRYNTIX — auth.js
   Autenticação e controle de sessão
   ============================================================ */

function verificarSessao() {
  const raw = localStorage.getItem(SESSAO_KEY);
  if (!raw) { window.location.href = 'login.html'; return null; }
  try {
    const s = JSON.parse(raw);
    if (!s.token || !s.refresh) throw new Error('Sessão inválida');
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
    return s;
  } catch { return null; }
}

let renovacaoEmAndamento = null;

async function renovarSessao() {
  const atual = getSessao();
  if (!atual?.refresh) throw new Error('Sessão expirada');
  if (renovacaoEmAndamento) return renovacaoEmAndamento;

  renovacaoEmAndamento = fetch(`${SUPA_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPA_ANON },
    body: JSON.stringify({ refresh_token: atual.refresh })
  }).then(async res => {
    const dados = await res.json();
    if (!res.ok || !dados.access_token) throw new Error('Não foi possível renovar a sessão');
    const sessao = {
      ...atual,
      token: dados.access_token,
      refresh: dados.refresh_token || atual.refresh,
      expira: Date.now() + ((dados.expires_in || 3600) * 1000)
    };
    localStorage.setItem(SESSAO_KEY, JSON.stringify(sessao));
    return sessao;
  }).catch(erro => {
    localStorage.removeItem(SESSAO_KEY);
    throw erro;
  }).finally(() => { renovacaoEmAndamento = null; });

  return renovacaoEmAndamento;
}

async function garantirSessaoValida() {
  const s = getSessao();
  if (!s) throw new Error('Sessão não encontrada');
  if (Date.now() < (s.expira || 0) - 60000) return s;
  return renovarSessao();
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

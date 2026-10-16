// Isi dua nilai ini sebelum upload ke GitHub Pages.
window.SUPABASE_CONFIG = {
  url: 'https://ymtqeuymvlpqvnwzpsox.supabase.co',
  anonKey: 'sb_publishable_3IDWQnmvHas1QvgaLspyOA_cE2sraC7'
};

window.SPMIDB = (() => {
  const cfg = window.SUPABASE_CONFIG;
  const base = `${cfg.url.replace(/\/$/, '')}/rest/v1`;
  async function request(table, options = {}) {
    const headers = {
      apikey: cfg.anonKey,
      Authorization: `Bearer ${cfg.anonKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    const res = await fetch(`${base}/${table}${options.query || ''}`, {
      method: options.method || 'GET', headers, body: options.body
    });
    const text = await res.text();
    let data = null; try { data = text ? JSON.parse(text) : null; } catch {}
    if (!res.ok) throw new Error(data?.message || data?.hint || data?.error || `Supabase ${res.status}`);
    return data;
  }
  const get = (table, query='') => request(table, {query});
  const insert = (table, rows) => request(table, {
    method:'POST',
    query:'',
    headers:{Prefer:'return=representation'},
    body:JSON.stringify(rows)
  });
  const upsert = (table, rows, onConflict) => request(table, {
    method:'POST',
    query:`?on_conflict=${encodeURIComponent(onConflict)}`,
    headers:{Prefer:'resolution=merge-duplicates,return=representation'},
    body:JSON.stringify(rows)
  });
  return { get, insert, upsert };
})();

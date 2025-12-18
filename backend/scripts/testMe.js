(async ()=>{
  const API = 'http://localhost:5000/api';
  const fetch = global.fetch || (await import('node-fetch')).default;
  try {
    const r = await fetch(API + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'test-user-owner@example.com', password: 'ownerpass' }) });
    const j = await r.json();
    console.log('login token present?', !!j.token);
    if (j.token) {
      const m = await fetch(API + '/auth/me', { headers: { Authorization: 'Bearer ' + j.token } });
      console.log('me status', m.status);
      console.log(await m.json());
    }
  } catch (e) { console.error(e); process.exit(1); }
})();

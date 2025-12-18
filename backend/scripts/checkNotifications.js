(async ()=>{
  const API = 'http://localhost:5000/api';
  const fetch = global.fetch || (await import('node-fetch')).default;
  const users = [
    { email: 'e2e-owner@example.com', pass: 'ownerpass', label: 'owner' },
    { email: 'e2e-requester@example.com', pass: 'reqpass', label: 'requester' }
  ];

  for (const u of users) {
    try {
      const r = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ email: u.email, password: u.pass }) });
      const j = await r.json();
      console.log(`\n[${u.label}] login token?`, !!j.token);
      if (!j.token) { console.log('login body', j); continue; }
      const token = j.token;
      const me = await (await fetch(`${API}/auth/me`, { headers: { Authorization: 'Bearer '+token } })).json();
      console.log(`[${u.label}] me id:`, me._id);
      const n = await (await fetch(`${API}/notifications`, { headers: { Authorization: 'Bearer '+token } })).json();
      console.log(`[${u.label}] notifications count:`, n.length);
      console.log(n.map(x=>({id:x._id, user:x.user, resourceId:x.resourceId,title:x.title})));
    } catch (e) {
      console.error('error for', u, e);
    }
  }
})();

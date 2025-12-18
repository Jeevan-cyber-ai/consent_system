require('dotenv').config();
const fetch = require('node-fetch');
const API = 'http://localhost:5000/api';

async function run(){
  // login requester and owner created by smokeTest
  const requester = await (await fetch(`${API}/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: 'test-user-requester@example.com', password: 'reqpass' }) })).json();
  const owner = await (await fetch(`${API}/auth/login`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: 'test-user-owner@example.com', password: 'ownerpass' }) })).json();

  console.log('tokens:', !!requester.token, !!owner.token);

  // requester requests profile
  const reqRes = await fetch(`${API}/consent/request`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${requester.token}` }, body: JSON.stringify({ dataOwner: owner.user ? owner.user._id : undefined, dataType: 'profile' }) });
  const reqJson = await reqRes.json();
  console.log('consent request created:', reqJson._id || reqJson);

  // owner fetch notifications
  const notifRes = await fetch(`${API}/notifications`, { headers: { Authorization: `Bearer ${owner.token}` } });
  const notifs = await notifRes.json();
  console.log('owner notifications (latest 5):', notifs.slice(0,5));
}

run().catch(e=>{ console.error(e); process.exit(1); });

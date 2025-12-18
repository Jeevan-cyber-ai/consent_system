require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fetch = global.fetch || require('node-fetch');

const User = require('../src/models/userModel');
const Consent = require('../src/models/consentModel');

const API = process.env.API_BASE || 'http://localhost:5000/api';

async function ensureUser(email, name, password, role='owner'){
  let u = await User.findOne({ email });
  if(u) return u;
  const hashed = await bcrypt.hash(password, 10);
  u = await User.create({ name, email, password: hashed, role });
  return u;
}

async function login(email, password){
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password })
  });
  const j = await res.json();
  return j;
}

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  console.log('DB connected');

  // ensure users exist
  const ownerEmail = 'e2e-owner@example.com';
  const reqEmail = 'e2e-requester@example.com';
  const ownerPass = 'ownerpass';
  const reqPass = 'reqpass';

  const owner = await ensureUser(ownerEmail, 'E2E Owner', ownerPass, 'owner');
  const requester = await ensureUser(reqEmail, 'E2E Requester', reqPass, 'requester');
  console.log('Owner/requester ids:', owner._id.toString(), requester._id.toString());

  // login both
  const ownerLogin = await login(ownerEmail, ownerPass);
  const requesterLogin = await login(reqEmail, reqPass);
  if(!ownerLogin.token || !requesterLogin.token){
    console.error('Login failed for one of the users', ownerLogin, requesterLogin);
    process.exit(1);
  }
  const ownerToken = ownerLogin.token;
  const requesterToken = requesterLogin.token;
  console.log('Logged in both users');

  // requester requests owner's profile
  const reqRes = await fetch(`${API}/consent/request`, {
    method: 'POST', headers: { 'Content-Type':'application/json', Authorization: 'Bearer '+requesterToken },
    body: JSON.stringify({ dataOwner: owner._id.toString(), dataType: 'profile' })
  });
  const consent = await reqRes.json();
  console.log('Consent requested:', consent._id || consent);

  // owner fetches notifications
  const notifRes = await fetch(`${API}/notifications`, { headers: { Authorization: 'Bearer '+ownerToken } });
  const notifs = await notifRes.json();
  console.log('Owner notifications:', notifs.map(n=>({id:n._id, title:n.title, resourceId:n.resourceId}))); 

  // find consent id from DB if needed
  const consentId = consent._id || (notifs.find(n=>n.resourceId)? notifs.find(n=>n.resourceId).resourceId : null);
  if(!consentId){
    console.error('Could not determine consent id');
    process.exit(1);
  }

  // owner approves
  const approveRes = await fetch(`${API}/consent/approve/${consentId}`, { method: 'PUT', headers: { Authorization: 'Bearer '+ownerToken } });
  const approval = await approveRes.json();
  console.log('Approval result:', approval.consent ? approval.consent.status : approval.status || approval);

  // requester polls my-requests
  const myReqRes = await fetch(`${API}/consent/my-requests`, { headers: { Authorization: 'Bearer '+requesterToken } });
  const myReqs = await myReqRes.json();
  console.log('Requester requests:', myReqs.map(r=>({id:r._id, status:r.status})));

  // requester attempts to fetch data via profile endpoint
  const profileRes = await fetch(`${API}/profile/${owner._id}`, { headers: { Authorization: 'Bearer '+requesterToken } });
  const profile = await profileRes.json();
  console.log('Requester fetched profile:', profile.name ? profile.email : profile);

  console.log('E2E flow complete');
  process.exit(0);
}

run().catch(err=>{ console.error('E2E error', err); process.exit(1); });

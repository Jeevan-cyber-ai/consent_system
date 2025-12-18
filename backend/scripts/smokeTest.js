require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fetch = global.fetch || require('node-fetch');

const User = require('../src/models/userModel');
const Consent = require('../src/models/consentModel');

const API = 'http://localhost:5000/api';

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected DB for smoke test');

  // cleanup test users
  await User.deleteMany({ email: /test-user-.*@example.com/ });

  // create owner and requester directly in DB
  const ownerPassword = 'ownerpass';
  const requesterPassword = 'reqpass';

  const owner = await User.create({
    name: 'Owner Test',
    email: 'test-user-owner@example.com',
    password: await bcrypt.hash(ownerPassword, 10),
    role: 'owner',
    linkedin: 'https://linkedin.example/owner',
    bio: 'Owner bio',
    additionalDetails: { title: 'Owner' }
  });

  const requester = await User.create({
    name: 'Requester Test',
    email: 'test-user-requester@example.com',
    password: await bcrypt.hash(requesterPassword, 10),
    role: 'requester'
  });

  console.log('Created owner and requester:', owner._id.toString(), requester._id.toString());

  // login both using API to get tokens
  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return data.token;
  };

  const ownerToken = await login(owner.email, ownerPassword);
  const requesterToken = await login(requester.email, requesterPassword);
  console.log('Obtained tokens');

  // requester requests profile consent
  let res = await fetch(`${API}/consent/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${requesterToken}` },
    body: JSON.stringify({ dataOwner: owner._id.toString(), dataType: 'profile' })
  });
  const consent = await res.json();
  console.log('Consent requested:', consent._id || consent);

  // owner approves
  res = await fetch(`${API}/consent/approve/${consent._id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  const approval = await res.json();
  console.log('Approval result:', approval.consent ? approval.consent.status : approval.status || approval);

  // requester fetches profile
  res = await fetch(`${API}/profile/${owner._id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${requesterToken}` }
  });
  const profile = await res.json();
  console.log('Requester fetched profile:', profile.name, profile.email);

  // cleanup
  await Consent.deleteMany({ requester: requester._id });
  // keep users for debugging

  console.log('Smoke test completed');
  process.exit(0);
}

run().catch(err => { console.error('Smoke test error', err); process.exit(1); });

// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow Netlify domain when deploying, or all for development
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.warn("WARNING: Supabase URL or Key not set. API will not function correctly.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROUTES ---

// Welcome route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family:sans-serif; text-align:center; padding-top:50px;">
        <h1>Asset Management API</h1>
        <p>Status: <span style="color:green">Online</span></p>
        <p>API Endpoint: <a href="/api/health">/api/health</a></p>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// -- ASSETS --
// Get all assets
app.get('/api/assets', async (req, res) => {
  const { data, error } = await supabase.from('assets').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add an asset
app.post('/api/assets', async (req, res) => {
  const { data, error } = await supabase.from('assets').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// -- RIGS --
// Get all rigs
app.get('/api/rigs', async (req, res) => {
  const { data, error } = await supabase.from('rigs').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Update a rig
app.put('/api/rigs/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('rigs').update(req.body).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// -- MAINTENANCE --
// Get maintenance schedules
app.get('/api/maintenance', async (req, res) => {
  const { data, error } = await supabase.from('maintenance').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add a maintenance schedule
app.post('/api/maintenance', async (req, res) => {
  const { data, error } = await supabase.from('maintenance').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Update maintenance schedule
app.put('/api/maintenance/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('maintenance').update(req.body).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// -- TRANSFERS --
// Get transfers
app.get('/api/transfers', async (req, res) => {
  const { data, error } = await supabase.from('transfers').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add transfer
app.post('/api/transfers', async (req, res) => {
  const { data, error } = await supabase.from('transfers').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Update transfer
app.put('/api/transfers/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('transfers').update(req.body).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// -- USERS --
// Get users
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add user
app.post('/api/users', async (req, res) => {
  const { data, error } = await supabase.from('users').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('users').update(req.body).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// -- BOM --
// Get BOM
app.get('/api/bom', async (req, res) => {
  const { data, error } = await supabase.from('bom').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Add BOM item
app.post('/api/bom', async (req, res) => {
  const { data, error } = await supabase.from('bom').insert([req.body]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Update BOM item
app.put('/api/bom/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('bom').update(req.body).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Delete BOM item
app.delete('/api/bom/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('bom').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// -- DELETE HELPERS --
app.delete('/api/assets/:id', async (req, res) => {
  const { error } = await supabase.from('assets').delete().eq('asset_id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

app.delete('/api/maintenance/:id', async (req, res) => {
  const { error } = await supabase.from('maintenance').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

app.delete('/api/transfers/:id', async (req, res) => {
  const { error } = await supabase.from('transfers').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});

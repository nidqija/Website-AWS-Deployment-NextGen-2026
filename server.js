/**
 * Solstice Coffee Roasters - Standalone Node.js Backend Server
 * 
 * Run with: node server.js
 * Default Port: 5000 (or process.env.PORT)
 */

import http from 'node:http';
import { handleApiRoute } from './api.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
  try {
    const handled = await handleApiRoute(req, res);
    if (!handled) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Endpoint not found. Available: /api/status, /api/menu, /api/reserve, /api/newsletter' }));
    }
  } catch (err) {
    console.error('Server error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`☕ Solstice Coffee Roasters Backend API is running at http://localhost:${PORT}`);
  console.log(`📡 Endpoints available:`);
  console.log(`   - GET  /api/status`);
  console.log(`   - GET  /api/menu`);
  console.log(`   - POST /api/reserve`);
  console.log(`   - POST /api/newsletter`);
});

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleGradeOnionRequest, handleDisputeReauditRequest } from './src/server/apiHandler.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'SIH26031 Onion Quality Assessment & Grading System',
    ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
    timestamp: new Date().toISOString(),
  });
});

// Quality Grading Endpoint
app.post('/api/grade-onion', async (req, res) => {
  try {
    const result = await handleGradeOnionRequest(req.body);
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/grade-onion:', err);
    res.status(500).json({ error: err.message || 'Internal grading engine error' });
  }
});

// Dispute Resolution Endpoint
app.post('/api/resolve-dispute', async (req, res) => {
  try {
    const result = await handleDisputeReauditRequest(req.body);
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/resolve-dispute:', err);
    res.status(500).json({ error: err.message || 'Internal dispute re-audit error' });
  }
});

// Serve production static files
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Onion Grading Server running on http://0.0.0.0:${PORT}`);
});

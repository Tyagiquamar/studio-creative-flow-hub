const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
require('dotenv').config();
const crypto = require('crypto');

const { createCharge } = require('./coinbase');
const { saveInvoice, getInvoices } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let sockets = [];

wss.on('connection', (ws) => {
  sockets.push(ws);
  ws.on('close', () => {
    sockets = sockets.filter(s => s !== ws);
  });
});

// Broadcast invoice status updates
function broadcast(data) {
  sockets.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  });
}

// Create invoice (Coinbase Commerce charge)
app.post('/api/invoice', async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const charge = await createCharge(amount, currency);
    // Adapt the charge response from Coinbase Commerce to our invoice schema
    const invoiceToSave = {
      id: charge.id,
      status: charge.timeline && charge.timeline.length > 0 ? charge.timeline[charge.timeline.length - 1].status : 'NEW',
      amount: charge.pricing.local.amount,
      currency: charge.pricing.local.currency,
      checkoutLink: charge.hosted_url,
      created_at: charge.created_at,
    };
    await saveInvoice(invoiceToSave);
    res.json(invoiceToSave);
  } catch (err) {
    console.error("Error creating charge:", err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Failed to create charge' });
  }
});

// Get all invoices
app.get('/api/invoices', async (req, res) => {
  const invoices = await getInvoices();
  res.json(invoices);
});

// Webhook endpoint for OpenNode
app.post('/api/opennode/webhook', async (req, res) => {
  // It's crucial to verify the webhook signature in a real application
  // See OpenNode docs: https://developers.opennode.com/docs/webhooks
  const { id, status } = req.body;
  
  console.log(`Webhook received for charge ${id}, status: ${status}`);

  // You'd typically have a function to update the invoice status in your DB
  // await updateInvoiceStatus(id, status);

  broadcast({ invoiceId: id, status });
  res.sendStatus(200);
});

// Coinbase Commerce webhook endpoint
app.post('/api/coinbase/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // Coinbase Commerce sends the raw body for signature verification
  const signature = req.headers['x-cc-webhook-signature'];
  const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET;

  // Verify signature (recommended for production)
  if (webhookSecret) {
    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex');
    if (computedSignature !== signature) {
      return res.status(400).send('Invalid signature');
    }
  }

  // Parse the event
  const event = JSON.parse(req.body.toString());
  const charge = event.event && event.event.data;
  if (!charge) return res.status(400).send('No charge data');

  // Get latest status from timeline
  const latestStatus = charge.timeline && charge.timeline.length > 0 ? charge.timeline[charge.timeline.length - 1].status : 'NEW';

  // Update invoice status in DB
  try {
    await saveInvoice({
      id: charge.id,
      status: latestStatus,
      amount: charge.pricing.local.amount,
      currency: charge.pricing.local.currency,
      checkoutLink: charge.hosted_url,
      created_at: charge.created_at,
    });
    broadcast({ invoiceId: charge.id, status: latestStatus });
    res.sendStatus(200);
  } catch (err) {
    console.error('Error updating invoice from webhook:', err);
    res.status(500).send('Error updating invoice');
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
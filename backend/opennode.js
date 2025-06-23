const axios = require('axios');

const OPENNODE_API_KEY = process.env.OPENNODE_API_KEY;
const API_URL = 'https://api.opennode.com/v1/charges';

async function createCharge(amount, currency) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': OPENNODE_API_KEY,
  };

  const body = {
    amount: amount,
    currency: currency,
    // You can add more details here if needed
    // description: "Charge for order #123",
    // order_id: "my-internal-order-id"
  };

  const response = await axios.post(API_URL, body, { headers });
  return response.data.data; // OpenNode nests the charge object in `data`
}

// OpenNode uses webhooks to notify of status changes,
// so a direct getInvoiceStatus function is less common.
// We will rely on webhooks.
// You can still implement a GET /v1/charge/{chargeId} if needed.

module.exports = { createCharge }; 
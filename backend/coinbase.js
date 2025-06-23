const axios = require('axios');

const COINBASE_API_KEY = process.env.COINBASE_API_KEY;
const API_URL = 'https://api.commerce.coinbase.com/charges';

async function createCharge(amount, currency) {
  const headers = {
    'Content-Type': 'application/json',
    'X-CC-Api-Key': COINBASE_API_KEY,
    'X-CC-Version': '2018-03-22',
  };

  const body = {
    name: 'Invoice',
    description: 'Payment Invoice',
    pricing_type: 'fixed_price',
    local_price: {
      amount: amount.toString(),
      currency: currency,
    },
  };

  const response = await axios.post(API_URL, body, { headers });
  return response.data.data; // Coinbase nests the charge object in `data`
}

module.exports = { createCharge }; 
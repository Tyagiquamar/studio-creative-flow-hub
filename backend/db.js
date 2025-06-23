const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function saveInvoice(invoice) {
  await pool.query(
    'INSERT INTO invoices (id, amount, currency, status, checkout_link) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET status = $4, checkout_link = $5',
    [invoice.id, invoice.amount, invoice.currency, invoice.status, invoice.checkoutLink]
  );
}

async function getInvoices() {
  const res = await pool.query('SELECT * FROM invoices ORDER BY created_at DESC');
  return res.rows;
}

module.exports = { saveInvoice, getInvoices }; 
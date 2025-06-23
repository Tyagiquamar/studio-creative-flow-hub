import React, { useState } from "react";
import axios from "axios";

function InvoiceForm({ onNewInvoice }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("BTC");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await axios.post("http://localhost:4000/api/invoice", {
      amount,
      currency,
    });
    onNewInvoice(res.data);
    setAmount("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        type="number"
        step="any"
        min="0"
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="border p-2 rounded flex-1"
      />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="BTC">BTC</option>
        <option value="USD">USD</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Invoice"}
      </button>
    </form>
  );
}

export default InvoiceForm; 
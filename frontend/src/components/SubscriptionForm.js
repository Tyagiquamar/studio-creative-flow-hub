import React, { useState } from "react";
import axios from "axios";

const mockPlans = [
  { id: 1, name: "Basic", price: 10, description: "Basic plan with limited features." },
  { id: 2, name: "Pro", price: 30, description: "Pro plan with all features." },
  { id: 3, name: "Enterprise", price: 100, description: "Enterprise plan with premium support." },
];

function SubscriptionForm({ onInvoiceCreated }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const plan = mockPlans.find(p => p.id === parseInt(selected));
      const res = await axios.post("http://localhost:4000/api/invoice", {
        amount: plan.price,
        currency: "USD",
        description: plan.name + " Subscription",
      });
      onInvoiceCreated(res.data);
    } catch (err) {
      setError("Failed to create invoice");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Subscribe to a SaaS Plan</h3>
      <select
        value={selected || ""}
        onChange={e => setSelected(e.target.value)}
        className="border p-2 rounded w-full mb-2"
        required
      >
        <option value="" disabled>Select a plan</option>
        {mockPlans.map(plan => (
          <option key={plan.id} value={plan.id}>
            {plan.name} - ${plan.price}
          </option>
        ))}
      </select>
      {selected && (
        <div className="mb-2 text-gray-700">
          {mockPlans.find(p => p.id === parseInt(selected)).description}
        </div>
      )}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Subscribe & Pay"}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}

export default SubscriptionForm; 
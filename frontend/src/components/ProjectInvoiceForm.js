import React, { useState } from "react";
import axios from "axios";

function ProjectInvoiceForm({ project, onInvoiceCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:4000/api/invoice", {
        amount: project.budget,
        currency: "USD",
        description: project.title + " for " + project.client,
      });
      onInvoiceCreated(res.data);
    } catch (err) {
      setError("Failed to create invoice");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
      <h3 className="font-semibold mb-2">Create Invoice for Project</h3>
      <div><b>Project:</b> {project.title}</div>
      <div><b>Client:</b> {project.client}</div>
      <div><b>Budget:</b> ${project.budget}</div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Invoice"}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
}

export default ProjectInvoiceForm; 
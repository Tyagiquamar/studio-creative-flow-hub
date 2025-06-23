import React, { useState } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceList from "./components/InvoiceList";
import InvoiceStatus from "./components/InvoiceStatus";
import ProjectList from "./components/ProjectList";
import ProjectInvoiceForm from "./components/ProjectInvoiceForm";
import SubscriptionForm from "./components/SubscriptionForm";
import axios from "axios";

function App() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState("projects"); // "projects", "subscription", "invoices"

  React.useEffect(() => {
    fetchInvoices();
    const ws = new WebSocket("ws://localhost:4000");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === data.invoiceId ? { ...inv, status: data.status } : inv
        )
      );
    };
    return () => ws.close();
  }, []);

  const fetchInvoices = async () => {
    const res = await axios.get("http://localhost:4000/api/invoices");
    setInvoices(res.data);
  };

  const handleNewInvoice = (invoice) => {
    setInvoices([invoice, ...invoices]);
    setSelectedInvoice(invoice);
    setView("invoices");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Freelance Platform with Automated Invoicing</h1>
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded ${view === "projects" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setView("projects")}
          >
            Freelance Projects
          </button>
          <button
            className={`px-4 py-2 rounded ${view === "subscription" ? "bg-green-600 text-white" : "bg-gray-200"}`}
            onClick={() => setView("subscription")}
          >
            SaaS Subscription
          </button>
          <button
            className={`px-4 py-2 rounded ${view === "invoices" ? "bg-gray-800 text-white" : "bg-gray-200"}`}
            onClick={() => setView("invoices")}
          >
            Invoice History
          </button>
        </div>
        {view === "projects" && (
          <>
            <ProjectList onSelectProject={setSelectedProject} />
            <ProjectInvoiceForm project={selectedProject} onInvoiceCreated={handleNewInvoice} />
          </>
        )}
        {view === "subscription" && (
          <SubscriptionForm onInvoiceCreated={handleNewInvoice} />
        )}
        {selectedInvoice && (
          <InvoiceStatus invoice={selectedInvoice} />
        )}
        {view === "invoices" && (
          <InvoiceList invoices={invoices} onSelect={setSelectedInvoice} />
        )}
      </div>
    </div>
  );
}

export default App; 
import React from "react";
import QRCode from "react-qr-code";

function InvoiceStatus({ invoice }) {
  return (
    <div className="mb-6 p-4 border rounded bg-gray-50">
      <h2 className="font-semibold mb-2">Invoice Status: {invoice.status}</h2>
      <div className="flex items-center gap-4">
        <QRCode value={invoice.checkoutLink || invoice.id} size={96} />
        <div>
          <div>
            <span className="font-mono">{invoice.id}</span>
          </div>
          {invoice.checkoutLink && (
            <a
              href={invoice.checkoutLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Pay Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvoiceStatus; 
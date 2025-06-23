import React from "react";

function InvoiceList({ invoices, onSelect }) {
  if (invoices.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No invoices yet. Create your first invoice above!
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Invoice History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Currency
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                onClick={() => onSelect(invoice)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-2 text-sm font-mono text-gray-900">
                  {invoice.id.substring(0, 8)}...
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {invoice.amount}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {invoice.currency}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : invoice.status === "expired"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(invoice.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InvoiceList; 
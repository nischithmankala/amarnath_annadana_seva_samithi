import { useState } from 'react'
import { DonationReceipt, type ReceiptItem } from '../../components/receipt/DonationReceipt'

export const ReceiptViewer: React.FC = () => {
  const [donorName, setDonorName] = useState('Sri Ramesh Kumar')
  const [donorAddress, setDonorAddress] = useState('Door No. 12-34, Housing Board Colony\nSiddipet, Telangana - 502103')
  const [donorPhone, setDonorPhone] = useState('+91 91234 56789')
  const [receiptNumber, setReceiptNumber] = useState('AASS-SDPT-2026-001')
  const [date, setDate] = useState('September 28, 2026')
  const [paymentMethod, setPaymentMethod] = useState('UPI / Online Transfer')
  const [transactionId, setTransactionId] = useState('UPI/625983710294')
  
  const [items, setItems] = useState<ReceiptItem[]>([
    {
      description: 'Amarnath Yatra Annadanam Seva Contribution',
      subtitle: '(Mahaprasadam)',
      qty: '1',
      rate: 5000,
      amount: 5000,
    },
    {
      description: 'Special Meal Sponsorship (Nitya Annadanam)',
      qty: '1 Day',
      rate: 2500,
      amount: 2500,
    },
  ])

  const [showEditor, setShowEditor] = useState(false)

  const handleItemChange = (index: number, field: keyof ReceiptItem, val: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: val }
    if (field === 'rate' || field === 'qty') {
      const parsedRate = parseFloat(updated[index].rate as any) || 0
      updated[index].amount = parsedRate
    }
    setItems(updated)
  }

  const addItem = () => {
    setItems([...items, { description: 'Special Annadana Seva', qty: '1', rate: 1000, amount: 1000 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900/90 py-8 px-4 flex flex-col items-center">
      {/* Control Bar for Desktop */}
      <div className="no-print w-[210mm] max-w-full flex justify-between items-center mb-6 bg-white/95 backdrop-blur p-4 rounded-xl border border-amber-300 shadow-xl">
        <div>
          <h2 className="text-lg font-serif font-bold text-emerald-950 flex items-center gap-2">
            <span>🔱</span> Official Donation Receipt Generator
          </h2>
          <p className="text-xs text-neutral-600">Amarnath Annadana Seva Samithi Siddipet</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg text-sm font-semibold shadow hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>
            {showEditor ? 'Hide Editor' : 'Customize Receipt'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-lg text-sm font-bold shadow-lg hover:from-emerald-900 hover:to-emerald-800 transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/><path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/></svg>
            Print / Download PDF
          </button>
        </div>
      </div>

      <div className="flex gap-6 w-[210mm] max-w-full justify-center">
        {/* The Printable A4 Receipt */}
        <div className="print:m-0">
          <DonationReceipt
            donorName={donorName}
            donorAddress={donorAddress}
            donorPhone={donorPhone}
            receiptNumber={receiptNumber}
            date={date}
            paymentMethod={paymentMethod}
            transactionId={transactionId}
            items={items}
          />
        </div>

        {/* Live Customizer Drawer */}
        {showEditor && (
          <div className="no-print w-96 bg-white rounded-xl shadow-2xl border border-neutral-200 p-5 h-fit sticky top-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-bold text-emerald-900 text-sm">Receipt Configuration</h3>
              <button onClick={() => setShowEditor(false)} className="text-neutral-500 hover:text-neutral-900 text-lg cursor-pointer">&times;</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Donor Name</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full p-2 border rounded border-neutral-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Donor Address</label>
                <textarea
                  rows={2}
                  value={donorAddress}
                  onChange={(e) => setDonorAddress(e.target.value)}
                  className="w-full p-2 border rounded border-neutral-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Donor Phone</label>
                <input
                  type="text"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full p-2 border rounded border-neutral-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Receipt No</label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    className="w-full p-2 border rounded border-neutral-300 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded border-neutral-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 border rounded border-neutral-300 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Transaction ID</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full p-2 border rounded border-neutral-300 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <hr className="my-3 border-neutral-200" />
              <div className="flex justify-between items-center">
                <label className="font-bold text-emerald-900">Seva Items</label>
                <button
                  onClick={addItem}
                  className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold px-2 py-1 rounded border border-emerald-300 cursor-pointer"
                >
                  + Add Item
                </button>
              </div>

              {items.map((it, idx) => (
                <div key={idx} className="p-2.5 bg-neutral-50 rounded border border-neutral-200 space-y-2 relative">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="absolute top-1 right-2 text-red-500 hover:text-red-700 font-bold text-sm cursor-pointer"
                    >
                      &times;
                    </button>
                  )}
                  <div>
                    <label className="block text-[11px] text-neutral-600 font-medium">Description</label>
                    <input
                      type="text"
                      value={it.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full p-1.5 border rounded border-neutral-300 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-neutral-600 font-medium">Qty / Duration</label>
                      <input
                        type="text"
                        value={it.qty}
                        onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                        className="w-full p-1.5 border rounded border-neutral-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 font-medium">Amount (₹)</label>
                      <input
                        type="number"
                        value={it.rate}
                        onChange={(e) => handleItemChange(idx, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full p-1.5 border rounded border-neutral-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg shadow transition-all cursor-pointer"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default ReceiptViewer

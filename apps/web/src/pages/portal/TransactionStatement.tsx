import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { api } from '../../lib/api'
import { Download } from 'lucide-react'

export function TransactionStatement() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/member/transactions')
        if (response.data.success) {
          setTransactions(response.data.data)
        }
      } catch (error) {
        console.error("Failed to load transactions:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-primary-600">Loading transactions...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-primary-900">Transaction Statement</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Ref / Receipt</th>
                    <th className="px-6 py-3">Purpose</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: any) => (
                    <tr key={tx.id} className="bg-white border-b">
                      <td className="px-6 py-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs">{tx.transactionRef}</div>
                        {tx.receipts && tx.receipts.length > 0 && (
                          <div className="font-mono text-xs text-gray-500 mt-1">{tx.receipts[0].receiptNumber}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">{tx.purpose}</td>
                      <td className="px-6 py-4 font-bold text-primary-900">₹{tx.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          tx.status === 'SUCCESSFUL' ? 'bg-green-100 text-green-800' :
                          tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {tx.status === 'SUCCESSFUL' && tx.receipts && tx.receipts.length > 0 && (
                          <a href={`/receipt/${tx.receipts[0].receiptNumber}`} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-1">
                            <Download className="w-4 h-4" /> Receipt
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No transactions found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

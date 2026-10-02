import React, { useState } from "react"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Heart } from "lucide-react"
import { useTranslation } from "react-i18next"
import { api } from "../../lib/api"
import { DonationReceipt } from "../../components/receipt/DonationReceipt"

export function Donate() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number | ''>('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    pan: ''
  })
  const [loading, setLoading] = useState(false)
  const [successReceipt, setSuccessReceipt] = useState<string | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDonate = async () => {
    if (!amount || amount <= 0) {
      setError(t('donate.errors.amountRequired', 'Please select or enter an amount'))
      return
    }
    if (!formData.firstName || !formData.mobile) {
      setError(t('donate.errors.nameRequired', 'Please enter your name') + ' & ' + t('donate.errors.mobileRequired', 'Please enter your mobile'))
      return
    }
    setError(null)
    setLoading(true)
    try {
      // 1. Create Intent
      const intentRes = await api.post('/donations/intent', {
        amount: Number(amount),
        purpose: 'General Fund',
        donorName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        mobile: formData.mobile,
        pan: formData.pan
      })

      const { transactionRef, gatewayOrder } = intentRes.data.data

      // 2. Verify Payment (Mocking the gateway completion for now)
      const verifyRes = await api.post('/donations/verify', {
        transactionRef,
        gatewayPaymentId: gatewayOrder?.id || 'mock_payment_id',
        gatewaySignature: 'dummy_signature'
      })

      setSuccessReceipt(verifyRes.data.data.receiptNumber)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error?.message || t('common.error', 'Something went wrong. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  if (successReceipt) {
    const donorFullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Generous Donor'
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        {showReceiptModal ? (
          <div className="w-full flex flex-col items-center">
            <DonationReceipt
              receiptNumber={successReceipt}
              donorName={donorFullName}
              donorAddress="Door No. 12-34, Housing Board Colony\nSiddipet, Telangana - 502103"
              donorPhone={formData.mobile || '+91 98765 43210'}
              donorPan={formData.pan || ''}
              date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              paymentMethod="UPI / Online Transfer"
              transactionId={`UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`}
              items={[
                {
                  description: 'Amarnath Yatra Annadanam Seva Contribution',
                  subtitle: '(Mahaprasadam)',
                  qty: '1',
                  rate: Number(amount) || 5000,
                  amount: Number(amount) || 5000,
                },
              ]}
              isModal={true}
              onClose={() => setShowReceiptModal(false)}
            />
          </div>
        ) : (
          <Card className="w-full max-w-xl text-center py-12">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-primary-900 mb-4">{t('donate.successTitle', 'Donation Confirmed! 🙏')}</CardTitle>
            <CardDescription className="text-lg">
              {t('donate.successMsg', { amount, receipt: successReceipt, defaultValue: `Thank you for your generous contribution of ₹${amount}. Your receipt number is ${successReceipt}.` })}
            </CardDescription>
            <div className="mt-8 flex justify-center flex-wrap gap-4">
              <Button 
                onClick={() => setShowReceiptModal(true)} 
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold"
              >
                📜 View &amp; Print Official Receipt
              </Button>
              <Button 
                onClick={() => { setSuccessReceipt(null); setAmount(''); setFormData({ firstName: '', lastName: '', email: '', mobile: '', pan: '' }) }} 
                className="bg-saffron-500 hover:bg-saffron-400 text-white"
              >
                Donate Again
              </Button>
            </div>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-saffron-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-saffron-500" />
          </div>
          <CardTitle className="text-3xl text-primary-900">{t('donate.title', 'Make a Donation')}</CardTitle>
          <CardDescription>
            {t('donate.subtitle', 'Your contribution helps us serve meals to the pilgrims of Lord Amarnath Ji.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded text-sm font-medium">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary-900">{t('donate.amountLabel', 'Select Amount')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1100, 2100, 5001].map((amt) => (
                <Button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  variant="outline"
                  className={amount === amt ? "border-saffron-500 text-saffron-600 bg-saffron-50" : "border-sand-300"}
                >
                  {t('common.currency', '₹')}{amt}
                </Button>
              ))}
              <Input
                type="number"
                placeholder={t('donate.customAmount', 'Other')}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || '')}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-sand-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-900">{t('donate.fullNameLabel', 'First Name')}</label>
                <Input name="firstName" placeholder="Ram" value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-900">&nbsp;</label>
                <Input name="lastName" placeholder="Kumar" value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-900">{t('donate.emailLabel', 'Email Address')}</label>
              <Input name="email" type="email" placeholder="ram@example.com" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-900">{t('donate.mobileLabel', 'Mobile Number')}</label>
              <Input name="mobile" type="tel" placeholder="+91" value={formData.mobile} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-900">{t('donate.panLabel', 'PAN Number (For Tax Receipt)')}</label>
              <Input name="pan" placeholder={t('donate.panPlaceholder', 'ABCDE1234F')} value={formData.pan} onChange={handleInputChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-saffron-500 hover:bg-saffron-400 text-white h-12 text-lg"
            onClick={handleDonate}
            disabled={loading}
          >
            {loading ? t('common.loading', 'Loading...') : amount ? t('donate.payNow', { amount, defaultValue: `Pay ₹${amount}` }) : t('donate.continueBtn', 'Continue')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

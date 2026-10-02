import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { MapPin, Phone, Mail, Clock, HelpCircle, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react'

const FAQS = [
  {
    question: 'How do I renew my membership?',
    answer: 'Life memberships do not require renewal. If you hold an annual membership, you will receive a notification 30 days before expiry with a link to renew online via the Payments section.'
  },
  {
    question: 'Can I change my registered mobile number?',
    answer: 'Yes, you can initiate a mobile number change request from the "Change Mobile Number" section. It requires OTP verification and admin approval.'
  },
  {
    question: 'How can I volunteer for upcoming events?',
    answer: 'Navigate to the "Volunteer" section in your portal menu, select an upcoming event, and submit your skills. Our team will assign you based on requirements.'
  },
  {
    question: 'How do I download my 80G tax exemption receipt?',
    answer: 'All your donation receipts are available in the "Payments & Receipts" section. Click on any successful transaction to view and download the official PDF receipt.'
  }
]

export function HelpContact() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [formState, setFormState] = useState({ subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
      setFormState({ subject: '', message: '' })
      setTimeout(() => setShowSuccess(false), 5000)
    }, 1500)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-serif font-bold text-primary-900">Help & Support</h2>
        <p className="text-sm text-gray-500">Get in touch with the Samithi administration or find answers to common questions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-primary-900 to-primary-950 text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-saffron-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            
            <CardContent className="pt-6 relative z-10 space-y-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-saffron-400 mb-4">Contact Office</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start text-sm">
                    <MapPin className="w-5 h-5 text-saffron-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sand-100">
                      Amarnath Annadana Seva Samithi<br />
                      #12-34, Temple Road,<br />
                      Srisailam, Andhra Pradesh - 518101
                    </p>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Phone className="w-5 h-5 text-saffron-500 mr-3 flex-shrink-0" />
                    <p className="text-sand-100">+91 98765 43210</p>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Mail className="w-5 h-5 text-saffron-500 mr-3 flex-shrink-0" />
                    <p className="text-sand-100">support@amarnathsamithi.org</p>
                  </div>

                  <div className="flex items-start text-sm">
                    <Clock className="w-5 h-5 text-saffron-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sand-100">
                      <p><strong>Office Hours:</strong></p>
                      <p>Mon - Sat: 9:00 AM to 6:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Form and FAQs */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="border-b border-sand-100 bg-sand-50 pb-4">
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="w-5 h-5 mr-2 text-saffron-600" /> Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {showSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg flex flex-col items-center justify-center text-center">
                  <h4 className="font-bold text-lg mb-2">Message Sent!</h4>
                  <p className="text-sm">Thank you for reaching out. Our support team will get back to you shortly.</p>
                  <Button onClick={() => setShowSuccess(false)} variant="outline" className="mt-4">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select 
                      required
                      value={formState.subject}
                      onChange={e => setFormState({...formState, subject: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm border py-2 px-3 bg-white"
                    >
                      <option value="">Select a topic...</option>
                      <option value="Membership Query">Membership Query</option>
                      <option value="Payment Issue">Payment Issue</option>
                      <option value="Event Inquiry">Event Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={formState.message}
                      onChange={e => setFormState({...formState, message: e.target.value})}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-saffron-500 focus:ring-saffron-500 sm:text-sm border py-2 px-3"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSubmitting} className="bg-primary-900 hover:bg-primary-800 text-white flex items-center">
                      <Send className="w-4 h-4 mr-2" /> {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-sand-100 bg-sand-50 pb-4">
              <CardTitle className="flex items-center text-lg">
                <HelpCircle className="w-5 h-5 mr-2 text-saffron-600" /> Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 p-0">
              <div className="divide-y divide-sand-100">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border-b border-sand-100 last:border-0">
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none hover:bg-sand-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {openFaq === idx ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === idx && (
                      <div className="px-6 pb-4 pt-0">
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

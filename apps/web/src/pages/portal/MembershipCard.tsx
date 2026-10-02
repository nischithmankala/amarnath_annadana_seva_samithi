import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card'
import { api } from '../../lib/api'
import { QrCode, Download, ShieldAlert } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { DigitalMemberCard } from '../../components/portal/DigitalMemberCard'
import * as htmlToImage from 'html-to-image'
import jsPDF from 'jspdf'

export function MembershipCard() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/member/profile')
        if (response.data.success) {
          setProfile(response.data.data)
        }
      } catch (error) {
        console.error("Failed to load profile:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleDownloadPdf = async () => {
    if (!cardRef.current || downloading) return
    
    setDownloading(true)
    try {
      const dataUrl = await htmlToImage.toJpeg(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: '#ffffff'
      })
      
      const width = cardRef.current.offsetWidth
      const height = cardRef.current.offsetHeight
      
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [width, height]
      })
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height)
      pdf.save(`Amarnath-Member-Card-${profile.memberId || 'ID'}.pdf`)
    } catch (err) {
      console.error('Failed to generate PDF:', err)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading card...</div>
  if (!profile) return <div className="p-8 text-center text-red-600">Failed to load membership card.</div>

  const isRevoked = profile.status === 'REVOKED' || profile.status === 'SUSPENDED'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-primary-900">Membership Card</h2>
        <p className="text-sm text-gray-500">Your digital identification for all Samithi services</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Digital Card Preview */}
        <div className="w-full lg:w-2/3">
          <div ref={cardRef} className="rounded-2xl shadow-xl overflow-hidden">
            <DigitalMemberCard profile={profile} isRevoked={isRevoked} />
          </div>
        </div>

        {/* Card Details & Actions */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between items-center border-b border-sand-100 pb-2">
                  <p className="text-gray-500">Card Status</p>
                  <p className={`font-bold ${isRevoked ? 'text-red-600' : 'text-green-600'}`}>
                    {profile.status}
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-sand-100 pb-2">
                  <p className="text-gray-500">Issued Date</p>
                  <p className="font-medium text-primary-900">
                    {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'Pending'}
                  </p>
                </div>
                <div className="flex justify-between items-center border-b border-sand-100 pb-2">
                  <p className="text-gray-500">Card Version</p>
                  <p className="font-medium text-primary-900">v2.0.1</p>
                </div>
                <div className="flex justify-between items-center border-b border-sand-100 pb-2">
                  <p className="text-gray-500">Verification</p>
                  <p className="font-medium text-primary-900 flex items-center">
                    <ShieldAlert className="w-4 h-4 text-green-500 mr-1" /> Verified
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex flex-row items-center p-3 bg-white border border-sand-200 rounded-lg shadow-inner gap-4">
                  <QrCode className="w-16 h-16 text-primary-900 flex-shrink-0" />
                  <p className="text-xs text-gray-500 text-left">
                    Scan at events to securely verify identity.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleDownloadPdf}
                className="w-full flex items-center justify-center bg-sand-100 hover:bg-sand-200 text-primary-800" 
                disabled={isRevoked || downloading}
              >
                <Download className="w-4 h-4 mr-2" /> {downloading ? 'Generating PDF...' : 'Download PDF'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}


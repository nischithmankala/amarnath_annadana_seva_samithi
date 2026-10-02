import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { api } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

export function MyProfile() {
  const user = useAuthStore(state => state.user)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/member/dashboard') // For now, reusing dashboard API to get member data
        if (response.data.success) {
          setProfile(response.data.data.member)
        }
      } catch (error) {
        console.error("Failed to load profile:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-primary-600">Loading profile...</div>
  }

  if (!profile) {
    return <div className="p-8 text-center text-red-600">Failed to load profile data.</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary-900">My Profile</h2>
          <p className="text-sm text-gray-500">Manage your personal and membership information</p>
        </div>
        <button className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white rounded-md text-sm font-medium transition-colors">
          Request Profile Update
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-sand-200 flex items-center justify-center text-2xl font-bold text-primary-700">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-900">{profile.name}</h3>
                <p className="text-sm text-gray-500">{profile.category || 'Life Member'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-3 text-sm">
                <span className="text-gray-500 font-medium">Email</span>
                <span className="col-span-2 text-primary-900">{profile.email || 'Not provided'}</span>
              </div>
              <div className="grid grid-cols-3 text-sm border-t border-sand-100 pt-2">
                <span className="text-gray-500 font-medium">Mobile</span>
                <div className="col-span-2">
                  <span className="text-primary-900">{user?.phone}</span>
                  <p className="text-xs text-saffron-600 mt-1 flex items-start">
                    <AlertCircle className="w-3 h-3 mr-1 mt-0.5" />
                    To change your mobile number, use "Change Mobile Number" in the menu.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 text-sm border-t border-sand-100 pt-2">
                <span className="text-gray-500 font-medium">Date of Birth</span>
                <span className="col-span-2 text-primary-900">
                  {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </span>
              </div>
              <div className="grid grid-cols-3 text-sm border-t border-sand-100 pt-2">
                <span className="text-gray-500 font-medium">Date of Marriage</span>
                <span className="col-span-2 text-primary-900">
                  {profile.dateOfMarriage ? new Date(profile.dateOfMarriage).toLocaleDateString() : 'Not provided'}
                </span>
              </div>
              <div className="grid grid-cols-3 text-sm border-t border-sand-100 pt-2">
                <span className="text-gray-500 font-medium">Occupation</span>
                <span className="col-span-2 text-primary-900">{profile.occupation || 'Not provided'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Membership Information */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-sand-100 pb-2">
                <span className="text-gray-500 font-medium">Member ID</span>
                <span className="font-bold text-primary-900">{profile.memberId || 'Pending'}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-sand-100 pb-2">
                <span className="text-gray-500 font-medium">Status</span>
                <span className={`flex items-center font-medium ${profile.status === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {profile.status === 'APPROVED' ? <CheckCircle className="w-4 h-4 mr-1" /> : <Clock className="w-4 h-4 mr-1" />}
                  {profile.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-sand-100 pb-2">
                <span className="text-gray-500 font-medium">Joining Date</span>
                <span className="text-primary-900">
                  {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-sand-100 pb-2">
                <span className="text-gray-500 font-medium">Validity Period</span>
                <span className="text-primary-900">Lifetime</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Membership Fee</span>
                <span className="font-medium text-primary-900">₹{profile.membershipFee || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Address Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <p className="text-gray-500 font-medium mb-1">Residential Address</p>
                <p className="text-primary-900 whitespace-pre-wrap">{profile.address || 'No address provided'}</p>
                {profile.city && <p className="text-primary-900 mt-1">{profile.city}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

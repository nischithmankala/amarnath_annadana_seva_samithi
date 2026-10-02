import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { api } from '../../lib/api'
import { PlusCircle, Edit2, Trash2, Users } from 'lucide-react'

export function FamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        const response = await api.get('/member/profile') // Reusing profile which includes family
        if (response.data.success) {
          setFamilyMembers(response.data.data.familyMembers || [])
        }
      } catch (error) {
        console.error("Failed to load family members:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFamily()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading family members...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary-900">Family Members</h2>
          <p className="text-sm text-gray-500">Manage details of your registered family members</p>
        </div>
        <Button className="bg-saffron-500 hover:bg-saffron-600 text-white flex items-center">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>

      {familyMembers.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary-900">No family members registered</h3>
            <p className="text-sm text-gray-500 mt-2">Add your family members to keep your records updated.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familyMembers.map((member) => (
            <Card key={member.id} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-100 text-green-700 px-2 py-1 text-xs font-bold rounded-bl-lg">
                APPROVED
              </div>
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-sand-200 flex items-center justify-center text-2xl font-bold text-primary-700">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-primary-900">{member.name}</h3>
                    <p className="text-sm font-medium text-saffron-600">{member.relationship}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm mt-4 pt-4 border-t border-sand-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date of Birth:</span>
                    <span className="font-medium text-primary-900">
                      {member.dob ? new Date(member.dob).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gender:</span>
                    <span className="font-medium text-primary-900">{member.gender || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-sand-50 py-3 flex justify-between border-t border-sand-100">
                <button className="text-sm flex items-center text-primary-600 hover:text-primary-800">
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </button>
                <button className="text-sm flex items-center text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-1" /> Remove
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

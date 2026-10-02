import { useState } from 'react'
import { Card, CardContent } from '../../components/ui/Card'
import { Calendar, MapPin, Users, Ticket, AlertCircle } from 'lucide-react'

// Hardcoded for UI demo as requested by lack of backend, but typed to simulate API response
interface SamithiEvent {
  id: string
  title: string
  date: string
  location: string
  category: string
  description: string
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED'
  registrations: number
}

const DUMMY_EVENTS: SamithiEvent[] = [
  {
    id: 'E-101',
    title: 'Maha Shivaratri Annadana Camp',
    date: '2026-03-08T10:00:00Z',
    location: 'Srisailam Temple Road',
    category: 'Annadanam',
    description: 'Annual large-scale food distribution camp serving thousands of devotees during Maha Shivaratri.',
    status: 'UPCOMING',
    registrations: 450
  },
  {
    id: 'E-102',
    title: 'Monthly Medical Camp',
    date: '2026-10-15T09:00:00Z',
    location: 'Samithi Head Office',
    category: 'Medical',
    description: 'Free medical checkup and medicine distribution for underprivileged families.',
    status: 'UPCOMING',
    registrations: 120
  },
  {
    id: 'E-100',
    title: 'Amarnath Yatra Seva 2025',
    date: '2025-07-15T00:00:00Z',
    location: 'Baltal Base Camp',
    category: 'Yatra Seva',
    description: 'Continuous 45-day langar (free kitchen) setup at Baltal base camp serving pilgrims heading to the holy cave.',
    status: 'COMPLETED',
    registrations: 2500
  }
]

export function Events() {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'LIVE' | 'COMPLETED'>('UPCOMING')

  const filteredEvents = DUMMY_EVENTS.filter(e => e.status === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary-900">Events</h2>
          <p className="text-sm text-gray-500">Discover and register for upcoming Samithi events</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-1 inline-flex shadow-sm border border-sand-200">
        <button 
          onClick={() => setActiveTab('UPCOMING')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'UPCOMING' ? 'bg-saffron-500 text-white shadow' : 'text-gray-600 hover:bg-sand-50'}`}
        >
          Upcoming Events
        </button>
        <button 
          onClick={() => setActiveTab('LIVE')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'LIVE' ? 'bg-saffron-500 text-white shadow' : 'text-gray-600 hover:bg-sand-50'}`}
        >
          Live Events
        </button>
        <button 
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'COMPLETED' ? 'bg-saffron-500 text-white shadow' : 'text-gray-600 hover:bg-sand-50'}`}
        >
          Completed Events
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No {activeTab.toLowerCase()} events</h3>
          <p className="text-gray-500 text-sm mt-1">Check back later for updates on our calendar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Card key={event.id} className="overflow-hidden flex flex-col">
              <div className="h-32 bg-gradient-to-br from-primary-800 to-primary-950 relative">
                {/* Fallback pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('/card-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded border border-white/30 text-white text-xs font-bold uppercase tracking-wider">
                  {event.category}
                </div>
              </div>
              
              <CardContent className="flex-1 flex flex-col p-6">
                <h3 className="text-lg font-bold text-primary-900 leading-tight mb-2">{event.title}</h3>
                
                <div className="space-y-2 mt-4 flex-1">
                  <div className="flex items-start text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 mt-0.5 text-saffron-600 flex-shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-saffron-600 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 mt-0.5 text-saffron-600 flex-shrink-0" />
                    <span>{event.registrations}+ attending</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-4 line-clamp-2 border-t border-sand-100 pt-4">
                  {event.description}
                </p>
                
                {activeTab === 'UPCOMING' && (
                  <button className="mt-6 w-full flex items-center justify-center py-2 px-4 border border-saffron-500 text-saffron-700 rounded-md hover:bg-saffron-50 transition-colors text-sm font-bold">
                    <Ticket className="w-4 h-4 mr-2" /> Register Now
                  </button>
                )}
                {activeTab === 'COMPLETED' && (
                  <div className="mt-6 flex items-center justify-center py-2 px-4 bg-sand-100 text-gray-600 rounded-md text-sm font-bold">
                    Event Ended
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

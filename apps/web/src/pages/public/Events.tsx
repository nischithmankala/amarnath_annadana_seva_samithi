import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import { Calendar, MapPin } from "lucide-react"

export function Events() {
  const events = [
    {
      id: 1,
      title: "Amarnath Yatra Bhandara 2024",
      date: "June 29 - August 19, 2024",
      location: "Baltal Base Camp, Sonamarg",
      description: "Our annual grand Bhandara serving free breakfast, lunch, and dinner to all pilgrims undertaking the holy Amarnath Yatra from the Baltal route.",
      status: "Upcoming"
    },
    {
      id: 2,
      title: "Volunteer Training & Orientation",
      date: "June 15, 2024",
      location: "Samithi Head Office",
      description: "Mandatory training session for all registered volunteers focusing on camp hygiene, crowd management, and spiritual discipline.",
      status: "Registration Open"
    },
    {
      id: 3,
      title: "Maha Shivaratri Special Seva",
      date: "March 8, 2024",
      location: "Local Shiva Temples",
      description: "Special Annadana organized at various local Shiva temples on the auspicious occasion of Maha Shivaratri.",
      status: "Completed"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 mb-4">Events & Activities</h1>
        <p className="text-lg text-primary-700">Join us in our ongoing and upcoming sevas.</p>
      </div>

      <div className="space-y-6">
        {events.map(event => (
          <Card key={event.id} className="flex flex-col md:flex-row overflow-hidden border border-sand-200">
            <div className="w-full md:w-1/3 bg-sand-100 flex flex-col justify-center items-center p-6 border-b md:border-b-0 md:border-r border-sand-200">
              <Calendar className="w-10 h-10 text-saffron-500 mb-2" />
              <div className="text-center font-medium text-primary-900">{event.date}</div>
              <div className="mt-2 px-3 py-1 bg-saffron-100 text-saffron-600 text-xs rounded-full font-semibold uppercase tracking-wide">
                {event.status}
              </div>
            </div>
            <div className="w-full md:w-2/3 p-6 flex flex-col justify-center">
              <h3 className="text-2xl font-serif font-bold text-primary-900 mb-2">{event.title}</h3>
              <div className="flex items-center text-sm text-primary-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {event.location}
              </div>
              <p className="text-primary-700 leading-relaxed">
                {event.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

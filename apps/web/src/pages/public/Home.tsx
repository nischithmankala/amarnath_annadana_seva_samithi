import React from "react"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import { ArrowRight, Heart } from "lucide-react"

export function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 md:pt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 bg-sand-200/50 text-saffron-500 px-3 py-1 rounded-full text-sm font-medium">
            <Heart className="w-4 h-4 fill-current" />
            <span>Serve the Pilgrims</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary-900 leading-tight">
            Food Offered with devotion, to every pilgrim who comes.
          </h2>
          <p className="text-lg text-primary-700 max-w-lg leading-relaxed">
            A charitable organization dedicated to serving the pilgrims of Lord Amarnath Ji. Join hands in our mission of Annadana Seva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="bg-primary-900 hover:bg-primary-800 text-white font-medium px-8 h-12 text-base">
              Donate Now
            </Button>
            <Button size="lg" variant="outline" className="border-primary-900 text-primary-900 font-medium px-8 h-12 text-base">
              Become a Member
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-sand-200">
            <div>
              <p className="text-3xl font-serif font-bold text-saffron-500">10M+</p>
              <p className="text-sm text-primary-700 font-medium">Meals Served</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-saffron-500">15+</p>
              <p className="text-sm text-primary-700 font-medium">Years of Seva</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-saffron-500">500+</p>
              <p className="text-sm text-primary-700 font-medium">Active Volunteers</p>
            </div>
          </div>
        </div>
        <div className="bg-sand-200 rounded-2xl h-[500px] w-full relative overflow-hidden shadow-xl">
          {/* Placeholder for Hero Image */}
          <div className="absolute inset-0 flex items-center justify-center text-primary-900/30 font-serif text-2xl">
            Image of Annadana Seva
          </div>
        </div>
      </section>

      {/* Sponsorship Banner */}
      <section className="bg-primary-900 text-sand-50 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-saffron-400">
              Sponsor a day of meals at the camp
            </h2>
            <p className="text-sand-100/90 leading-relaxed max-w-md">
              Your contribution ensures that no pilgrim goes hungry. Sponsor an entire day's meal or contribute any amount.
            </p>
            <div className="flex gap-4">
              <Button className="bg-saffron-500 hover:bg-saffron-400 text-white">
                Sponsor a day - ₹11,000
              </Button>
              <Button variant="outline" className="border-sand-50 text-sand-50 hover:bg-sand-50 hover:text-primary-900">
                Custom Amount
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-primary-800 p-4 rounded-lg flex justify-between items-center border border-primary-700">
              <span className="font-medium text-sand-100">Morning Breakfast</span>
              <span className="text-saffron-400 font-bold">₹5,001</span>
            </div>
            <div className="bg-primary-800 p-4 rounded-lg flex justify-between items-center border border-primary-700">
              <span className="font-medium text-sand-100">Afternoon Lunch (Bhandara)</span>
              <span className="text-saffron-400 font-bold">₹11,001</span>
            </div>
            <div className="bg-primary-800 p-4 rounded-lg flex justify-between items-center border border-primary-700">
              <span className="font-medium text-sand-100">Evening Dinner</span>
              <span className="text-saffron-400 font-bold">₹5,001</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-primary-900 mb-2">Recent & Upcoming Events</h2>
            <p className="text-primary-700">Join us in our upcoming sevas and activities.</p>
          </div>
          <Button variant="link" className="text-saffron-500 group">
            View All <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <div className="h-48 bg-sand-200 rounded-t-lg flex items-center justify-center text-primary-900/30 font-serif">
                Event Photo {i}
              </div>
              <CardHeader>
                <div className="text-xs font-semibold text-saffron-500 uppercase tracking-wider mb-2">Upcoming</div>
                <CardTitle className="text-xl">Amarnath Yatra Camp {2024 + i}</CardTitle>
                <CardDescription>Baltal Base Camp, Sonamarg</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary-700 line-clamp-2">
                  Preparations for the upcoming Yatra camp are in full swing. We are organizing volunteer registration.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Office Bearers */}
      <section className="bg-sand-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">Office Bearers</h2>
          <p className="text-primary-700 mb-12 max-w-2xl mx-auto">
            The dedicated team guiding the Amarnath Annadana Seva Samithi's mission.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {['President', 'Vice President', 'Secretary', 'Treasurer', 'Joint Secretary'].map((title, i) => (
              <div key={i} className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-sand-200 border-4 border-white shadow-sm flex items-center justify-center text-primary-900/30 text-sm">
                  Photo
                </div>
                <div>
                  <h4 className="font-serif font-bold text-primary-900 text-lg">Name Surname</h4>
                  <p className="text-sm text-saffron-500 font-medium">{title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

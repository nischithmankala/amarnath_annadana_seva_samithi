import React from "react"
import { Outlet, Link } from "react-router-dom"
import { Button } from "../ui/Button"

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-sand-50 font-sans text-primary-900">
      <header className="bg-surface shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-saffron-500 flex items-center justify-center text-white font-bold font-serif">
              A
            </div>
            <div>
              <h1 className="font-serif text-lg md:text-xl font-semibold leading-tight text-primary-900">
                Amarnath Annadana
              </h1>
              <p className="text-xs text-primary-700 tracking-wider">SEVA SAMITHI</p>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-sm font-medium text-primary-900 hover:text-saffron-500">Home</Link>
            <Link to="/about" className="text-sm font-medium text-primary-900 hover:text-saffron-500">About</Link>
            <Link to="/events" className="text-sm font-medium text-primary-900 hover:text-saffron-500">Events</Link>
            <Link to="/gallery" className="text-sm font-medium text-primary-900 hover:text-saffron-500">Gallery</Link>
            <Link to="/login">
              <Button variant="outline" className="ml-4 border-saffron-500 text-saffron-500 hover:bg-saffron-500 hover:text-white">
                Member Login
              </Button>
            </Link>
            <Button className="bg-saffron-500 hover:bg-saffron-400 text-white">Donate</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-primary-900 text-sand-50 py-12 border-t-4 border-saffron-500">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4 text-saffron-400">About Samithi</h3>
            <p className="text-sm text-sand-100/80 leading-relaxed">
              Dedicated to serving pilgrims of Lord Amarnath Ji with warm food, shelter, and medical assistance.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4 text-saffron-400">Quick Links</h3>
            <ul className="space-y-2 text-sm text-sand-100/80">
              <li><Link to="/donate" className="hover:text-white transition-colors">Donate Now</Link></li>
              <li><Link to="/join" className="hover:text-white transition-colors">Join as Member</Link></li>
              <li><Link to="/volunteer" className="hover:text-white transition-colors">Volunteer</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-xl font-semibold mb-4 text-saffron-400">Contact</h3>
            <p className="text-sm text-sand-100/80 leading-relaxed">
              Email: info@amarnathseva.org<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-primary-700 text-center text-sm text-primary-500">
          &copy; {new Date().getFullYear()} Amarnath Annadana Seva Samithi. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

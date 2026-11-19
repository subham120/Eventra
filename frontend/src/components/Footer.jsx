import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-bold text-gray-900 group">
              <img
                src={logo}
                alt="Eventra Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
              />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent font-extrabold text-xl tracking-tight">
                Eventra
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Full-stack MERN ecosystem built for collegiate organizations, student hackathons, tech workshops, and community events.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-indigo-600 transition-colors">Explore Events</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 transition-colors">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-600 transition-colors">Register</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Top Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link to="/events?category=Technology" className="hover:text-indigo-600 transition-colors">Technology</Link>
              </li>
              <li>
                <Link to="/events?category=Music" className="hover:text-indigo-600 transition-colors">Music</Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="hover:text-indigo-600 transition-colors">Sports</Link>
              </li>
              <li>
                <Link to="/events?category=Art" className="hover:text-indigo-600 transition-colors">Art & Design</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Project Stack
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              MERN Stack: React, Node.js, Express & MongoDB.
            </p>
            <p className="text-sm text-gray-500">
              Contact: <span className="text-indigo-600 font-medium">support@eventra.campus.edu</span>
            </p>
          </div>

        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Eventra. Built with React, Node.js, Express & MongoDB.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

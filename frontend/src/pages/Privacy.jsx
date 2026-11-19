import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-xs text-gray-400 mt-0.5">Last updated: October 2026</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">About This Application</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Eventra is an academic event management and ticket booking application developed for college campus use. This policy describes how information is collected, stored, and used within the system.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Information We Collect</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 leading-relaxed">
            <li>
              <strong className="text-gray-800">Account Details:</strong> Name, email address, password (stored as a bcrypt hash), and user role (attendee or organizer).
            </li>
            <li>
              <strong className="text-gray-800">Event Details:</strong> Information submitted by organizers including title, description, date, time, location, category, price, and ticket availability.
            </li>
            <li>
              <strong className="text-gray-800">Booking Records:</strong> Records of tickets reserved by logged-in users, including quantity, total amount, and booking status.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">How Information is Stored</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Application data is stored in a MongoDB database. For authentication, a JSON Web Token (JWT) is generated upon login and kept in browser local storage to maintain your active session. Passwords are never stored in plain text.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">How Information is Used</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Information is strictly used to operate the application: authenticating accounts, displaying user bookings, managing ticket inventory, and enabling organizers to manage their event listings. We do not sell or share data with external marketing services.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Contact</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            For questions about this project, please contact: <span className="text-indigo-600 font-medium">support@eventra.campus.edu</span>.
          </p>
        </section>
      </div>
    </div>
  )
}

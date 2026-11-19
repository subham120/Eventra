import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

export default function Terms() {
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
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Terms and Conditions</h1>
            <p className="text-xs text-gray-400 mt-0.5">Last updated: October 2026</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Project Overview</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Welcome to Eventra. This web platform is an academic college project created for event management and ticket reservation on campus. By using this service, you agree to these terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">User Accounts</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Users may register as standard attendees or as organizers. You are responsible for keeping your login credentials secure. Accounts must provide valid email addresses during registration.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Event Postings and Ticket Reservations</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1.5 leading-relaxed">
            <li>Organizers must provide accurate information regarding event schedules, venue locations, and ticket availability.</li>
            <li>Ticket reservations are subject to availability and decremented atomically in the database to prevent overselling.</li>
            <li>Attendees may cancel their reservations from their bookings dashboard, which returns tickets to the event pool.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Simulated Transactions</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            All prices shown across Eventra are for academic demonstration and simulation purposes. The application does not connect to real financial payment processors or deduct real funds.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Acceptable Use</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Users agree not to tamper with application data, attempt unauthorized access to other accounts, or create fraudulent events.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Contact</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            If you have questions regarding these terms, reach out to: <span className="text-indigo-600 font-medium">support@eventra.campus.edu</span>.
          </p>
        </section>
      </div>
    </div>
  )
}

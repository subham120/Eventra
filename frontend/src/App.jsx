import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// Public & Main Pages
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import NotFound from './pages/NotFound'

// Organizer Pages
import Dashboard from './pages/organizer/Dashboard'
import OrganizerEvents from './pages/organizer/OrganizerEvents'
import CreateEvent from './pages/organizer/CreateEvent'
import EditEvent from './pages/organizer/EditEvent'

import ProtectedRoute from './components/ProtectedRoute'

// App component: Sets up application routing structure with Layout wrapper
export default function App() {
  return (
    <Routes>
      {/* Main Layout Route that provides Navbar and Footer */}
      <Route path="/" element={<Layout />}>
        {/* Core Pages */}
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />

        {/* Authentication Pages */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Booking Pages - Protected: Requires logged-in attendee */}
        <Route
          path="booking/:eventId"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Organizer Portal Pages */}
        <Route path="organizer" element={<Dashboard />} />
        <Route path="organizer/events" element={<OrganizerEvents />} />
        <Route path="organizer/events/create" element={<CreateEvent />} />
        <Route path="organizer/events/:id/edit" element={<EditEvent />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

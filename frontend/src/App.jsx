import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

import Dashboard from './pages/organizer/Dashboard'
import OrganizerEvents from './pages/organizer/OrganizerEvents'
import CreateEvent from './pages/organizer/CreateEvent'
import EditEvent from './pages/organizer/EditEvent'

import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register key="user" role="user" />} />
        <Route path="register/organizer" element={<Register key="organizer" role="organizer" />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />

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

        <Route
          path="organizer"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizer/events"
          element={
            <ProtectedRoute>
              <OrganizerEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizer/events/create"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizer/events/:id/edit"
          element={
            <ProtectedRoute>
              <EditEvent />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

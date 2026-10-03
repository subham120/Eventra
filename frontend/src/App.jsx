import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
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
        <Route path="register" element={<Register />} />

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

        <Route path="organizer" element={<Dashboard />} />
        <Route path="organizer/events" element={<OrganizerEvents />} />
        <Route path="organizer/events/create" element={<CreateEvent />} />
        <Route path="organizer/events/:id/edit" element={<EditEvent />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

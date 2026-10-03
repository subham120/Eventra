import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Ticket, Menu, X, User as UserIcon } from 'lucide-react'
import { getUser, logout } from '../services/auth'

export default function Navbar() {

  const user = getUser()
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const handleLogout = () => {
    closeMenu()
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-indigo-600 tracking-tight"
            onClick={closeMenu}
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Ticket className="w-5 h-5" />
            </div>
            <span>Eventra</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-sm font-semibold text-indigo-600"
                  : "text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive
                  ? "text-sm font-semibold text-indigo-600"
                  : "text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              }
            >
              Events
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/my-bookings"
                  className={({ isActive }) =>
                    isActive
                      ? "text-sm font-semibold text-indigo-600"
                      : "text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                  }
                >
                  My Bookings
                </NavLink>
                {user.role === 'organizer' && (
                  <NavLink
                    to="/organizer"
                    className={({ isActive }) =>
                      isActive
                        ? "text-sm font-semibold text-indigo-600"
                        : "text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                    }
                  >
                    Dashboard
                  </NavLink>
                )}
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-700">
                  <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{user.name}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-3">
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-base font-medium ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/events"
            onClick={closeMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-base font-medium ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            Events
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/my-bookings"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                My Bookings
              </NavLink>
              {user.role === 'organizer' && (
                <NavLink
                  to="/organizer"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-base font-medium ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}
            </>
          )}

          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 rounded-lg">
                  Signed in as <span className="text-gray-900 font-bold">{user.name}</span> ({user.role})
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full text-center py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full text-center py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

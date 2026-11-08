import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Leaf, LayoutDashboard, Tractor, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

const nav = [
  { to: '/app', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/farms', label: 'Farms', icon: Tractor },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-primary text-white' : 'text-muted hover:bg-beige hover:text-forest'
    }`

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-beige bg-cream px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="font-semibold text-forest">FarmHelper</span>
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-forest hover:bg-beige">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-beige bg-white transition lg:static lg:translate-x-0 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="hidden items-center gap-2 border-b border-beige px-5 py-4 lg:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-forest">FarmHelper</p>
                <p className="text-xs text-muted">Ethiopia</p>
              </div>
            </div>

            <nav className="flex-1 space-y-1 p-3">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-beige p-4">
              <p className="truncate text-sm font-medium text-forest">{user?.full_name}</p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-beige hover:text-forest"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {open && (
          <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  Users,
  ShieldAlert,
  UserCircle,
  ClipboardList,
  Clock,
  Settings,
  LogOut,
  ArrowLeft,
} from 'lucide-react'
import { LAB } from '@/data/lab'
import { BRAND } from '@/branding'
import { BrandMark, BrandPoweredBy } from '@/components/BrandMark'
import { getSessionUser, logoutSession } from '@/lib/auth'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/postos', label: 'Postos', icon: MapPin },
  { to: '/escalas', label: 'Escalas', icon: CalendarDays },
  { to: '/equipa', label: 'Equipa', icon: Users },
  { to: '/competencias', label: 'Competências', icon: ClipboardList },
  { to: '/ferias', label: 'Férias / HE', icon: Clock },
  { to: '/incompatibilidades', label: 'Incompatibilidades', icon: ShieldAlert },
  { to: '/portal', label: 'Portal', icon: UserCircle },
]

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const session = getSessionUser()
  const isPortal = location.pathname.startsWith('/portal')

  function logout() {
    logoutSession()
    navigate('/login', { replace: true })
  }

  if (isPortal) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <header className="sticky top-0 z-10 border-b border-brand-800/20 bg-brand-800 text-white">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold">{LAB.name}</div>
              <div className="text-xs text-brand-100/80">Portal do colaborador</div>
            </div>
            <NavLink
              to="/"
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Gestão
            </NavLink>
          </div>
        </header>
        <main className="mx-auto max-w-md px-4 py-5">
          <Outlet />
        </main>
        <footer className="mx-auto max-w-md px-4 pb-6">
          <BrandPoweredBy className="justify-center" />
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="flex w-full flex-col border-b border-brand-900/30 bg-brand-900 text-white print:hidden lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <div className="overflow-hidden rounded-xl border border-[#c9a227]/35 bg-white/10 p-0.5 shadow-sm">
            <BrandMark variant="mark" className="h-10 w-10 bg-transparent" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-wide">{LAB.name}</div>
            <div className="truncate text-[11px] text-brand-100/75">{BRAND.product}</div>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-2 py-3 lg:flex-1 lg:flex-col lg:overflow-y-auto">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-white font-medium text-brand-900'
                    : 'text-brand-50/90 hover:bg-white/10'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2 border-t border-white/10 p-3">
          <NavLink
            to="/definicoes"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                isActive ? 'bg-white/15 text-white' : 'text-brand-100/80 hover:bg-white/10'
              }`
            }
          >
            <Settings className="h-4 w-4" />
            Definições
          </NavLink>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-brand-100/70 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>

          <div className="rounded-xl border border-[#c9a227]/25 bg-white/5 px-2.5 py-2">
            <div className="mb-1.5 flex items-center gap-2">
              <BrandMark variant="mark" className="h-7 w-7 rounded-md bg-transparent" />
              <div className="min-w-0 leading-tight">
                <div className="truncate text-[10px] font-semibold text-[#e8d48b]">
                  {BRAND.product}
                </div>
                <div className="truncate text-[9px] text-white/55">{BRAND.company}</div>
              </div>
            </div>
            <BrandPoweredBy light className="text-[9px]" />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col print:block print:w-full">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur print:hidden">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {session?.name ?? LAB.scheduler}
            </div>
            <div className="text-xs text-slate-500">
              {session?.role === 'admin'
                ? 'Administração'
                : session?.role === 'demo'
                  ? 'Sessão de apresentação'
                  : 'Gestão de escalas'}
            </div>
          </div>
          <BrandMark variant="mark" className="h-8 w-8 rounded-lg border border-slate-200" />
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 print:max-w-none print:p-0">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200 bg-white px-4 py-3 print:hidden">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
            <BrandPoweredBy />
            <span className="text-[10px] text-slate-400">
              {BRAND.phone} · {BRAND.email}
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}

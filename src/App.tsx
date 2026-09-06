import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { RequireAuth } from '@/components/RequireAuth'
import { LabStoreProvider } from '@/store/LabStore'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import StationsPage from '@/pages/StationsPage'
import SchedulesPage from '@/pages/SchedulesPage'
import TeamPage from '@/pages/TeamPage'
import CompetencesPage from '@/pages/CompetencesPage'
import LeavePage from '@/pages/LeavePage'
import IncompatibilitiesPage from '@/pages/IncompatibilitiesPage'
import PortalPage from '@/pages/PortalPage'
import SettingsPage from '@/pages/SettingsPage'

export default function App() {
  return (
    <LabStoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="postos" element={<StationsPage />} />
              <Route path="escalas" element={<SchedulesPage />} />
              <Route path="equipa" element={<TeamPage />} />
              <Route path="competencias" element={<CompetencesPage />} />
              <Route path="ferias" element={<LeavePage />} />
              <Route path="incompatibilidades" element={<IncompatibilitiesPage />} />
              <Route path="portal" element={<PortalPage />} />
              <Route path="definicoes" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </LabStoreProvider>
  )
}

import { useViewer } from '@/entities/session'
import { AdminDashboard } from './AdminDashboard'
import { SpecialistDashboard } from './SpecialistDashboard'
import { UserDashboard } from './UserDashboard'

export function DashboardPage() {
  const viewer = useViewer()
  if (viewer.role === 'ADMIN') {
    return <AdminDashboard />
  }
  if (viewer.role === 'SPECIALIST') {
    return <SpecialistDashboard />
  }
  return <UserDashboard />
}

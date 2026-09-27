import { useViewer } from '@/entities/session'
import { AdminDashboard } from './AdminDashboard'
import { SpecialistDashboard } from './SpecialistDashboard'
import { UserDashboard } from './UserDashboard'

export function DashboardPage() {
  const viewer = useViewer()
  const firstName = viewer.name.split(' ')[0] ?? viewer.name
  if (viewer.role === 'ADMIN') {
    return <AdminDashboard name={firstName} />
  }
  if (viewer.role === 'SPECIALIST') {
    return <SpecialistDashboard name={firstName} />
  }
  return <UserDashboard name={firstName} />
}

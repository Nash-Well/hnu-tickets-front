import {
  IconCategory,
  IconChartBar,
  IconHelpCircle,
  IconLayoutDashboard,
  IconSquarePlus,
  IconTicket,
  IconUsers,
  type Icon,
} from '@tabler/icons-react'
import type { UserRole } from '@/entities/user'
import { paths } from '@/shared/routes'

export type NavigationItem = {
  label: string
  to: string
  icon: Icon
  roles: UserRole[]
  end?: boolean
  dividerBefore?: boolean
}

const navigationItems: NavigationItem[] = [
  { label: 'Головна', to: paths.dashboard, icon: IconLayoutDashboard, roles: ['USER', 'SPECIALIST', 'ADMIN'] },
  { label: 'Мої заявки', to: paths.tickets, icon: IconTicket, roles: ['USER'], end: true },
  { label: 'Мої задачі', to: paths.tickets, icon: IconTicket, roles: ['SPECIALIST'], end: true },
  { label: 'Усі заявки', to: paths.tickets, icon: IconTicket, roles: ['ADMIN'], end: true },
  { label: 'Нова заявка', to: paths.ticketCreate, icon: IconSquarePlus, roles: ['USER'] },
  { label: 'Аналітика', to: paths.analytics, icon: IconChartBar, roles: ['ADMIN'], dividerBefore: true },
  { label: 'Користувачі', to: paths.users, icon: IconUsers, roles: ['ADMIN'] },
  { label: 'Категорії', to: paths.categories, icon: IconCategory, roles: ['ADMIN'] },
  {
    label: 'Довідка',
    to: paths.help,
    icon: IconHelpCircle,
    roles: ['USER', 'SPECIALIST', 'ADMIN'],
    dividerBefore: true,
  },
]

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationItems.filter((item) => item.roles.includes(role))
}

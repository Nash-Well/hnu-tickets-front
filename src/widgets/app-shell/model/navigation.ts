import {
  IconCategory,
  IconChartBar,
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
}

export type NavigationSection = {
  title: string
  items: NavigationItem[]
}

export const navigationSections: NavigationSection[] = [
  {
    title: 'Робота',
    items: [
      { label: 'Головна', to: paths.dashboard, icon: IconLayoutDashboard, roles: ['USER', 'SPECIALIST', 'ADMIN'] },
      { label: 'Мої заявки', to: paths.tickets, icon: IconTicket, roles: ['USER'], end: true },
      { label: 'Мої задачі', to: paths.tickets, icon: IconTicket, roles: ['SPECIALIST'], end: true },
      { label: 'Усі заявки', to: paths.tickets, icon: IconTicket, roles: ['ADMIN'], end: true },
      { label: 'Нова заявка', to: paths.ticketCreate, icon: IconSquarePlus, roles: ['USER'] },
    ],
  },
  {
    title: 'Адміністрування',
    items: [
      { label: 'Аналітика', to: paths.analytics, icon: IconChartBar, roles: ['ADMIN'] },
      { label: 'Користувачі', to: paths.users, icon: IconUsers, roles: ['ADMIN'] },
      { label: 'Категорії', to: paths.categories, icon: IconCategory, roles: ['ADMIN'] },
    ],
  },
]

export function getNavigationForRole(role: UserRole): NavigationSection[] {
  return navigationSections
    .map((section) => ({ ...section, items: section.items.filter((item) => item.roles.includes(role)) }))
    .filter((section) => section.items.length > 0)
}

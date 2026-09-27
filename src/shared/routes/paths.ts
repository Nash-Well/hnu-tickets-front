export const paths = {
  root: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  tickets: '/tickets',
  ticketCreate: '/tickets/new',
  ticket: (id: string) => `/tickets/${id}`,
  ticketPattern: '/tickets/:ticketId',
  users: '/users',
  categories: '/categories',
  analytics: '/analytics',
  profile: '/profile',
} as const

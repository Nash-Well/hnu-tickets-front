import { createContext } from 'react'
import type { User } from '@/entities/user/@x/session'

export const ViewerContext = createContext<User | null>(null)

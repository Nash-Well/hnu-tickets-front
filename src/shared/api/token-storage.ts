const TOKEN_KEY = 'hnu-tickets.access-token'

type Listener = () => void

const listeners = new Set<Listener>()

function readPersistedToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function persistToken(token: string | null) {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token)
    } else {
      window.localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    return
  }
}

let currentToken = readPersistedToken()

function update(token: string | null) {
  currentToken = token
  persistToken(token)
  listeners.forEach((listener) => listener())
}

export const tokenStorage = {
  get: () => currentToken,
  set: (token: string) => update(token),
  clear: () => update(null),
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

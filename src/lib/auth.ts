export const AUTH_KEY = 'labamarante-auth'
export const USER_KEY = 'labamarante-user'
export const DEMO_PIN = '2026'

export type SessionUser = {
  id: string
  name: string
  role: 'gestao' | 'admin' | 'demo'
}

const USERS: Record<string, SessionUser> = {
  sandra: { id: 'sandra', name: 'Sandra Coelho', role: 'gestao' },
  joao: { id: 'joao', name: 'João Matias', role: 'admin' },
  demo: { id: 'demo', name: 'Apresentação', role: 'demo' },
}

export function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

export function getSessionUser(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function login(userId: string, pin: string): { ok: true } | { ok: false; error: string } {
  if (pin.trim() !== DEMO_PIN) {
    return { ok: false, error: 'PIN incorrecto.' }
  }
  const user = USERS[userId] ?? USERS.sandra
  sessionStorage.setItem(AUTH_KEY, '1')
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  return { ok: true }
}

export function logoutSession() {
  sessionStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(USER_KEY)
}

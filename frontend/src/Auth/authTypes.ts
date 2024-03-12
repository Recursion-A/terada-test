export interface AuthState {
  isAuthenticated: boolean
  token: string | null
}

export type AuthAction =
  | { type: 'LOGIN'; payload: { token: string } }
  | { type: 'LOGOUT' }

export interface AuthContextType {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}

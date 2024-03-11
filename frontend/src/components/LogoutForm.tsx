import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LogoutForm: React.FC = () => {
  const { dispatch } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/')
  }

  return (
    <div>
      <p>ログアウトしますか？</p>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  )
}

export default LogoutForm

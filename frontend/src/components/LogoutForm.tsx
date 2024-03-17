import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const formWrapStyle: React.CSSProperties = {
  padding: '16px 32px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}

const textStyle = {
  fontSize: '48px'
}

const buttonStyle: React.CSSProperties = {
  background: 'black',
  border: 'none',
  color: 'white',
  fontSize: '32px',
  cursor: 'pointer',
  height: '80px',
  width: '100%',
  marginTop: '40px'
}

const LogoutForm: React.FC = () => {
  const { dispatch } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    localStorage.removeItem("token")
    navigate('/')
  }

  return (
    <div style={formWrapStyle}>
      <p style={textStyle}>ログアウトしますか？</p>
      <button style={buttonStyle} onClick={handleLogout}>
        ログアウト
      </button>
    </div>
  )
}

export default LogoutForm

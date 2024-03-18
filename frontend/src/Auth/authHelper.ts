import { jwtDecode } from 'jwt-decode'

export const decodeJWT = () => {
  const token = localStorage.getItem('token')
  if (!token) return null // Corrected this line

  try {
    return jwtDecode(token)
  } catch (error) {
    console.error('Decoding JWT failed', error)
    return null
  }
}

export const isTokenValid = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return false
  }

  const decodedToken = decodeJWT()
  if (!decodedToken) {
    return false
  }

  const currentTime = Date.now() / 1000
  return decodedToken.exp ? decodedToken.exp > currentTime : false
}

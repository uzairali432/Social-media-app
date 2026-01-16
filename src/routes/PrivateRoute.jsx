import { Navigate } from 'react-router'
import { useAuthContext } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { state } = useAuthContext()
  const user = state.isLoggedIn || !!localStorage.getItem('currUser')
  return user ? children : <Navigate to={'/'} />
}

export default PrivateRoute
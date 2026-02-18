import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../constants'
import { useAppSelector } from '../redux/hooks'

export const PublicRoutes = () => {
  const { isAuthenticated } = useAppSelector((store) => store.auth)
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />
}

export default PublicRoutes

import { Outlet } from 'react-router-dom'
import Header from './header'
import Sidebar from './sidebar'
import Footer from './footer'

const Layout = () => {
  return (
    <div className="page-wrapper compact-wrapper">
      <Header />
      <div className="page-body-wrapper">
        <Sidebar />
        <div className="page-body">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Layout

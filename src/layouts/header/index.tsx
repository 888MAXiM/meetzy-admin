'use client'
import { useSelector } from 'react-redux'
import { Row } from 'reactstrap'
import RightHeader from './widgets'
import SidebarLogo from './widgets/SidebarLogo'
import type { RootState } from '../../redux/store'

const Header = () => {
  const { sideBarToggle } = useSelector((state: RootState) => state.layout)

  return (
    <div className={`page-header  ${sideBarToggle ? 'close_icon' : ''}`} id="page-header">
      <Row className="header-wrapper m-0">
        <SidebarLogo />
        <RightHeader />
      </Row>
    </div>
  )
}

export default Header

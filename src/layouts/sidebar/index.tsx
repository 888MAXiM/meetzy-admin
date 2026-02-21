import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import type { RootState } from '../../redux/store'
import { Image } from '../../shared/image'
import LogoWrapper from './widgets/LogoWrapper'
import MenuList from './widgets/menuList'
import ConfigDB from '../../data/themeConfig'

const Sidebar = () => {
  const { sideBarToggle } = useSelector((state: RootState) => state.layout)
  const sideBarIcon = ConfigDB.settings.sidebar.iconType
  const { t, i18n } = useTranslation()
  
  // Use language as key to force re-render when language changes
  const currentLanguage = i18n.resolvedLanguage || i18n.language

  return (
    <div className={`sidebar-wrapper ${sideBarToggle ? 'close_icon' : ''}`} data-layout={`${sideBarIcon}`}>
      <div>
        <LogoWrapper />
        <nav className="sidebar-main">
          <div id="sidebar-menu">
            <ul className="sidebar-links custom-scrollbar" id="simple-bar">
              <SimpleBar className="main-simplebar" key={currentLanguage}>
                <li className="back-btn">
                  <Image className="img-fluid" src="/logos/favicon.png" alt="logo-icon" />
                  <div className="mobile-back text-end">
                    <span>{t('back')}</span>
                    <i className="fa fa-angle-right ps-2" />
                  </div>
                </li>
                <MenuList key={currentLanguage} />
              </SimpleBar>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar

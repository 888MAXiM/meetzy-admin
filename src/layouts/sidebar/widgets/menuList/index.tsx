import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarMenuList } from '../../../../data/layout/sidebarMenuList'
import type { MenuItem } from '../../../../types/layout'
import SubMenu from './Submenu'

const MenuList = () => {
  const [activeMenu, setActiveMenu] = useState<MenuItem[]>([])
  const { t, i18n } = useTranslation()
  
  // Use language to force re-render when language changes
  const currentLanguage = i18n.resolvedLanguage || i18n.language

  return (
    <>
      {SidebarMenuList &&
        SidebarMenuList.map((mainMenu, index) => (
          <Fragment key={`${index}-${currentLanguage}`}>
            <li className={`sidebar-main-title`}>
              <div>
                <h6 className="lan-1">{t(`${mainMenu.title}`)}</h6>
              </div>
            </li>
            <SubMenu 
              key={`submenu-${index}-${currentLanguage}`}
              menu={mainMenu.Items} 
              activeMenu={activeMenu} 
              setActiveMenu={setActiveMenu} 
              level={0} 
            />
          </Fragment>
        ))}
    </>
  )
}

export default MenuList

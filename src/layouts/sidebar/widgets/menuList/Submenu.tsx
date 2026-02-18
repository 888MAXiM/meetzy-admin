/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { Badge } from 'reactstrap'
import { Href } from '../../../../constants'
import ConfigDB from '../../../../data/themeConfig'
import SvgIcon from '../../../../shared/icons/SvgIcon'
import type { MenuItem, MenuListProps } from '../../../../types/layout'

const Submenu: React.FC<MenuListProps> = ({ menu, setActiveMenu, activeMenu, level }) => {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()
  const sideBarIcon = ConfigDB.settings.sidebar.iconType

  // Use language to ensure re-render when language changes
  const currentLanguage = i18n.resolvedLanguage || i18n.language

  const ActiveNavLinkUrl = (path?: string) => {
    return pathname === path ? true : ''
  }

  const shouldSetActive = ({ item }: { item: MenuItem }): boolean => {
    let returnValue = false
    if (item?.path === pathname) {
      returnValue = true
    }
    if (!returnValue && item?.menu) {
      item?.menu.every((subItem: MenuItem) => {
        returnValue = shouldSetActive({ item: subItem })
        return !returnValue
      })
    }
    return returnValue
  }

  useEffect(() => {
    menu?.forEach((item) => {
      const gotValue = shouldSetActive({ item })
      if (gotValue) {
        const temp = [...activeMenu]
        temp[level] = item
        setActiveMenu(temp)
      }
    })
  }, [])

  return (
    <Fragment>
      {menu?.map((item, i) => (
        <li
          key={i}
          className={`${level === 0 ? 'sidebar-list' : ''} 
            ${
              (item.menu
                ? item.menu.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true)
                : ActiveNavLinkUrl(item.path)) || activeMenu[level]?.title === item.title
                ? 'active'
                : ''
            }`}
        >
          {item.badge ? <Badge color={item.badge}>{item.badgeName}</Badge> : ''}
          <Link
            className={`${level === 0 ? 'sidebar-link sidebar-title' : ''} ${
              (item.menu
                ? item.menu.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true)
                : ActiveNavLinkUrl(item.path)) || activeMenu[level]?.title === item.title
                ? 'active'
                : ''
            }`}
            to={item.path ? item.path : Href}
            onClick={() => {
              const temp = [...activeMenu]
              temp[level] = temp[level]?.title !== item.title ? item : ({} as MenuItem)
              setActiveMenu(temp)
            }}
          >
            {item.icon && (
              <SvgIcon
                className={`${sideBarIcon}-icon ${item.iconClass ? item.iconClass : ''}`}
                iconId={`${sideBarIcon}-${item.icon}`}
              />
            )}
            {level === 0 ? <span>{t(item.title)}</span> : t(item.title)}
            {item.menu && (
              <div className="according-menu">
                {activeMenu[level]?.title === item.title ? (
                  <i className="fa fa-angle-down" />
                ) : (
                  <i className="fa fa-angle-right" />
                )}
              </div>
            )}
          </Link>
          {item.menu && (
            <ul
              className={'sidebar-submenu'}
              style={{
                display: `${
                  (item.menu
                    ? item.menu.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true)
                    : ActiveNavLinkUrl(item.path)) || activeMenu[level]?.title === item.title
                    ? 'block'
                    : 'none'
                }`,
              }}
            >
              <Submenu menu={item.menu} activeMenu={activeMenu} setActiveMenu={setActiveMenu} level={level + 1} />
            </ul>
          )}
        </li>
      ))}
    </Fragment>
  )
}
export default Submenu

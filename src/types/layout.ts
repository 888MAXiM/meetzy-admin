export interface LayoutStateProps {
  sideBarToggle: boolean | undefined
}

export interface ChangeLngType {
  data: string
  logo?: string
  language: string
  subtitle?: string
  countryCode?: string
  flagUrl?: string | null
  flagEmoji?: string | null
}

export interface MenuItem {
  title: string
  lanClass?: string
  Items?: MenuItem[]
  id?: number
  icon?: string
  type?: string
  active?: boolean
  menu?: MenuItem[]
  path?: string
  badge?: string
  badgeName?: string
  badgeColor?: string
  pathSlice?: string
  menucontent?: string
  target?: string
  bookmark?: boolean
  pathName?: string
  name?: string
  iconClass?: string
}

export interface MenuListProps {
  menu: MenuItem[] | undefined
  setActiveMenu: (temp: MenuItem[]) => void
  activeMenu: MenuItem[]
  level: number
}

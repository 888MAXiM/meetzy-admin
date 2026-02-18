import { Grid } from 'react-feather'
import { Link } from 'react-router-dom'
import { ImageBaseUrl, ROUTES } from '../../../constants'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { setSidebarToggle } from '../../../redux/reducers/layoutSlice'
import { Image } from '../../../shared/image'
import SvgIcon from '../../../shared/icons/SvgIcon'

const LogoWrapper = () => {
  const dispatch = useAppDispatch()
  const { logo_light_url, logo_dark_url, sidebar_logo_url } = useAppSelector((state) => state.setting)

  return (
    <>
      <div className="logo-wrapper">
        <Link to={ROUTES.HOME}>
          <Image
            className="img-fluid for-light"
            src={`${logo_light_url ? ImageBaseUrl + logo_light_url : `/logos/1.svg`}`}
            alt="logo"
          />
          <Image
            className="img-fluid for-dark"
            src={`${logo_dark_url ? ImageBaseUrl + logo_dark_url : `/logos/3.svg`}`}
            alt="logo_dark"
          />
        </Link>
        <div className="back-btn" onClick={() => dispatch(setSidebarToggle())}>
          <SvgIcon className='back-btn-sidebar' iconId="cheveron-right" />
        </div>
        <div className="toggle-sidebar" onClick={() => dispatch(setSidebarToggle())}>
          <Grid className="status_toggle middle sidebar-toggle" />
        </div>
      </div>
      <div className="logo-icon-wrapper">
        <Link to={ROUTES.HOME}>
          <Image
            className="img-fluid"
            src={`${sidebar_logo_url ? ImageBaseUrl + sidebar_logo_url : `/logos/2.svg`}`}
            alt="logo-icon"
          />
        </Link>
      </div>
    </>
  )
}

export default LogoWrapper

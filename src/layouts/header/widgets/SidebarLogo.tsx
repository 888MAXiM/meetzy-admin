import { AlignCenter } from 'react-feather'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Col } from 'reactstrap'
import { setSidebarToggle } from '../../../redux/reducers/layoutSlice'
import { Image } from '../../../shared/image'
import { useAppSelector } from '../../../redux/hooks'
import { ImageBaseUrl } from '../../../constants'

const SidebarLogo = () => {
  const dispatch = useDispatch()
  const { logo_light_url, logo_dark_url } = useAppSelector((state) => state.setting)

  return (
    <Col xs="auto" className="header-logo-wrapper p-0">
      <div className="logo-wrapper">
        <Link to={`/`}>
          <Image
            className="img-fluid for-light"
            src={`${logo_light_url ? ImageBaseUrl + logo_light_url : `/logos/1.svg`}`}
            alt="logo"
            height={30}
            width={102}
          />
          <Image
            className="img-fluid for-dark"
            src={`${logo_dark_url ? ImageBaseUrl + logo_dark_url : `/logos/3.svg`}`}
            alt="logo_dark"
            height={30}
            width={102}
          />
        </Link>
      </div>
      <div className="toggle-sidebar" onClick={() => dispatch(setSidebarToggle())}>
        <AlignCenter className="status_toggle middle sidebar-toggle" />
      </div>
    </Col>
  )
}

export default SidebarLogo

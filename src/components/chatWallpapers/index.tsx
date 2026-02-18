import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import SvgIcon from '../../shared/icons/SvgIcon'
import WallpaperTable from './WallpaperTable'

const ChatWallpapers = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'chat_wallpapers',
              subtitle: 'view_and_manage_chat_wallpapers',
              headerChildren: (
                <div className="action-bar">
                  <Link to={ROUTES.ADD_WALLPAPER}>
                    <SolidButton className="btn-primary">
                      <SvgIcon className="plus-icon" iconId="plus-icon" />
                      Add Wallpaper
                    </SolidButton>
                  </Link>
                </div>
              ),
            }}
          >
            <WallpaperTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default ChatWallpapers

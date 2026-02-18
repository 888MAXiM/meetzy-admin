import { useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { ROUTES } from '../../constants'

const EditWallpaperError = () => {
  const navigate = useNavigate()
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'edit_wallpaper',
              subtitle: 'error_loading_wallpaper',
            }}
          >
            <div className="text-center">
              <div className="alert background-l-primary">
                <h5>Wallpaper Data Not Available</h5>
                <p>Unable to load Wallpaper details. Please go back and try editing again.</p>
                <SolidButton className="btn-primary" onClick={() => navigate(ROUTES.CHAT_WALLPAPERS)}>
                  Back to Wallpaper List
                </SolidButton>
              </div>
            </div>
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default EditWallpaperError

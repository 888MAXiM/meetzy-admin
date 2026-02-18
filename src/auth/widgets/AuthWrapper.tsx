import { Col, Container, Row } from 'reactstrap'
import { Image } from '../../shared/image'
import type { AuthWrapperProps } from '../../types/auth'
import SvgIcon from '../../shared/icons/SvgIcon'
import { useNavigate } from 'react-router-dom'

const AuthWrapper = ({ children, showBackBtn = false }: AuthWrapperProps) => {
  const navigate = useNavigate()
  const handleBack = () => {
    const segments = location.pathname.split('/').filter(Boolean)
    if (segments.length > 1) {
      segments.pop()
      navigate('/' + segments.join('/'))
    } else {
      navigate('/')
    }
  }
  return (
    <Container fluid className="login-wrapper">
      <Row className="g-0 min-vh-100">
        <Col md="12" className="common-flex card-flex">
          <div className="login-card text-center p-4">
            <div className="logo">
              {showBackBtn && (
                <div className="back-btn-badge" onClick={handleBack}>
                  <SvgIcon iconId="back-arrow-icon" />
                </div>
              )}
              <Image className="img-fluid for-light" src="/logos/1.svg" alt="ChatLogo" />
              <Image className="img-fluid for-dark" src="/logos/3.svg" alt="logo_dark" />
            </div>
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  )
}
export default AuthWrapper

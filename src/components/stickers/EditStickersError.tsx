import { useNavigate } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { ROUTES } from '../../constants'

const EditStickersError = () => {
  const navigate = useNavigate()
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'edit_stickers',
              subtitle: 'error_loading_stickers',
            }}
          >
            <div className="text-center">
              <div className="alert background-l-primary">
                <h5>Stickers Data Not Available</h5>
                <p>Unable to load Stickers details. Please go back and try editing again.</p>
                <SolidButton className="btn-primary" onClick={() => navigate(ROUTES.STICKERS)}>
                  Back to Stickers List
                </SolidButton>
              </div>
            </div>
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default EditStickersError

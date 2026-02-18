import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import SvgIcon from '../../shared/icons/SvgIcon'
import StickersTable from './StickersTable'

const Stickers = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'stickers',
              subtitle: 'view_and_manage_stickers',
              headerChildren: (
                <div className="action-bar">
                  <Link to={ROUTES.ADD_STICKERS}>
                    <SolidButton className="btn-primary">
                      <SvgIcon className="plus-icon" iconId="plus-icon" />
                      Add Stickers
                    </SolidButton>
                  </Link>
                </div>
              ),
            }}
          >
            <StickersTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default Stickers

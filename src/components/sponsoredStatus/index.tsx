import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import SvgIcon from '../../shared/icons/SvgIcon'
import SponsoredStatusTable from './SponsoredStatusTable'

const SponsoredStatus = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'Sponsored Status',
              subtitle: 'view_and_manage_sponsored_status',
              headerChildren: (
                <div className="action-bar">
                  <Link to={ROUTES.ADD_SPONSORED_STATUS}>
                    <SolidButton className="btn-primary">
                      <SvgIcon className="plus-icon" iconId="plus-icon" />
                      Add Status
                    </SolidButton>
                  </Link>
                </div>
              ),
            }}
          >
            <SponsoredStatusTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default SponsoredStatus

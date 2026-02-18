import { Container, Row, Col } from 'reactstrap'
import CardWrapper from '../../shared/card/CardWrapper'
import VerificationRequestsTable from './VerificationRequestsTable'

const VerificationRequests = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'Verification Requests',
              subtitle: 'View and manage all verification requests',
            }}
          >
            <VerificationRequestsTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default VerificationRequests


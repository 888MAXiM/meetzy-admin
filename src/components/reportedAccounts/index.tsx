import { Col, Container, Row } from 'reactstrap'
import CardWrapper from '../../shared/card/CardWrapper'
import ReportedAccountsTable from './ReportedAccountsTable'

const ReportedAccounts = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'reported_accounts',
              subtitle: 'view_and_manage_reported_accounts',
            }}
          >
            <ReportedAccountsTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default ReportedAccounts

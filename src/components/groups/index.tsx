import { Col, Container, Row } from 'reactstrap'
import CardWrapper from '../../shared/card/CardWrapper'
import GroupTable from './GroupTable'

const Groups = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'all_groups',
              subtitle: 'view_and_control_groups_access_and_permissions',
            }}
          >
            <GroupTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default Groups

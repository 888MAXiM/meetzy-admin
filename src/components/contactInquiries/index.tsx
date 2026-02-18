import { Col, Container, Row } from 'reactstrap'
import CardWrapper from '../../shared/card/CardWrapper'
import ContactInquiriesTable from './ContactInquiriesTable'

const ContactInquiries = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'contact_inquiries',
              subtitle: 'view_and_manage_contact_inquiries',
            }}
          >
            <ContactInquiriesTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default ContactInquiries

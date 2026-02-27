import { Col, Container, Row } from 'reactstrap'

const Footer = () => {
  return (
    <footer>
      <Container fluid>
        <Row>
          <Col md={12} className="footer-copyright text-center">
            <p className="mb-0">{`Copyright ${new Date().getFullYear()} © втренде`}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

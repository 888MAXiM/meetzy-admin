import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import SvgIcon from '../../shared/icons/SvgIcon'
import AnnouncementsTable from './AnnouncementsTable'

const Announcements = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'Announcement',
              subtitle: 'manage_and_view_announcements',
              headerChildren: (
                <div className="action-bar">
                  <Link to={ROUTES.MAKE_ANNOUNCEMENTS}>
                    <SolidButton className="btn-primary">
                      <SvgIcon className="plus-icon" iconId="plus-icon" />
                      Make Announce
                    </SolidButton>
                  </Link>
                </div>
              ),
            }}
          >
            <AnnouncementsTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default Announcements

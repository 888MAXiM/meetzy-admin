import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import SvgIcon from '../../shared/icons/SvgIcon'
import ReportSettingsTable from './ReportSettingsTable'

const ReportSettings = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'manage_report_settings',
              subtitle: 'view_and_manage_report',
              headerChildren: (
                <div className="action-bar">
                  <Link to={ROUTES.ADD_REPORT_SETTINGS}>
                    <SolidButton className="btn-primary">
                      <SvgIcon className="plus-icon" iconId="plus-icon" />
                      Add Report
                    </SolidButton>
                  </Link>
                </div>
              ),
            }}
          >
            <ReportSettingsTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default ReportSettings

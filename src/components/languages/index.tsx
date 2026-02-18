import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import SvgIcon from '../../shared/icons/SvgIcon'
import LanguagesTable from './LanguagesTable'

const Languages = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'manage_languages',
              subtitle: 'view_and_manage_languages',
              headerChildren: (
                <div className="action-bar">
                  <Link to={ROUTES.ADD_LANGUAGE}>
                    <SolidButton className="btn-primary">
                      <SvgIcon className="plus-icon" iconId="plus-icon" />
                      Add Language
                    </SolidButton>
                  </Link>
                </div>
              ),
            }}
          >
            <LanguagesTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default Languages


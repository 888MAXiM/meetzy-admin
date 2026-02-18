import { Col, Container, Row } from 'reactstrap'
import CardWrapper from '../../shared/card/CardWrapper'
import UsersTable from './UsersTable'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import SvgIcon from '../../shared/icons/SvgIcon'

const Users = () => {
  return (
    <Container fluid>
      <Row>
        <Col xl="12">
          <CardWrapper
            heading={{
              title: 'all_users',
              subtitle: 'view_and_control_user_access_and_permissions',
              headerChildren: (
                <div className="action-bar">
                  <Link to={ROUTES.CREATE_USER}>
                    <SolidButton className="btn-primary">
                      <SvgIcon className="plus-icon" iconId="plus-icon" />
                      Create User
                    </SolidButton>
                  </Link>
                </div>
              ),
            }}
          >
            <UsersTable />
          </CardWrapper>
        </Col>
      </Row>
    </Container>
  )
}

export default Users

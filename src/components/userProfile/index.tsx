import { Container, Row } from 'reactstrap'
import ChangePassword from './changePassword'
import Profile from './profile'

const UserProfile = () => {
  return (
    <Container fluid className="user-profile">
      <Row>
        <Profile />
        <ChangePassword />
      </Row>
    </Container>
  )
}

export default UserProfile

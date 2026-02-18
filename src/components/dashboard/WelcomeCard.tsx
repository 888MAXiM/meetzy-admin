import { Button, Card, CardBody, Col } from 'reactstrap'
import { Image } from '../../shared/image'
import { queries } from '../../api'
import { useNavigate } from 'react-router-dom'

const WelcomeCard = () => {
  const { data } = queries.useGetUserDetails()
  const navigate = useNavigate()

  return (
    <Col xxl="4" md="6" xs="12" className="col-xxx-custom custom-order-1">
      <Card>
        <CardBody className="welcome-card">
          <Image src="/welcome-bg.png" alt="welcome" />
          <div className="welcome-content">
            <h2>Welcome {data?.user.name || 'Admin'}</h2>
            <p>Here’s what’s happening in your chat app today</p>
            <Button onClick={() => navigate('/profile')}>View Profile</Button>
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}
export default WelcomeCard

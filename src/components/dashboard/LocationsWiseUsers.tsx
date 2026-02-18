import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, Col } from 'reactstrap'
import { LocationsWiseUsersOption } from '../../data/Dashboard'
import type { UserLocationDistribution } from '../../types/api'

const LocationsWiseUsers = ({ data }: { data?: UserLocationDistribution[] }) => {
  const { ChartOption, series } = LocationsWiseUsersOption({ data })

  return (
    <Col xxl="4" lg="6" className="custom-order-10">
      <Card>
        <CardHeader className="border-0 pb-0">
          <h4>Locations Wise Users</h4>
        </CardHeader>
        <CardBody className="py-0 location-chat-label">
          <ReactApexChart options={ChartOption} series={series} type="bar" height={325} />
        </CardBody>
      </Card>
    </Col>
  )
}

export default LocationsWiseUsers

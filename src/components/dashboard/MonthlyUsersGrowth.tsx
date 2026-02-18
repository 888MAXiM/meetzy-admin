import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, Col } from 'reactstrap'
import { MonthlyUsersGrowthOption } from '../../data/Dashboard'
import type { UserGrowthMonthly } from '../../types/api'

const MonthlyUsersGrowth = ({ data }: { data?: UserGrowthMonthly[] }) => {
  const { ChartOption, series } = MonthlyUsersGrowthOption({ data })

  return (
    <Col lg="6" className="custom-order-11">
      <Card>
        <CardHeader className="border-0 pb-0">
          <h4>Monthly Users Growth</h4>
        </CardHeader>
        <CardBody className="py-0 location-chat-label">
          <ReactApexChart options={ChartOption} series={series} type="bar" height={375} />
        </CardBody>
      </Card>
    </Col>
  )
}

export default MonthlyUsersGrowth

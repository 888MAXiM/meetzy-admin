import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, Col } from 'reactstrap'
import { TodayHourlyActivityOption } from '../../data/Dashboard'
import type { MessageByHour } from '../../types/api'

const TodayHourlyActivity = ({ data }: { data?: MessageByHour[] }) => {
  const { ChartOption, series } = TodayHourlyActivityOption({ data })

  return (
    <Col xs="12" className="custom-order-13">
      <Card>
        <CardHeader className="border-0 pb-0">
          <h4>Today's Hourly Activity</h4>
        </CardHeader>
        <CardBody className="py-0 location-chat-label">
          <ReactApexChart options={ChartOption} series={series} type="line" height={325} />
        </CardBody>
      </Card>
    </Col>
  )
}

export default TodayHourlyActivity

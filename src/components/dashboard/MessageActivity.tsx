import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, Col } from 'reactstrap'
import { MessageActivityOption } from '../../data/Dashboard'
import type { MessageActivityStat } from '../../types/api'

const MessageActivity = ({ data }: { data?: MessageActivityStat[] }) => {
  const { ChartOption, series } = MessageActivityOption({ data })

  return (
    <Col md="6" className="custom-order-6">
      <Card>
        <CardHeader className="border-0 pb-0">
          <h4>Message Activity</h4>
        </CardHeader>
        <CardBody className="py-0">
          <div>
            <ReactApexChart options={ChartOption} series={series} type="area" height={370} />
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}

export default MessageActivity

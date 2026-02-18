import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, Col } from 'reactstrap'
import { MessageDistributionOption } from '../../data/Dashboard'
import type { MessageTypeStat } from '../../types/api'

const MessageDistribution = ({ data }: { data?: MessageTypeStat[] }) => {
  const { ChartOption, series } = MessageDistributionOption({ data })

  return (
    <Col xxl="4" xl="6" className="custom-order-9">
      <Card>
        <CardHeader className="border-0 pb-0">
          <h4>Message Types Distribution</h4>
        </CardHeader>
        <CardBody className="py-0">
          <ReactApexChart options={ChartOption} series={series} type="bar" height={325} />
        </CardBody>
      </Card>
    </Col>
  )
}

export default MessageDistribution

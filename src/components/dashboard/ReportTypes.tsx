import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardHeader, Col } from 'reactstrap'
import { ReportTypesOption } from '../../data/Dashboard'
import type { ReportTypeStat } from '../../types/api'

const ReportTypes = ({ data }: { data?: ReportTypeStat[] }) => {
  const { ChartOption, series } = ReportTypesOption({ data })

  return (
    <Col xxl="4" xl="6" className="custom-order-8">
      <Card>
        <CardHeader className="border-0">
          <h4>Report Types</h4>
        </CardHeader>
        <CardBody className="pt-0 report-chart">
          <ReactApexChart options={ChartOption} series={series} type="donut" height={300} />
        </CardBody>
      </Card>
    </Col>
  )
}

export default ReportTypes

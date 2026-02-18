import { Col, Row } from 'reactstrap'
import { WidgetList } from '../../data/Dashboard'
import WidgetGrid from './WidgetGrid'
import { DashboardCounts } from '../../types/api'

const WidgetCard = ({ data }: { data?: DashboardCounts }) => {
  return (
    <>
      <Col md="6" xxl="2" sm="6" xs="12" className="col-xxx-custom1 custom-order-2">
        <Row>
          {WidgetList.slice(0, 2).map((widget) => {
            const count = data?.[widget.key as keyof DashboardCounts] ?? 0
            return (
              <Col xs="12" key={widget.id}>
                <WidgetGrid data={{ ...widget, count }} />
              </Col>
            )
          })}
        </Row>
      </Col>

      <Col md="4" xxl="2" sm="6" xs="12" className="col-xxx-custom1 custom-order-3">
        <Row>
          {WidgetList.slice(2, 4).map((widget) => {
            const count = data?.[widget.key as keyof DashboardCounts] ?? 0
            return (
              <Col xs="12" key={widget.id}>
                <WidgetGrid data={{ ...widget, count }} />
              </Col>
            )
          })}
        </Row>
      </Col>

      <Col md="4" xxl="2" sm="6" xs="12" className="col-xxx-custom2 custom-order-4">
        <Row>
          {WidgetList.slice(4, 6).map((widget) => {
            const count = data?.[widget.key as keyof DashboardCounts] ?? 0
            return (
              <Col xs="12" key={widget.id}>
                <WidgetGrid data={{ ...widget, count }} />
              </Col>
            )
          })}
        </Row>
      </Col>

      <Col md="4" xxl="2" sm="6" xs="12" className="col-xxx-custom2 custom-order-5">
        <Row>
          {WidgetList.slice(6, 8).map((widget) => {
            const count = data?.[widget.key as keyof DashboardCounts] ?? 0
            return (
              <Col xs="12" key={widget.id}>
                <WidgetGrid data={{ ...widget, count }} />
              </Col>
            )
          })}
        </Row>
      </Col>
    </>
  )
}

export default WidgetCard

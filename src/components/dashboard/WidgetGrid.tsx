import type { FC } from 'react'
import CountUp from 'react-countup'
import { Card, CardBody } from 'reactstrap'
import { Image } from '../../shared/image'
import type { WidgetGridResponse } from '../../types/dashboard'

const WidgetGrid: FC<WidgetGridResponse> = ({ data }) => {
  return (
    <Card className="widget">
      <CardBody>
        <div className={`widget-content ${data.styleClass}`}>
          <Image src={data.imgSrc} alt={data.label} />
          <div>
            <h4>
              <CountUp end={data.count ?? 0} start={0} duration={1.5} />
            </h4>
            <h6>{data.label}</h6>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default WidgetGrid

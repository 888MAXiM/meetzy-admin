import { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardFooter, CardHeader, UncontrolledTooltip } from 'reactstrap'
import type { CardWrapperProps } from '../../types/shared'
import SvgIcon from '../icons/SvgIcon'

const CardWrapper: FC<CardWrapperProps> = ({
  heading,
  footer,
  children,
  cardProps = {},
  headerProps = {},
  bodyProps = {},
  footerProps = {},
  backBtn = false,
  helperText,
  tooltipId = '',
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleBack = () => {
    const segments = location.pathname.split('/').filter(Boolean)
    if (segments.length > 1) {
      segments.pop()
      navigate('/' + segments.join('/'))
    } else {
      navigate('/')
    }
  }

  return (
    <div className="custom-manage">
      <Card {...cardProps} className={`${backBtn ? 'managechannel' : ''}`}>
        {(heading?.title || heading?.subtitle || heading?.headerChildren) && (
          <CardHeader className="flex-between" {...headerProps}>
            <div
              className={`d-flex ${helperText ? 'w-100 justify-content-between' : 'flex-column'} ${
                backBtn ? 'header-info' : ''
              }`}
            >
              {backBtn && (
                <div className="admin-back-btn-badge me-3" onClick={handleBack}>
                  <SvgIcon iconId="back-arrow-icon" />
                </div>
              )}
              <div className="">
                {heading?.title && <h4 className="card-title">{t(heading.title)}</h4>}
                {heading?.subtitle && <span className="card-subtitle">{t(heading.subtitle)}</span>}
              </div>
              {helperText && (
                <div className="tooltip-wrapper">
                  <span id={tooltipId} className="icon-parent">
                    <SvgIcon iconId="info" className="common-svg-md" />
                    <UncontrolledTooltip placement="top" target={tooltipId} className="custom-tooltip">
                      {t(helperText)}
                    </UncontrolledTooltip>
                  </span>
                </div>
              )}
            </div>
            {heading?.headerChildren}
          </CardHeader>
        )}
        {children && <CardBody {...bodyProps}>{children}</CardBody>}
        {footer && <CardFooter {...footerProps}>{footer.content}</CardFooter>}
      </Card>
    </div>
  )
}

export default CardWrapper

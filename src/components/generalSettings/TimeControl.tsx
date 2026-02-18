import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Input, Label, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import CardWrapper from '../../shared/card/CardWrapper'
import { ConfirmModal } from '../../shared/modal'

const TimeControl = () => {
  const { data } = queries.useGetSettings()
  const { mutate } = mutations.useUpdateSetting()
  const { t } = useTranslation()

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  const currentValue = data?.settings?.time_format ?? 'email'

  const options = [
    { label: '12 hour', value: '12h' },
    { label: '24 hour', value: '24h' },
  ]

  const handleRadioClick = (value: string) => {
    if (value === currentValue) return
    setSelectedValue(value)
    setShowConfirmation(true)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setSelectedValue(null)
  }

  const handleConfirm = () => {
    if (!selectedValue) return

    const formData = new FormData()
    formData.append('time_format', selectedValue)

    mutate(formData, {
      onSuccess: () => {
        setShowConfirmation(false)
      },
    })
  }

  return (
    <>
      <Col>
        <CardWrapper heading={{ title: t('time_format') }}>
          <Row>
            {options.map((item) => {
              const inputId = `time_format_${item.value}`
              return (
                <Col
                  md="12"
                  key={item.value}
                  className="d-flex align-items-center justify-content-between flex-lg-row-reverse mb-2"
                >
                  <Input
                    id={inputId}
                    type="radio"
                    name="time_format"
                    value={item.value}
                    checked={currentValue === item.value}
                    onChange={() => handleRadioClick(item.value)}
                  />
                  <Label htmlFor={inputId} className="ms-2 usage-option-label">
                    {item.label}
                  </Label>
                </Col>
              )
            })}
          </Row>
        </CardWrapper>
      </Col>

      <ConfirmModal
        subtitle={`Are you sure you want to change time format to "${selectedValue}"?`}
        title={`Change Time Format`}
        variant="info"
        isOpen={showConfirmation}
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default TimeControl

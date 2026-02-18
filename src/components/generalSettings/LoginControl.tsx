import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Input, Label, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import CardWrapper from '../../shared/card/CardWrapper'
import { ConfirmModal } from '../../shared/modal'

const LoginControl = () => {
  const { data } = queries.useGetSettings()
  const { mutate } = mutations.useUpdateSetting()
  const { t } = useTranslation()

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  const currentValue = data?.settings?.login_method ?? 'otp'

  const options = [
    { label: t('login_with_otp'), value: 'otp' },
    { label: t('login_with_password'), value: 'password' },
    { label: t('login_with_boths'), value: 'both' },
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
    formData.append('login_method', selectedValue)

    mutate(formData, {
      onSuccess: () => {
        setShowConfirmation(false)
      },
    })
  }

  return (
    <>
      <Col>
        <CardWrapper
          heading={{ title: t('login_method') }}
          helperText="Controls how users will log in to the system."
          tooltipId="login"
        >
          <Row>
            {options.map((item) => {
              const inputId = `login_method_${item.value}`
              return (
                <Col
                  md="12"
                  key={item.value}
                  className="d-flex align-items-center justify-content-between flex-lg-row-reverse mb-2"
                >
                  <Input
                    id={inputId}
                    type="radio"
                    name="login_method"
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
        subtitle={`Are you sure you want to change login method to "${selectedValue}"?`}
        title={`Change Login Method`}
        variant="info"
        isOpen={showConfirmation}
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default LoginControl

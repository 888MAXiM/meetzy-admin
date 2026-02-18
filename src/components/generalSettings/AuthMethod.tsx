import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Input, Label, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import CardWrapper from '../../shared/card/CardWrapper'
import { ConfirmModal } from '../../shared/modal'

const AuthMethod = () => {
  const { data } = queries.useGetSettings()
  const { mutate } = mutations.useUpdateSetting()
  const { t } = useTranslation()

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  const currentValue = data?.settings?.auth_method ?? 'email'

  const options = [
    { label: t('login_with_email'), value: 'email' },
    { label: t('login_with_phone'), value: 'phone' },
    { label: t('login_with_both'), value: 'both' },
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
    formData.append('auth_method', selectedValue)

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
          heading={{ title: t('auth_method') }}
          helperText="Determines which method(s) a user can use for verification during authentication."
          tooltipId="auth"
        >
          <Row>
            {options.map((item) => {
              const inputId = `auth_method_${item.value}`
              return (
                <Col
                  md="12"
                  key={item.value}
                  className="d-flex align-items-center justify-content-between flex-lg-row-reverse mb-2"
                >
                  <Input
                    id={inputId}
                    type="radio"
                    name="auth_method"
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
        subtitle={`Are you sure you want to change auth method to "${selectedValue}"?`}
        title={`Change Auth Method`}
        variant="info"
        isOpen={showConfirmation}
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default AuthMethod

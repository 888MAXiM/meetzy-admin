import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import CardWrapper from '../../shared/card/CardWrapper'
import { SwitchInput } from '../../shared/formFields'
import { ConfirmModal } from '../../shared/modal'
import type { UsageOptionFormValues } from '../../types/settings'

const UsageOption = () => {
  const { data } = queries.useGetSettings()
  const { mutate } = mutations.useUpdateSetting()
  const { t } = useTranslation()

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedKey, setSelectedKey] = useState<keyof UsageOptionFormValues | null>(null)
  const [selectedValue, setSelectedValue] = useState<boolean>(false)

  const optionItem: UsageOptionFormValues = {
    e2e_encryption_enabled: data?.settings?.e2e_encryption_enabled ?? false,
    maintenance_mode: data?.settings?.maintenance_mode ?? false,
    display_customizer: data?.settings?.display_customizer ?? false,
    audio_calls_enabled: data?.settings?.audio_calls_enabled ?? false,
    video_calls_enabled: data?.settings?.video_calls_enabled ?? false,
    allow_archive_chat: data?.settings?.allow_archive_chat ?? false,
    allow_media_send: data?.settings?.allow_media_send ?? false,
    allow_screen_share: data?.settings?.allow_screen_share ?? false,
    allow_status: data?.settings?.allow_status ?? false,
    allow_user_signup: data?.settings?.allow_user_signup ?? false,
  }

  const handleSwitchClick = (key: keyof UsageOptionFormValues, currentValue: boolean) => {
    setSelectedKey(key)
    setSelectedValue(!currentValue)
    setShowConfirmation(true)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setSelectedKey(null)
  }

  const handleConfirm = () => {
    if (!selectedKey) return
    const formData = new FormData()
    formData.append(selectedKey, `${selectedValue}`)

    mutate(formData, {
      onSuccess: () => {
        setShowConfirmation(false)
        setSelectedKey(null)
      },
    })
  }

  return (
    <>
      <Col>
        <CardWrapper
          heading={{
            title: t('usage_option'),
          }}
        >
          <Row>
            {Object.entries(optionItem).map(([key, value]) => (
              <Col md="12" key={key}>
                <SwitchInput
                  formGroupClass="d-flex justify-content-between"
                  name={key}
                  label={key}
                  checked={value}
                  labelClass="usage-option-label"
                  onToggle={() => handleSwitchClick(key as keyof UsageOptionFormValues, value)}
                />
              </Col>
            ))}
          </Row>
        </CardWrapper>
      </Col>

      <ConfirmModal
        subtitle={`Are you sure you want to ${selectedValue ? 'enable' : 'disable'} ${t(`${selectedKey}`)}?`}
        title={`${selectedValue ? 'Enable' : 'Disable'} ${t(`${selectedKey}`)}`}
        variant="info"
        isOpen={showConfirmation}
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default UsageOption

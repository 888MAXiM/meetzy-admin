import { Form, Formik, type FormikHelpers } from 'formik'
import { useEffect, useState } from 'react'
import { Col, Container, Label, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { TextInput } from '../../shared/formFields'
import SearchableSelect from '../../shared/formFields/SearchableSelectInput'
import { SelectOption } from '../../types/pages'
import type { EmailConfiFormValues } from '../../types/settings'
import { toaster } from '../../utils/custom-functions'
import { yupObject } from '../../utils/validation-schemas'
import { useTranslation } from 'react-i18next'
import TestMail from './TestMail'

const EmailConfiguration = () => {
  const { data } = queries.useGetSettings()
  const { t } = useTranslation()
  const { mutate, isPending } = mutations.useUpdateSetting()
  const typeOptions: SelectOption[] = [
    { label: 'TLS', value: 'tls' },
    { label: 'SSL', value: 'ssl' },
  ]
  const [selectedType, setSelectedType] = useState<SelectOption | null>(null)

  useEffect(() => {
    if (data?.settings) {
      const matched = typeOptions.find((item) => item.value === data.settings.mail_encryption)
      setSelectedType(matched || typeOptions[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const handleSubmit = (values: EmailConfiFormValues, { setSubmitting }: FormikHelpers<EmailConfiFormValues>) => {
    const formData = new FormData()

    const isFile = (val: unknown): val is File => val instanceof File

    Object.keys(values).forEach((key) => {
      const field = key as keyof EmailConfiFormValues
      const value = values[field]

      if (isFile(value)) {
        formData.append(field, value)
      } else if (value === null) {
        formData.append(field, 'null')
      } else if (value !== undefined) {
        formData.append(field, String(value))
      }
    })

    mutate(formData, {
      onSuccess: () => toaster('success', 'Settings updated successfully'),
      onSettled: () => setSubmitting(false),
    })
  }

  const initialValues: EmailConfiFormValues = {
    support_email: data?.settings?.support_email || '',
    smtp_host: data?.settings?.smtp_host || '',
    smtp_port: data?.settings?.smtp_port || '',
    smtp_user: data?.settings?.smtp_user || '',
    smtp_pass: data?.settings?.smtp_pass || '',
    mail_from_name: data?.settings?.mail_from_name || '',
    mail_from_email: data?.settings?.mail_from_email || '',
    mail_encryption: data?.settings?.mail_encryption || '',
  }

  return (
    <>
      <Formik enableReinitialize initialValues={initialValues} validationSchema={yupObject({})} onSubmit={handleSubmit}>
        {({ isSubmitting, setFieldValue }) => (
          <Container fluid>
            <Row>
              <Col xl="12">
                <CardWrapper
                  heading={{
                    title: 'Settings',
                  }}
                >
                  <Form className="login-form" encType="multipart/form-data">
                    <Row>
                      <Col md="6">
                        <TextInput name="support_email" label="support_email" placeholder="Enter support email" />
                      </Col>
                      <Col md="6">
                        <TextInput name="smtp_user" label="smtp_user" placeholder="enter_your_smtp_username" />
                      </Col>
                      <Col md="6">
                        <TextInput name="smtp_pass" label="smtp_pass" placeholder="*********" />
                      </Col>
                      <Col md="6">
                        <TextInput name="smtp_port" label="smtp_port" placeholder="enter_port" />
                      </Col>
                      <Col md="6">
                        <TextInput name="smtp_host" label="smtp_host" placeholder="enter_host" />
                      </Col>
                      <Col md="6">
                        <TextInput name="mail_from_name" label="mail_from_name" placeholder="Enter mail from name" />
                      </Col>
                      <Col md="6">
                        <TextInput
                          name="mail_from_email"
                          label="mail_from_email"
                          placeholder="Enter mail email"
                          required
                        />
                      </Col>
                      <Col md="6">
                        <Label>{t('mail_encryption')}</Label>
                        <SearchableSelect
                          name="status"
                          placeholder="Enter mail encryption"
                          options={typeOptions}
                          value={selectedType}
                          onChange={(option: SelectOption) => {
                            setSelectedType(option)
                            setFieldValue('mail_encryption', option.value)
                          }}
                          isClearable={false}
                        />
                      </Col>
                    </Row>
                    <div className="form-actions">
                      <SolidButton loading={isPending || isSubmitting} color="primary" title="submit" type="submit" />
                    </div>
                  </Form>
                </CardWrapper>
              </Col>
            </Row>
          </Container>
        )}
      </Formik>
      <TestMail />
    </>
  )
}
export default EmailConfiguration

import { Form, Formik, type FormikHelpers } from 'formik'
import { Col, Label, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { TextArea, TextInput } from '../../shared/formFields'
import TagInput from '../../shared/formFields/TagInput'
import type { SMSGateway, UsageControlFormValues } from '../../types/settings'
import { toaster } from '../../utils/custom-functions'
import { yupObject } from '../../utils/validation-schemas'
import LoginControl from './LoginControl'
import TimeControl from './TimeControl'
import UsageOption from './UsageOption'
import SearchableSelect from '../../shared/formFields/SearchableSelectInput'
import { SelectOption } from '../../types/pages'
import { useEffect, useState, useRef } from 'react'
import AuthMethod from './AuthMethod'

const UsageControl = () => {
  const { data } = queries.useGetSettings()
  const { mutate, isPending } = mutations.useUpdateSetting()
  const { data: gatewaysData } = queries.useGetSMSGateways()
  const { data: getAllGateways } = queries.useGetAllGateways()
  const { data: activeLanguage, isPending: activePending } = queries.useFetchActiveLanguages()

  const typeOptions: SelectOption[] = [
    ...(gatewaysData?.map((gateway: SMSGateway) => {
      return {
        label: gateway.name,
        value: gateway.name.toLowerCase(),
      }
    }) || []),
    ...(getAllGateways?.data ? [{ label: 'Custom', value: 'custom' }] : []),
  ]

  const [selectedType, setSelectedType] = useState<SelectOption | null>(null)
  const [defaultLan, setDefaultLan] = useState<SelectOption[]>()
  const [defaultSelectedLan, setDefaultSelectedLan] = useState<SelectOption | null>(null)
  const setFieldValueRef = useRef<((field: string, value: string | number) => void) | null>(null)

  useEffect(() => {
    const isActiveLan = activeLanguage?.data.pages.map((item) => ({ label: item.name, value: item.locale }))
    setDefaultLan(isActiveLan)
  }, [activeLanguage])

  useEffect(() => {
    if (!activePending && defaultLan && defaultLan.length > 0) {
      if (data?.settings?.default_language) {
        const defaultLanValue = defaultLan.find((item) => item.value === data.settings.default_language)
        if (defaultLanValue) {
          setDefaultSelectedLan(defaultLanValue)
        } else {
          setDefaultSelectedLan(defaultLan[0])
        }
      } else {
        setDefaultSelectedLan(defaultLan[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLanguage, defaultLan, data])

  useEffect(() => {
    if (data) {
      const matched = typeOptions.find((item) => item.value == data.settings.sms_gateway)
      setSelectedType(matched || typeOptions[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (defaultSelectedLan && setFieldValueRef.current) {
      setFieldValueRef.current('default_language', defaultSelectedLan.value)
    }
  }, [defaultSelectedLan])

  const handleSubmit = (values: UsageControlFormValues, { setSubmitting }: FormikHelpers<UsageControlFormValues>) => {
    const formData = new FormData()

    const isFile = (val: unknown): val is File => val instanceof File

    Object.keys(values).forEach((key) => {
      const field = key as keyof UsageControlFormValues
      const value = values[field]

      if (field === 'maintenance_allowed_ips') {
        formData.append(field, JSON.stringify(value || []))
        return
      }

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

  const initialValues: UsageControlFormValues = {
    app_name: data?.settings?.app_name || '',
    app_description: data?.settings?.app_description || '',
    no_internet_title: data?.settings?.no_internet_title || '',
    no_internet_content: data?.settings?.no_internet_content || '',
    page_404_title: data?.settings?.page_404_title || '',
    page_404_content: data?.settings?.page_404_content || '',
    maintenance_title: data?.settings?.maintenance_title || '',
    maintenance_message: data?.settings?.maintenance_message || '',
    maintenance_allowed_ips: data?.settings?.maintenance_allowed_ips || [],
    sms_gateway: data?.settings?.sms_gateway || '',

    ...(defaultLan && defaultLan.length > 0 ? { default_language: data?.settings?.default_language || '' } : {}),
  }

  return (
    <Formik enableReinitialize initialValues={initialValues} validationSchema={yupObject({})} onSubmit={handleSubmit}>
      {({ isSubmitting, setFieldValue }) => {
        // Store setFieldValue in ref so we can use it in top-level useEffect
        setFieldValueRef.current = setFieldValue
        return (
          <Row>
            <Col xl="8">
              <CardWrapper
                heading={{
                  title: 'usage_control',
                }}
              >
                <Form className="login-form" encType="multipart/form-data">
                  <Row>
                    <Col md="12">
                      <TextInput name="app_name" label="app_name" placeholder="enter_your_app_name" />
                    </Col>
                    <Col md="12">
                      <TextArea
                        name="app_description"
                        label="app_description"
                        placeholder="enter_your_app_description"
                        rows={1}
                      />
                    </Col>
                    <Col md="12">
                      <TextInput
                        name="no_internet_title"
                        label="no_internet_title"
                        placeholder="enter_your_no_internet_title"
                      />
                    </Col>
                    <Col md="12">
                      <TextInput
                        name="no_internet_content"
                        label="no_internet_content"
                        placeholder="enter_your_no_internet_content"
                      />
                    </Col>
                    <Col md="12">
                      <TextInput name="page_404_title" label="page_404_title" placeholder="enter_your_page_404_title" />
                    </Col>
                    <Col md="12">
                      <TextInput
                        name="page_404_content"
                        label="page_404_content"
                        placeholder="enter_your_page_404_content"
                      />
                    </Col>
                    <Col md="12">
                      <TextInput
                        name="maintenance_title"
                        label="maintenance_title"
                        placeholder="enter_your_maintenance_title"
                      />
                    </Col>
                    <Col md="12">
                      <TextInput
                        name="maintenance_message"
                        label="maintenance_message"
                        placeholder="enter_your_maintenance_message"
                      />
                    </Col>
                    <Col md="12">
                      <TagInput
                        formGroupClass="margin-b-20"
                        name="maintenance_allowed_ips"
                        placeholder="Enter maintenance allowed ips"
                        label="maintenance_allowed_ips"
                      />
                    </Col>
                    <Col md="12" className="mb-3">
                      <Label>SMS Gateway</Label>
                      <SearchableSelect
                        name="sms_gateway"
                        placeholder="Enter SMS Gateway"
                        options={typeOptions}
                        value={selectedType}
                        onChange={(option: SelectOption) => {
                          setSelectedType(option)
                          setFieldValue('sms_gateway', option.value)
                        }}
                        isClearable={false}
                      />
                    </Col>
                    <Col md="12" className="mb-3">
                      <Label>Set Default Language</Label>
                      <SearchableSelect
                        name="default_language"
                        placeholder="Enter Default Language"
                        options={defaultLan}
                        value={defaultSelectedLan}
                        onChange={(option: SelectOption) => {
                          setDefaultSelectedLan(option)
                          setFieldValue('default_language', option.value)
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
            <Col xl="4">
              <UsageOption />
              <Row>
                <AuthMethod />
                <LoginControl />
              </Row>
              <TimeControl />
            </Col>
          </Row>
        )
      }}
    </Formik>
  )
}
export default UsageControl

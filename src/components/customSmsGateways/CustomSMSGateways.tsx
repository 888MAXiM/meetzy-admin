import { Form, Formik, type FormikHelpers } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { Col, Label, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { TextInput } from '../../shared/formFields'
import SearchableSelect from '../../shared/formFields/SearchableSelectInput'
import { CustomSMSGatewaysValues, KeyValue } from '../../types/api'
import { SelectOption } from '../../types/pages'
import { toaster } from '../../utils/custom-functions'
import { yupObject } from '../../utils/validation-schemas'
import CustomKeysSection from './CustomKeysSection'
import AddBody, { BodyData } from './AddBody'
import KeyValueCard from './KeyValueCard'
import TestSMSModal from './TestSMSModal'

const CustomSMSGateways = () => {
  const { data } = queries.useGetAllGateways()
  const { mutate, isPending } = mutations.useSaveGateway()
  const { mutate: testMutate, isPending: isTestPending } = mutations.useTestGateway()

  const typeOptions: SelectOption[] = [
    { label: 'POST', value: 'post' },
    { label: 'GET', value: 'get' },
  ]

  const configOptions: SelectOption[] = [
    { label: 'SID', value: 'SID' },
    { label: 'Auth Token', value: 'AUTH_TOKEN' },
    { label: 'Custom Keys', value: 'CUSTOM_KEYS' },
  ]

  const [selectedType, setSelectedType] = useState<SelectOption | null>(null)
  const [result, setResult] = useState<KeyValue[]>([])
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)

  useEffect(() => {
    if (data?.data?.custom_config?.field_mappings) {
      const mappings = Object.values(data.data.custom_config.field_mappings).map((label: string) => ({
        key: label,
        value: `{${label.toLowerCase()}}`,
      }))
      setResult(mappings)
    }
  }, [data])

  const [bodyData, setBodyData] = useState<BodyData>({
    type: 'json',
    jsonValue: '',
    formData: [{ key: '', value: '' }],
  })

  const [customKeys, setCustomKeys] = useState<KeyValue[]>([])
  const [paramsData, setParamsData] = useState<KeyValue[]>([])
  const [headersData, setHeadersData] = useState<KeyValue[]>([])

  useEffect(() => {
    if (data?.data) {
      const matched = typeOptions.find((item) => item.value === data.data.method)
      setSelectedType(matched || typeOptions[0])
      setParamsData(data.data.custom_config?.params || [])
      setHeadersData(data.data.custom_config?.headers || [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const initialBodyData = useMemo(() => {
    if (!data?.data) return undefined

    const bodyFields = data.data.custom_config?.body_fields || []
    const combinedFormData = [...bodyFields, ...result]

    return {
      type: data.data.custom_config?.body_type || 'json',
      jsonValue: data.data.custom_config?.json || '',
      formData: combinedFormData.length > 0 ? combinedFormData : [{ key: '', value: '' }],
      field_mappings: result,
    }
  }, [data, result])

  const handleSubmit = (values: CustomSMSGatewaysValues, { setSubmitting }: FormikHelpers<CustomSMSGatewaysValues>) => {
    const allBodyFields = [...bodyData.formData, ...customKeys].filter(
      (item) => item.key?.trim() !== '' && item.value?.trim() !== '',
    )
    const resultKeys = result.map((r) => r.key)
    const bodyFieldsToSave = allBodyFields.filter((item) => !resultKeys.includes(item.key))

    const requestData = {
      ...values,
      custom_config: {
        params: paramsData.filter((item) => item.key?.trim() !== ''),
        headers: headersData.filter((item) => item.key?.trim() !== ''),
        body_type: bodyData.type,
        json_body: bodyData.jsonValue,
        form_data: bodyFieldsToSave,
        body_fields: bodyFieldsToSave,
        field_mappings: data?.data?.custom_config?.field_mappings || null,
        error_response: data?.data?.custom_config?.error_response || null,
        success_response: data?.data?.custom_config?.success_response || null,
      },
    }
    delete requestData.body_fields

    mutate(requestData, {
      onSuccess: () => toaster('success', 'Settings updated successfully'),
      onSettled: () => setSubmitting(false),
    })
  }

  const handleTestSMS = (values: { test_phone: string; test_message: string }) => {
    testMutate(values, {
      onSuccess: () => {
        toaster('success', 'Test SMS sent successfully')
        setIsTestModalOpen(false)
      },
    })
  }

  const toggleTestModal = () => {
    setIsTestModalOpen(!isTestModalOpen)
  }

  const initialValues: CustomSMSGatewaysValues = {
    name: data?.data?.name || '',
    base_url: data?.data?.base_url || '',
    method: data?.data?.method || '',
    auth_type: data?.data?.auth_type?.filter((item) => item !== 'CUSTOM_KEYS') || [],
    auth_token: data?.data?.auth_token || '',
    account_sid: data?.data?.account_sid || '',
    from_number: data?.data?.from_number || '',
    body_fields: data?.data?.custom_config?.body_fields || [],
  }
  console.log('🚀 ~ CustomSMSGateways ~ initialValues:', initialValues)

  const getConfigOptionsValue = (authType: string[]) => {
    return configOptions.filter((opt) => authType.includes(`${opt.value}`))
  }

  return (
    <>
      <Formik enableReinitialize initialValues={initialValues} validationSchema={yupObject({})} onSubmit={handleSubmit}>
        {({ values, isSubmitting, setFieldValue, handleSubmit }) => {
          return (
            <Form className="login-form" onSubmit={handleSubmit}>
              <Row>
                <Col xl="12">
                  <CardWrapper
                    heading={{
                      title: 'Custom SMS Gateways',
                    }}
                  >
                    <Row>
                      <Col md="12">
                        <TextInput name="name" label="name" placeholder="enter_name" />
                      </Col>
                      <Col md="12">
                        <TextInput name="base_url" label="base_url" placeholder="enter_your_base_url" />
                      </Col>

                      <Col md="12" className="mb-3">
                        <Label>Method</Label>
                        <SearchableSelect
                          name="method"
                          placeholder="Enter Method"
                          options={typeOptions}
                          value={selectedType}
                          onChange={(option: SelectOption) => {
                            setSelectedType(option)
                            setFieldValue('method', option.value)
                          }}
                          isClearable={false}
                        />
                      </Col>

                      <Col md="12" className="mb-3">
                        <Label>Configs</Label>
                        <SearchableSelect
                          name="auth_type"
                          placeholder="Select Configs"
                          options={configOptions}
                          value={getConfigOptionsValue(values.auth_type)}
                          onChange={(options: SelectOption[] | null) => {
                            const finalValues = options ? options.map((o) => o.value) : []
                            setFieldValue('auth_type', finalValues)
                            if (finalValues.includes('CUSTOM_KEYS')) {
                              if (!values.body_fields || values.body_fields.length === 0) {
                                setFieldValue('body_fields', [{ key: '', value: '' }])
                              }
                            } else {
                              setFieldValue('body_fields', [])
                            }
                          }}
                          isClearable={false}
                          isMulti={true}
                        />
                      </Col>

                      {values.auth_type.includes('SID') && (
                        <Col md="12">
                          <TextInput name="account_sid" label="account_sid" placeholder="enter_your_account_sid" />
                        </Col>
                      )}

                      {values.auth_type.includes('AUTH_TOKEN') && (
                        <Col md="12">
                          <TextInput name="auth_token" label="auth_token" placeholder="enter_your_auth_token" />
                        </Col>
                      )}

                      <Col md="12">
                        <TextInput name="from_number" label="from_number" placeholder="enter_your_from_number" />
                      </Col>

                      <CustomKeysSection
                        values={values}
                        setFieldValue={setFieldValue}
                        onNewKeysChange={setCustomKeys}
                      />
                    </Row>
                  </CardWrapper>
                </Col>
              </Row>

              <AddBody initialBodyData={initialBodyData} onBodyDataChange={setBodyData} />

              <Row className="mt-4">
                <Col xl="12">
                  <KeyValueCard
                    title="Add Params"
                    initialData={data?.data?.custom_config?.params || []}
                    onDataChange={setParamsData}
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                <Col xl="12">
                  <KeyValueCard
                    title="Add Headers"
                    initialData={data?.data?.custom_config?.headers || []}
                    onDataChange={setHeadersData}
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                <Col xl="12">
                  <div className="form-actions text-end">
                    <SolidButton
                      loading={isPending || isSubmitting}
                      color="primary"
                      title="Submit All Settings"
                      type="submit"
                      className="me-2"
                    />
                    <SolidButton
                      loading={isTestPending}
                      color="primary"
                      title="Send Test SMS"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleTestModal()
                      }}
                      type="button"
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          )
        }}
      </Formik>

      <TestSMSModal
        isOpen={isTestModalOpen}
        toggle={toggleTestModal}
        onSubmit={handleTestSMS}
        isLoading={isTestPending}
      />
    </>
  )
}

export default CustomSMSGateways

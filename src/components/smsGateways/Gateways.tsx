import { Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { mutations, queries } from '../../api'
import { SolidButton } from '../../shared/button/SolidButton'
import { SwitchInput } from '../../shared/formFields'
import { SMSGateway, TwilioFormValues, UpdateGatewayPayload } from '../../types/settings'

const Gateways = () => {
  const { data: gatewaysData, isLoading } = queries.useGetSMSGateways()

  const updateGateway = mutations.useUpdateSMSGateway()
  const toggleStatus = mutations.useToggleSMSGatewayStatus()
  const rawGateways = gatewaysData as unknown

  const gatewaysArray: SMSGateway[] = Array.isArray(rawGateways)
    ? (rawGateways as SMSGateway[])
    : rawGateways && typeof rawGateways === 'object' && Array.isArray((rawGateways as any).data)
    ? (rawGateways as any).data
    : []

  const twilioGateway = gatewaysArray.find((gateway: SMSGateway) => gateway.name.toLowerCase() === 'twilio')

  const initialValues: TwilioFormValues = {
    account_sid: twilioGateway?.config?.account_sid || '',
    auth_token: twilioGateway?.config?.auth_token || '',
    from: twilioGateway?.config?.from || '',
    twilioStatus: twilioGateway?.enabled || false,
  }

  const handleSubmit = async (values: TwilioFormValues, { setSubmitting }: any) => {
    try {
      const payload: UpdateGatewayPayload = {
        name: 'twilio',
        config: {
          account_sid: values.account_sid,
          auth_token: values.auth_token,
          from: values.from,
        },
        enabled: values.twilioStatus,
      }

      if (twilioGateway) {
        await updateGateway.mutateAsync({
          id: twilioGateway.id,
          data: payload,
        })
        toast.success('Twilio gateway updated successfully')
      } else {
        toast.error('Gateway not found. Please contact administrator.')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save gateway')
      console.error('Submit error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusToggle = async (currentStatus: boolean, setFieldValue: any) => {
    if (!twilioGateway) {
      toast.warning('Please save the gateway configuration first')
      return
    }

    try {
      await toggleStatus.mutateAsync({
        id: twilioGateway.id,
        enabled: !currentStatus,
      })
      setFieldValue('twilioStatus', !currentStatus)
      toast.success(`Gateway ${!currentStatus ? 'enabled' : 'disabled'} successfully`)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to toggle status')
      console.error('Toggle error:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {({ values, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
          <Form>
            <Card>
              <CardHeader>
                <SwitchInput
                  formGroupClass="d-flex justify-content-between align-items-center mb-0"
                  name="twilioStatus"
                  label="Twilio"
                  labelClass="sms-gateway-label me-3 mb-0"
                  onToggle={() => handleStatusToggle(values.twilioStatus, setFieldValue)}
                />
              </CardHeader>

              <CardBody style={{ padding: '32px 24px' }}>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="account_sid">Twilio SID</Label>
                      <Input
                        type="text"
                        name="account_sid"
                        id="account_sid"
                        placeholder="Twilio SID"
                        value={values.account_sid}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="auth_token">Twilio Auth Token</Label>
                      <Input
                        type="password"
                        name="auth_token"
                        id="auth_token"
                        placeholder="Twilio Auth Token"
                        value={values.auth_token}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="from">Twilio Number</Label>
                      <Input
                        type="text"
                        name="from"
                        id="from"
                        placeholder="Twilio Number"
                        value={values.from}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} className="d-flex justify-content-end">
                    <SolidButton
                      loading={isSubmitting || updateGateway.isPending}
                      color="primary"
                      title="Submit"
                      type="submit"
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Gateways
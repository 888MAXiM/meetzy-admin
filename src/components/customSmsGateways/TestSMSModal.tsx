import { Form, Formik, FormikHelpers } from 'formik'
import { Button, Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import * as Yup from 'yup'
import { PhoneInput } from '../../shared/formFields'

interface TestSMSFormValues {
  country_code: string
  test_phone: string
  test_message: string
}

interface TestSMSPayload {
  test_phone: string
  test_message: string
}

interface TestSMSModalProps {
  isOpen: boolean
  toggle: () => void
  onSubmit: (values: TestSMSPayload) => void
  isLoading?: boolean
}

const TestSMSModal = ({ isOpen, toggle, onSubmit, isLoading = false }: TestSMSModalProps) => {
  const initialValues: TestSMSFormValues = {
    country_code: '',
    test_phone: '',
    test_message: '',
  }

  const validationSchema = Yup.object({
    country_code: Yup.string().required('Country code is required'),
    test_phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9\-\s()]+$/, 'Please enter a valid phone number'),
    test_message: Yup.string(),
  })

  const handleSubmit = (values: TestSMSFormValues, { setSubmitting }: FormikHelpers<TestSMSFormValues>) => {
    const payload: TestSMSPayload = {
      test_phone: '+' + values.country_code + values.test_phone,
      test_message: values.test_message,
    }
    onSubmit(payload)
    setSubmitting(false)
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Send Test SMS</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md="12" className="mb-3">
                  <PhoneInput
                    label={'Phone Number'}
                    name="test_phone"
                    codeName="country_code"
                    containerClass="mb-0"
                    xxlClass={6}
                    xxlClass2={6}
                  />
                </Col>

                <Col md="12" className="mb-3">
                  <Label for="test_message">Message (optional)</Label>
                  <textarea
                    id="test_message"
                    name="test_message"
                    className="form-control"
                    placeholder="Enter your test message"
                    rows={4}
                    value={values.test_message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.test_message && touched.test_message && (
                    <div className="invalid-feedback d-block">{errors.test_message}</div>
                  )}
                </Col>

                <Col md="12">
                  <div className="d-flex justify-content-end gap-2">
                    <Button color="primary" type="submit" disabled={isLoading || isSubmitting}>
                      {isLoading || isSubmitting ? 'Sending...' : 'Send SMS'}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  )
}

export default TestSMSModal

import { Form, Formik, type FormikHelpers } from 'formik'
import { Col, Container, Row } from 'reactstrap'
import { mutations } from '../../api'
import { SolidButton } from '../../shared/button/SolidButton'
import CardWrapper from '../../shared/card/CardWrapper'
import { TextInput } from '../../shared/formFields'
import type { TestMailFormValues } from '../../types/settings'
import { toaster } from '../../utils/custom-functions'
import { yupObject } from '../../utils/validation-schemas'

const TestMail = () => {
  const { mutate, isPending } = mutations.useTestMail()

  const handleSubmit = (values: TestMailFormValues, { setSubmitting }: FormikHelpers<TestMailFormValues>) => {
    const formData: TestMailFormValues = { to: values.to }

    mutate(formData, {
      onSuccess: () => toaster('success', 'send mail successfully'),
      onSettled: () => setSubmitting(false),
    })
  }

  const initialValues: TestMailFormValues = {
    to: '',
  }

  return (
    <>
      <Formik enableReinitialize initialValues={initialValues} validationSchema={yupObject({})} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Container fluid>
            <Row>
              <Col xl="12">
                <CardWrapper
                  heading={{
                    title: 'Test Mail',
                  }}
                >
                  <Form className="login-form" encType="multipart/form-data">
                    <Row>
                      <Col md="12">
                        <TextInput name="to" label="to_mail" placeholder="Enter email" required />
                      </Col>
                    </Row>
                    <div className="form-actions">
                      <SolidButton loading={isPending || isSubmitting} color="primary" title="submit" type="submit" />
                    </div>
                  </Form>
                  <div className="mt-2">
                    <div>
                      <h4>Instruction</h4>
                      <p className="text-danger my-3">
                        When setting up your email system (SMTP), make sure to do it carefully. If it's not done right,
                        you'll encounter errors when sending OTP in forgot password.
                      </p>
                    </div>
                    <div>
                      <h5>If you're not using SSL:</h5>
                      <ul className="my-3 ms-2 d-flex flex-column gap-2">
                        <li>- Use the Mail Host settings provided by your email service's manual.</li>
                        <li>- Set the Mail port to 587.</li>
                        <li>- Set the Mail Encryption to TLS.</li>
                        <li>- If there are issues with TLS, set the Mail Encryption to SSL.</li>
                      </ul>
                    </div>
                    <div>
                      <h5>If you're using SSL:</h5>
                      <ul className="my-3 ms-2 d-flex flex-column gap-2">
                        <li>- Use the Mail Host settings provided by your email service's manual.</li>
                        <li>- Set the Mail port to 465.</li>
                        <li>- Set the Mail Encryption to SSL.</li>
                      </ul>
                    </div>
                  </div>
                </CardWrapper>
              </Col>
            </Row>
          </Container>
        )}
      </Formik>
    </>
  )
}
export default TestMail

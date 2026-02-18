import { Form, Formik, type FormikHelpers } from 'formik'
import { Col, Container, Row } from 'reactstrap'
import { mutations } from '../../../api'
import { useAppSelector } from '../../../redux/hooks'
import { SolidButton } from '../../../shared/button/SolidButton'
import CardWrapper from '../../../shared/card/CardWrapper'
import { TextInput } from '../../../shared/formFields'
import type { UpdatePasswordFormValues } from '../../../types/profile'
import { toaster } from '../../../utils/custom-functions'
import { updatePasswordSchema } from '../../../utils/validation-schemas'

const ChangePassword = () => {
  const { user } = useAppSelector((store) => store.auth)
  const { mutate, isPending } = mutations.useUpdatePassword()

  const handleSubmit = (values: UpdatePasswordFormValues, { resetForm }: FormikHelpers<UpdatePasswordFormValues>) => {
    mutate(
      {
        password: values?.new_password,
        old_password: values?.old_password,
      },
      {
        onSuccess: () => {
          resetForm()
          toaster('success', 'Password updated successfully.')
        },
      },
    )
  }

  return (
    <Col xl="12">
      <CardWrapper
        heading={{
          title: 'change_password',
          subtitle: `One Password for all the teams connected with ${user?.email}`,
        }}
      >
        <Formik
          initialValues={{
            new_password: '',
            confirm_password: '',
            old_password: '',
          }}
          validationSchema={updatePasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ resetForm }) => (
            <Form className="login-form">
              <Container fluid>
                <Row>
                  <Col md="4">
                    <TextInput
                      label="old_password"
                      iconProps={{ iconId: 'lock', className: 'form-icon' }}
                      name="old_password"
                      placeholder="*********"
                      type="password"
                    />
                  </Col>
                  <Col md="4">
                    <TextInput
                      label="new_password"
                      iconProps={{ iconId: 'lock', className: 'form-icon' }}
                      name="new_password"
                      placeholder="*********"
                      type="password"
                    />
                  </Col>
                  <Col md="4">
                    <TextInput
                      label="confirm_password"
                      iconProps={{ iconId: 'lock', className: 'form-icon' }}
                      name="confirm_password"
                      type="password"
                      placeholder="*********"
                    />
                  </Col>
                </Row>
              </Container>
              <div className="d-flex form-actions">
                <SolidButton title="cancel" className="Login-btn btn-outline-light" onClick={() => resetForm()} />
                <SolidButton loading={isPending} title="save" type="submit" color="primary" />
              </div>
            </Form>
          )}
        </Formik>
      </CardWrapper>
    </Col>
  )
}

export default ChangePassword

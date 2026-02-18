import { Form, Formik, type FormikHelpers } from 'formik'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import { toaster } from '../../utils/custom-functions'
import { emailSchema } from '../../utils/validation-schemas'
import type { EmailPayload } from '../../types/auth'
import { useAppDispatch } from '../../redux/hooks'
import { setForgotPasswordEmail } from '../../redux/reducers/authSlice'
import mutations from '../../api/mutations'
import { TextInput } from '../../shared/formFields'

const ForgotPasswordForm = () => {
  const { mutate: requestPin, isPending } = mutations.useRequestForgotPassword()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const handleSubmit = async (values: EmailPayload, { resetForm }: FormikHelpers<EmailPayload>) => {
    requestPin(
      { identifier: values?.email },
      {
        onSuccess: () => {
          dispatch(setForgotPasswordEmail(values.email))
          toaster('success', 'Otp sent successfully')
          navigate(ROUTES.VERIFY_OTP)
          resetForm()
        },
      },
    )
  }

  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={emailSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="login-form">
          <TextInput
            label="email_address"
            containerClass="login-input email-input"
            iconProps={{ iconId: 'messages', className: 'form-icon' }}
            name="email"
            type="email"
            placeholder="admin@example.com"
          />
          <SolidButton loading={isPending} title="send" type="submit" color="primary" className="w-100 Login-btn" />
        </Form>
      )}
    </Formik>
  )
}
export default ForgotPasswordForm

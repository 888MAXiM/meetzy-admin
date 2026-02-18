import { Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { ROUTES, STORAGE_KEYS } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import { TextInput } from '../../shared/formFields'
import { getStorage } from '../../utils'
import { toaster } from '../../utils/custom-functions'
import { confirmPasswordSchema } from '../../utils/validation-schemas'
import { useAppDispatch } from '../../redux/hooks'
import mutations from '../../api/mutations'
import type { ResetPasswordFormValues } from '../../types/auth'
import { clearForgotPasswordEmail } from '../../redux/reducers/authSlice'

const NewPasswordForm = () => {
  const storage = getStorage()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { mutate: resetPassword, isPending } = mutations.useResetPassword()

  const handleSubmit = (values: ResetPasswordFormValues) => {
    const email = storage.getItem(STORAGE_KEYS.FORGOT_PASSWORD_EMAIL)
    const otp = storage.getItem(STORAGE_KEYS.OTP_TOKEN)
    if (!otp || !email) {
      toaster('error', 'Invalid OTP or email. Please try again.')
      return
    }
    resetPassword(
      {
        otp: otp,
        new_password: values.password,
        identifier: email,
      },
      {
        onSuccess: () => {
          toaster('success', 'Password reset successfully. You can now login.')
          dispatch(clearForgotPasswordEmail())
          navigate(ROUTES.LOGIN)
        },
      },
    )
  }
  return (
    <Formik
      initialValues={{
        password: '',
        confirm_password: '',
      }}
      validationSchema={confirmPasswordSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="login-form">
          <TextInput
            label="new_password"
            iconProps={{ iconId: 'lock', className: 'form-icon' }}
            name="password"
            placeholder="*********"
            type="password"
          />
          <TextInput
            label="confirm_password"
            iconProps={{ iconId: 'lock', className: 'form-icon' }}
            name="confirm_password"
            placeholder="*********"
            type="password"
          />
          <SolidButton title="submit" type="submit" color="primary" className=" w-100 Login-btn" loading={isPending} />
        </Form>
      )}
    </Formik>
  )
}

export default NewPasswordForm

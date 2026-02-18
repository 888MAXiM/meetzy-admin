import { Form, Formik, type FormikHelpers } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import mutations from '../../api/mutations'
import { ROUTES, STORAGE_KEYS } from '../../constants'
import { SolidButton } from '../../shared/button/SolidButton'
import { OTPInput } from '../../shared/formFields'
import type { OtpPayload } from '../../types/auth'
import { getStorage } from '../../utils'
import { toaster } from '../../utils/custom-functions'
import { otpSchema } from '../../utils/validation-schemas'
import ResendOtp from './ResendOtp'
import { useOtpCooldown } from './useOtpCooldown'

const VerifyOtpForm = () => {
  const storage = getStorage()
  const navigate = useNavigate()
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''))

  const forgotPasswordEmail = storage.getItem(STORAGE_KEYS.FORGOT_PASSWORD_EMAIL) || null
  const { mutate: verifyOtp, isPending } = mutations.useVerifyOtp()

  const { resendDisabled, coolDown, handleResendOtp, resendOtpLoading } = useOtpCooldown(forgotPasswordEmail)

  const handleSubmit = async (values: OtpPayload, _formikHelpers: FormikHelpers<OtpPayload>) => {
    if (!forgotPasswordEmail) {
      toaster('error', 'Email not found. Please restart the password reset process.')
      navigate(ROUTES.FORGOT_PASSWORD)
      return
    }

    verifyOtp(
      {
        identifier: forgotPasswordEmail,
        otp: values.otp,
      },
      {
        onSuccess: () => {
          storage.setItem(STORAGE_KEYS.OTP_TOKEN, values.otp)
          navigate(ROUTES.SET_NEW_PASSWORD)
          toaster('success', 'Otp verified successfully')
        },
      },
    )
  }

  return (
    <Formik initialValues={{ otp: '' }} validationSchema={otpSchema} onSubmit={handleSubmit}>
      {({ setFieldValue }) => (
        <Form className="otp-form">
          <OTPInput
            val={otpValues}
            setVal={(val) => {
              setOtpValues(val)
              setFieldValue('otp', val.join(''))
            }}
            submitForm={(values, helpers) => handleSubmit(values, helpers)}
          />

          <ResendOtp
            resendDisabled={resendDisabled}
            coolDown={coolDown}
            resendOtpLoading={resendOtpLoading}
            onResendOtp={handleResendOtp}
          />

          <SolidButton loading={isPending} title="verify" type="submit" color="primary" className="w-100 Login-btn" />
        </Form>
      )}
    </Formik>
  )
}

export default VerifyOtpForm

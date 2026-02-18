import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { queries } from '../../api'
import post from '../../api/post'
import { ROUTES, URL_KEYS } from '../../constants'
import { useAppDispatch } from '../../redux/hooks'
import { loginSuccess } from '../../redux/reducers/authSlice'
import { SolidButton } from '../../shared/button/SolidButton'
import TextInput from '../../shared/formFields/TextInput'
import type { LoginPayload } from '../../types/auth'
import { getParam } from '../../utils'
import { toaster } from '../../utils/custom-functions'
import { loginValidationSchema } from '../../utils/validation-schemas'
import LoginTable from './Login'

const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const returnUrl = getParam('returnUrl')
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const { data: demoData } = queries.useGetDemoStatus()
  const isDemoMode = demoData?.demo === true

  const handleSubmit = async (values: LoginPayload) => {
    try {
      setLoading(true)
      const result = await post(URL_KEYS.Auth.Login, values)
      dispatch(loginSuccess(result))
      setLoading(false)
      navigate(returnUrl ? returnUrl : ROUTES.DASHBOARD)
      toaster('success', 'Login successful.')
    } catch {
      setLoading(false)
    }
  }

  return (
    <Formik
      initialValues={{
        identifier: '',
        password: '',
      }}
      validationSchema={loginValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <>
          <Form className="login-form">
            <TextInput
              label="email_or_phone"
              iconProps={{ iconId: 'messages', className: 'form-icon' }}
              name="identifier"
              type="text"
              placeholder="admin@example.com"
            />
            <TextInput
              iconProps={{ iconId: 'lock', className: 'form-icon' }}
              name="password"
              label="password"
              type="password"
              placeholder="*********"
            />
            <div className="forgot-pass">
              <Link to={ROUTES.FORGOT_PASSWORD} className="small forgot-link">
                {t('forgot_password')}
              </Link>
            </div>
            <SolidButton title="Login" type="submit" color="primary" className="w-100 Login-btn" loading={loading} />
          </Form>

          {isDemoMode && <LoginTable setFieldValue={setFieldValue} />}
        </>
      )}
    </Formik>
  )
}

export default LoginForm

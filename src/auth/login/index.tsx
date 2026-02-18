import { useTranslation } from 'react-i18next'
import AuthWrapper from '../widgets/AuthWrapper'
import LoginForm from './LoginForm'

const Login = () => {
  const { t } = useTranslation()
  return (
    <AuthWrapper>
      <div className="content-title d-flex flex-column justify-content-center">
        <h3>{t('hello_everyone_we_are_meetzy')}</h3>
        <p>{t('welcome_to_meetzy_please_login_to_your_account')}</p>
      </div>
      <LoginForm />
    </AuthWrapper>
  )
}

export default Login

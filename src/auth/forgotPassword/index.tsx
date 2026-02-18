import { useTranslation } from 'react-i18next'
import AuthWrapper from '../widgets/AuthWrapper'
import ForgotPasswordForm from './ForgotPasswordForm'

const ForgotPassword = () => {
  const { t } = useTranslation()
  return (
    <AuthWrapper showBackBtn>
      <div className="content-title">
        <h3>{t('need_a_password_reset')}</h3>
      </div>
      <p>{t('forget_your_password_lets_reset_it_just_a_few_steps')}</p>
      <ForgotPasswordForm />
    </AuthWrapper>
  )
}

export default ForgotPassword

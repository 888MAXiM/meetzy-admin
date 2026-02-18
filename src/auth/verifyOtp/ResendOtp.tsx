import { useTranslation } from 'react-i18next'
import type { ResendOtpProps } from '../../types/auth'

const ResendOtp = ({ resendDisabled, coolDown, resendOtpLoading, onResendOtp }: ResendOtpProps) => {
  const { t } = useTranslation()

  return (
    <p className="pin-resend-message">
      {t('didnt_receive_the_pin')}{' '}
      <a className={`resend ${resendDisabled ? 'disabled' : ''}`} onClick={!resendDisabled ? onResendOtp : undefined}>
        {resendDisabled && !resendOtpLoading ? `${t('resend_in')} ${coolDown}s` : t('resend_PIN')}
      </a>
    </p>
  )
}

export default ResendOtp

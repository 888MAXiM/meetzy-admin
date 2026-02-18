import { useState, useEffect } from 'react'
import { toaster } from '../../utils/custom-functions'
import { getStorage } from '../../utils'
import { STORAGE_KEYS } from '../../constants'
import mutations from '../../api/mutations'

export const useOtpCooldown = (forgotPasswordEmail: string | null) => {
  const coolDownSeconds = 60
  const [resendDisabled, setResendDisabled] = useState(false)
  const [coolDown, setCoolDown] = useState(0)
  const storage = getStorage()

  const { mutate: resendOtp, isPending: resendOtpLoading } = mutations.useResendOtp()

  const handleResendOtp = () => {
    if (!forgotPasswordEmail) {
      toaster('error', 'Email not found. Please restart the password reset process.')
      return
    }

    setResendDisabled(true)
    resendOtp(
      { identifier: forgotPasswordEmail },
      {
        onSuccess: () => {
          toaster('success', 'New OTP sent successfully')
          const now = Date.now()
          storage.setItem(STORAGE_KEYS.RESEND_COOLDOWN_KEY, now.toString())
          setCoolDown(coolDownSeconds)

          const interval = setInterval(() => {
            setCoolDown((prev) => {
              if (prev <= 1) {
                clearInterval(interval)
                setResendDisabled(false)
                return 0
              }
              return prev - 1
            })
          }, 1000)
        },
        onError: () => {
          setResendDisabled(false)
        },
      },
    )
  }

  useEffect(() => {
    const lastSent = storage.getItem(STORAGE_KEYS.RESEND_COOLDOWN_KEY)
    if (lastSent) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSent)) / 1000)
      if (elapsed < coolDownSeconds) {
        const remaining = coolDownSeconds - elapsed
        setCoolDown(remaining)
        setResendDisabled(true)

        const interval = setInterval(() => {
          setCoolDown((prev) => {
            if (prev <= 1) {
              clearInterval(interval)
              setResendDisabled(false)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(interval)
      }
    }
  }, [storage])

  return {
    resendDisabled,
    coolDown,
    handleResendOtp,
    resendOtpLoading,
  }
}

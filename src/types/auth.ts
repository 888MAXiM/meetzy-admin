import type { ReactNode } from 'react'

export interface AuthWrapperProps {
  children: ReactNode
  showBackBtn?: boolean
}

export interface LoginPayload {
  identifier?: string
  email?:string
  password: string
}

export interface LoginResponse {
  token: string
  user?: {
    id: number
    name: string
    email: string
  }
}

export interface EmailPayload {
  email: string
}

export interface OtpPayload {
  otp: string
  email?: string | null
}

export interface ResetPasswordFormValues {
  otp?: string
  email?: string
  password: string
}

export interface OtpPayload {
  otp: string
  email?: string | null
}

export interface ResendOtpProps {
  resendDisabled: boolean
  coolDown: number
  resendOtpLoading: boolean
  onResendOtp: () => void
}

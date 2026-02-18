export interface SettingFormValues {
  site_name: string
  site_description: string
  logo_light: string | null
  logo_dark: string
  favicon: string
  sidebar_logo: string
  otp_digits: string | number
  otp_expiration_minutes: string
  company_address: string
  contact_email: string
  contact_phone: string
  no_internet_title: string
  no_internet_content: string
  no_internet_image: string
  page_404_title: string
  page_404_content: string
  page_404_image: string
  e2e_encryption_enabled: boolean
  maintenance_mode: boolean
  maintenance_image: string
  maintenance_title: string
  maintenance_message: string
  favicon_notification_logo: string
  onboarding_logo: string
  landing_logo: string
  logo_url?: string | null
  app_name?: string
  smtp_host?: string | null
  support_email?: string
  smtp_port?: number | string | null
  smtp_user?: string | null
  mail_from_name?: string | null
  mail_from_email?: string | null
  smtp_pass?: string | null
}

export interface EmailConfiFormValues {
  smtp_host?: string | null
  support_email?: string
  smtp_port?: number | string | null
  smtp_user?: string | null
  mail_from_name?: string | null
  mail_from_email?: string | null
  smtp_pass?: string | null
  mail_encryption: string
}

export interface UsageControlFormValues {
  app_name: string
  app_description: string
  no_internet_title: string
  no_internet_content: string
  page_404_title: string
  page_404_content: string
  maintenance_title: string
  maintenance_message: string
  maintenance_allowed_ips: []
  sms_gateway: string
  default_language?: string
}

export interface UsageOptionFormValues {
  e2e_encryption_enabled: boolean
  maintenance_mode: boolean
  display_customizer: boolean
  audio_calls_enabled: boolean
  video_calls_enabled: boolean
  allow_archive_chat: boolean
  allow_media_send: boolean
  allow_screen_share: boolean
  allow_status: boolean
  allow_user_signup: boolean
}

export interface FrontendSettingsFormValues {
  favicon: string | null
  logo_light: string
  logo_dark: string
  sidebar_logo: string
  mobile_logo: string
  landing_logo: string
  favicon_notification_logo: string
  onboarding_logo: string
  maintenance_image: string
  page_404_image: string
  no_internet_image: string
  svg_color: string
}

export interface MediaSettingsFormValues {
  document_file_limit: string | number
  audio_file_limit: string | number
  video_file_limit: string | number
  image_file_limit: string | number
  multiple_file_share_limit: string | number
  maximum_message_length: string | number
  allowed_file_upload_types: string | string[]
  call_timeout_seconds: string | number
  session_expiration_days: number | string
  status_expiry_time: number | string
  max_groups_per_user: number | string
  max_group_members: number | string
}

export interface SMSGatewayConfig {
  account_sid?: string
  auth_token?: string
  from?: string
}

export interface SMSGateway {
  id: number
  name: string
  config: SMSGatewayConfig
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface SMSGatewayListResponse {
  data: SMSGateway[]
  total?: number
}

export interface CreateGatewayPayload {
  name: string
  config: SMSGatewayConfig
  enabled?: boolean
}

export interface UpdateGatewayPayload {
  name?: string
  config?: SMSGatewayConfig
  enabled?: boolean
}

export interface TwilioFormValues {
  account_sid: string
  auth_token: string
  from: string
  twilioStatus: boolean
}
export interface TestMailFormValues {
  to?: string | null
}

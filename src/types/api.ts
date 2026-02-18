export type ResponseParserWrapper<T> = {
  data: T
  status: number
  message: string
}

export interface Message {
  code: string
  message: string
  values: string[]
}

export type DefaultErrorResponse = ResponseParserWrapper<Message[]>

export type FormErrorResponse = ResponseParserWrapper<Record<string, { code: string; values: string[] }[]>>

export type CombinedErrorResponse = DefaultErrorResponse | FormErrorResponse

export interface Params {
  [key: string]: unknown
}

export interface ResetPasswordPayload {
  new_password: string
  identifier: string
  otp: string
}

export interface UpdatePasswordPayload {
  password: string
  old_password: string
}

export interface SingleUser {
  id: string
  action: string
  avatar: string
  name: string
  email: string
  country_code: string
  phone: string
  role: 'super_admin' | 'admin' | 'user' | string
  email_verified: boolean
  last_login: string
  created_at: string
  status: string
  is_verified?: boolean
}

export interface UserListResponse {
  total: number
  page: number
  limit: number
  users: SingleUser[]
}

export interface AccountResponse {
  user: {
    id: number
    name: string
    bio: string
    profile_color: string
    avatar: string | null
    email: string
    role: string
    country: string | null
    country_code: string | null
    phone: string
    status: string
  }
}

export interface AccountPayload {
  name?: string
  avatar?: string
  phone?: string
  country?: string
  country_code?: string
  email?: string
}

export interface UpdateProfileResponse {
  message: string
  user?: {
    id: number
    name: string
    email: string
    avatar?: string
  }
}

export type PageStatus = boolean

export interface SingleFAQ {
  id: number
  title: string
  description: string
  status: PageStatus
  created_at: string
  updated_at: string
}

export interface FAQListResponse {
  message: string
  faqs: SingleFAQ[]
  total: number
  page: number
  limit: number
}

export interface CreateFAQPayload {
  title: string
  description: string
  status?: PageStatus
}

export interface UpdateFAQPayload {
  title: string
  description: string
  status?: PageStatus
}

export interface WallpapersListResponse {
  message: string
  wallpapers: SingleWallpaper[]
  total: number
  page: number
  limit: number
}

export interface WallpaperMetadata {
  path: string
  file_size: number
  mime_type: string
  original_name: string
}

export interface SingleWallpaper {
  id: number
  name: string
  wallpaper: string
  status: boolean
  metadata: WallpaperMetadata
  created_at: string
  updated_at: string
  is_default: boolean
}

export interface WallpaperPayload {
  name: string
  wallpaper: File | null
  status?: PageStatus
}

export interface StickersListResponse {
  message: string
  stickers: SingleStickers[]
  total: number
  page: number
  limit: number
}

export interface SingleStickers {
  id: string
  title: string
  sticker: string
  status: boolean
  metadata: WallpaperMetadata
  created_at: string
  updated_at: string
}

export interface StickersPayload {
  title: string
  stickers: File | null
  status?: PageStatus
}

export interface SinglePage {
  id: number
  title: string
  slug: string
  content: string
  status: PageStatus
  created_at: string
  updated_at: string
  created_by: string
}

export interface PageListResponse {
  message: string
  data: {
    total: number
    page: number
    limit: number
    pages: SinglePage[]
  }
}

export interface CreatePagePayload {
  title: string
  slug: string
  content: string
  status: PageStatus
  created_by: string | undefined
}

export interface UpdatePagePayload {
  title: string
  slug: string
  content: string
  status: PageStatus
}

export interface SingleReportedAccounts {
  id: number
  group_id: number | null
  chat_type: 'direct' | 'group' | string
  reason: string
  description: string | null
  status: 'pending' | 'resolved' | 'dismissed' | string
  admin_notes: string | null
  resolved_by: number | null
  resolved_at: string | null
  created_at: string
  updated_at: string
  reporter: Reporter
  reported_user: ReportedUser | null
  group: Group | null
  resolver: Resolver | null
  name: string
  reporter_id: {
    id: number
    name: string
    email: string
    avatar: string | null
  }
  reported_user_id: {
    id: number
    name: string
    email: string
    avatar: string | null
  }
}

export interface ReportedAccountsResponse {
  message: string
  total: number
  page: number
  limit: number
  userReports: SingleReportedAccounts[]
}

export interface Reporter {
  id: number
  name: string
  email: string
  avatar: string | null
}

export interface ReportedUser {
  id: number
  name: string
  email: string
  avatar: string | null
}

export interface Group {
  id?: number
  name?: string
  [key: string]: any
}

export interface Resolver {
  id: number
  name: string
  email: string
}

export interface ReportedAccountsPayload {
  status: string
  admin_notes: string | null
}

export interface SingleContactInquiry {
  id: number
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  updated_at: string
}

export interface ContactInquiryResponse {
  message: string
  total: number
  page: number
  limit: number
  inquiries: SingleContactInquiry[]
}

export interface SingleReportReason {
  id: number
  title: string
  created_at: string
  updated_at: string
}

export interface ReportReasonResponse {
  message: string
  total: number
  page: number
  limit: number
  reports: SingleReportReason[]
}

export interface ReportReasonPayload {
  title: string
}

export interface SettingsResponse {
  settings: {
    id: number
    app_name: string
    app_description: string
    app_email: string
    support_email: string
    favicon_url: string | null
    logo_light_url: string
    logo_dark_url: string
    sidebar_logo_url: string
    mobile_logo_url: string
    landing_logo_url: string
    favicon_notification_logo_url: string
    onboarding_logo_url: string
    e2e_encryption_enabled: boolean
    maintenance_mode: boolean
    maintenance_title: string
    maintenance_message: string
    maintenance_image_url: string
    page_404_title: string
    page_404_content: string
    page_404_image_url: string
    no_internet_title: string
    no_internet_content: string
    no_internet_image_url: string
    smtp_host: string
    smtp_port: number
    smtp_user: string
    smtp_pass: string
    mail_from_name: string
    mail_from_email: string
    default_theme_mode: 'light' | 'dark'
    display_customizer: boolean
    audio_calls_enabled: boolean
    video_calls_enabled: boolean
    allow_archive_chat: boolean
    allow_media_send: boolean
    allow_user_block: boolean
    allow_user_signup: boolean
    call_timeout_seconds: number
    document_file_limit: number
    audio_file_limit: number
    video_file_limit: number
    image_file_limit: number
    multiple_file_share_limit: number
    maximum_message_length: number
    allowed_file_upload_types: string[]
    created_at: string
    updated_at: string
    maintenance_allowed_ips: []
    session_expiration_days: number
    max_groups_per_user: number
    max_group_members: number
    allow_screen_share: boolean
    login_method: string
    time_format: string
    status_expiry_time: string
    allow_status: boolean
    mail_encryption: string
    sms_gateway: string
    auth_method?: string
    svg_color?: string
    default_language: string
  }
}

export interface DashboardResponse {
  success: boolean
  data: DashboardData
  message: string
}

export interface DashboardData {
  counts: DashboardCounts
  charts: DashboardCharts
}

export interface DashboardCounts {
  totalUsers: number
  totalGroups: number
  totalCalls: number
  newUsersThisWeek: number
  totalFileShared: number
  totalMediaShared: number
  totalPendingReports: number
  totalBlockedUsers: number
}

export interface DashboardCharts {
  userLocationDistribution: UserLocationDistribution[]
  userGrowthMonthly: UserGrowthMonthly[]
  reportTypeStats: ReportTypeStat[]
  messageTypeStats: MessageTypeStat[]
  messageActivityStats: MessageActivityStat[]
  messagesByHour: MessageByHour[]
}

export interface UserLocationDistribution {
  country: string
  country_code: string
  user_count: number
  percentage: number
}

export interface UserGrowthMonthly {
  month: string
  new_users: number
  total_users: number
}

export interface ReportTypeStat {
  reason: string
  count: number
}

export interface MessageTypeStat {
  message_type: string
  count: number
}

export interface MessageActivityStat {
  date: string
  count: number
}

export interface MessageByHour {
  hour: number
  count: number
  active_users: number
}

export interface GroupListResponse {
  total: number
  totalPages: number
  page: number
  limit: number
  groups: SingleGroup[]
}

export interface SingleGroup {
  id: number
  name: string
  description: string | null
  avatar: string | null
  created_by: number
  created_at: string
  member_count: number
  creator: Creator
}

export interface Creator {
  id: number
  name: string
  email: string
  avatar: string
}

export interface GroupMember {
  id: number
  name: string
  email: string
  avatar: string | null
  group_role: 'admin' | 'member'
  joined_at: string
  updated_at: string
  user: GroupMember
}

export interface GroupData {
  group_id: number
  group_name: string
  group_avatar: string | null
  members: GroupMember[]
  page: number
  limit: number
  total_pages: number
  total_members: number
}

export interface RemoveMemberResponse {
  message: string
  removed: number[]
  details: string[]
}

export interface SettingsState {
  settings: SettingsState | null
  sidebar_logo_url: string
  logo_light_url: string
  logo_dark_url: string
  mail_encryption: string
}

export interface CustomSMSGatewaysValues {
  name: string
  base_url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string
  auth_type: string[]
  auth_token: string
  account_sid: string
  from_number: string
  custom_keys?: KeyValue[]
  body_fields?: KeyValue[]
}

export interface SmsGatewayResponse {
  data: SmsGateway
}

export interface SmsGateway {
  id: number
  name: string
  base_url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string
  auth_type: string[]
  account_sid: string
  auth_token: string
  from_number: string
  custom_config: CustomConfig
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface CustomConfig {
  params: KeyValue[]
  headers: KeyValue[]
  body_type: 'json' | 'form-data' | 'x-www-form-urlencoded' | string
  body_fields: KeyValue[]
  error_response: ResponseCondition
  field_mappings: FieldMappings
  success_response: ResponseCondition
  form_data: KeyValue[]
  json: string
}

export interface KeyValue {
  field?: string
  key?: string
  value: string
}

export interface ResponseCondition {
  field: string
  value: string | number | boolean
}

export interface FieldMappings {
  to_field: string
  from_field: string
  message_field: string
}

export interface DeleteStatusPayload {
  status_ids: number[]
}

export interface DeleteStatusResponse {
  message: string
}

export interface SponsoredStatusResponse {
  message: string
  total: number
  totalPages: number
  page: number
  limit: number
  statuses: SponsoredStatus[]
}

export interface SponsoredStatus {
  id: number
  user_id: number
  type: 'image' | 'video' | string
  file_url: string
  caption: string | null
  sponsored: boolean
  expires_at: string
  created_at: string
  user: User
}

export interface User {
  id: number
  name: string
  email: string
  avatar: string | null
}

export interface CreateStatusResponse {
  message: string
  status: StatusItem
}

export interface StatusItem {
  id: number
  type: 'text' | 'image' | 'video'
  file_url: string | null
  caption: string | null
  created_at: string
  expires_at: string
  view_count: number
  views: StatusView[]
}

export interface StatusView {
  id: number
  name: string
  avatar: string | null
  viewed_at: string
  viewed_ago: string
  viewer_id: number
  viewer_name: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  phone: string
  countryCode: string
  country?: string
}

export interface AnnouncementMetadata {
  sent_by_admin: number
  redirect_url: string
  announcement_type: string
}

export interface Announcement {
  id: number
  title: string
  content: string
  announcement_type: string
  action_link: string | null
  file_url: string | null
  file_type: string | null
  created_at: string
  metadata: AnnouncementMetadata
}

export interface AnnouncementsResponse {
  message: string
  total: number
  page: number
  limit: number
  announcements: Announcement[]
}
export type PlanStatus = 'active' | 'inactive'
export type BillingCycle = 'monthly' | 'yearly' | 'both'

export interface SinglePlan {
  id: number
  name: string
  slug: string
  description: string | null
  price_per_user_per_month: number
  price_per_user_per_year: number | null
  billing_cycle: BillingCycle
  max_members_per_group: number
  max_broadcasts_list: number
  max_members_per_broadcasts_list: number
  max_status: number
  max_storage_per_user_mb: number
  max_groups: number
  allows_file_sharing: boolean
  video_calls_enabled: boolean
  features: Record<string, any>
  display_order: number
  is_default: boolean
  trial_period_days: number
  status: PlanStatus
  created_at: string
  updated_at: string
}

export interface PlanListResponse {
  message?: string
  data?: {
    total: number
    page: number
    limit: number
    plans: SinglePlan[]
  }
  plans?: SinglePlan[]
  total?: number
  page?: number
  limit?: number
}

export interface CreatePlanPayload {
  name: string
  slug: string
  description?: string | null
  price_per_user_per_month: number
  price_per_user_per_year?: number | null
  billing_cycle: BillingCycle
  max_members_per_group: number
  max_broadcasts_list: number
  max_members_per_broadcasts_list: number
  max_status: number
  max_groups: number
  allows_file_sharing: boolean
  video_calls_enabled?: boolean
  features?: Record<string, any>
  display_order?: number
  is_default?: boolean
  status?: PlanStatus
}

export type UpdatePlanPayload = CreatePlanPayload

export interface VerificationRequest {
  id: number
  request_id: string
  full_name: string
  category: 'individual' | 'business' | 'creator'
  document_type: string | null
  document_front_url: string | null
  document_back_url: string | null
  selfie_url: string | null
  has_documents: boolean
  verification_status: 'pending' | 'approved' | 'rejected' | 'payment_failed'
  verification_source: 'user_paid' | 'subscription' | 'admin_granted'
  submitted_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
    avatar: string | null
    is_verified: boolean
    verified_at: string | null
    verification_type: string | null
    country: string | null
    phone: string | null
    created_at: string
  } | null
  payment: {
    id: number
    amount: string
    currency: string
    payment_gateway: string
    payment_method: string | null
    gateway_order_id: string | null
    gateway_payment_id: string | null
    status: string
    failure_reason: string | null
    completed_at: string | null
    created_at: string
    updated_at: string
  } | null
  subscription: {
    id: number
    status: string
    plan_id: number
    billing_cycle: string
    amount: string
    currency: string
  } | null
  can_approve: boolean
}

export interface VerificationRequestsResponse {
  message: string
  data: VerificationRequest[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
  summary: {
    total_count: number
    pending_count: number
    approved_count: number
    rejected_count: number
    with_documents: number
    with_payment_completed: number
  }
}

export interface ApproveVerificationPayload {
  request_id: string
  admin_notes?: string
}

export interface AdminApproveVerificationPayload {
  user_id: string
  category: 'individual' | 'business' | 'creator'
  admin_notes?: string
  full_name?: string
}

export interface RejectVerificationPayload {
  request_id: string
  rejection_reason: string
  admin_notes?: string
}

export interface SingleLanguage {
  id: number
  name: string
  locale: string
  is_active: boolean
  created_at: string
  updated_at: string
  translation_json: string
  flag?: string
  is_default?: boolean
  metadata?: {
    fileName?: string
  }
}

export interface LanguageListResponse {
  message: string
  data: {
    pages: SingleLanguage[]
    total: number
    totalPages: number
    page: number
    limit: number
  }
}

export interface CreateLanguagePayload {
  name: string
  locale: string
  isActive: boolean
}

export interface UpdateLanguagePayload {
  name: string
  locale: string
  is_active: boolean
}

export interface TranslationResponse {
  translation: {
    id: number
    name: string
    locale: string
    is_active: boolean
    translation_json: Record<string, any>
    created_at: string
    updated_at: string
  }
}

export const BASE_URL = import.meta.env.VITE_API_BASE_URL

const URL = {
  Auth: {
    Login: 'auth/login/password',
    ForgotPassword: 'auth/forgot-password',
    ResetPassword: 'auth/reset-password',
    ResendOtp: 'auth/resend-otp',
    VerifyOtp: 'auth/verify-otp',
    Register: 'auth/register',
  },
  Dashboard: {
    GetDashboard: 'dashboard',
  },
  Profile: {
    Details: 'account/getUserDetails',
    UpdateDetails: 'account/updateProfile',
    UpdatePassword: 'account/updatePassword',
  },
  Users: {
    GetAllUsers: 'user/all',
    DeleteUser: 'user/delete',
    UpdateUserStatus: 'user/:id/update/status',
    UpdateDetails: 'user/update',
    CreateUser: 'user/create',
    Impersonation: 'impersonate/start',
  },
  FAQ: {
    GetAllFaqs: 'faq/all',
    CreateFaq: 'faq/create',
    UpdateFaq: 'faq/:id/update',
    UpdateFaqStatus: 'faq/:id/update/status',
    DeleteFaq: 'faq/delete',
  },
  Wallpapers: {
    GetAllWallpapers: 'wallpaper/all',
    UpdateWallpaperStatus: 'wallpaper/:id/update/status',
    DeleteWallpaper: 'wallpaper/delete',
    CreateWallpaper: 'wallpaper/create',
    UpdateWallpaper: 'wallpaper/:id/update',
  },
  Stickers: {
    GetAllStickers: 'sticker/all',
    UpdateStickersStatus: 'sticker/:id/update/status',
    DeleteStickers: 'sticker/delete',
    CreateStickers: 'sticker/create',
    UpdateStickers: 'sticker/:id/update',
  },
  Page: {
    GetAllPages: 'page',
    CreatePage: 'page/create',
    UpdatePage: 'page/update/:id',
    UpdatePageStatus: 'page/:id/update/status',
    DeletePage: 'page/delete',
  },
  ReportedAccounts: {
    GetAllReportedAccounts: 'user-report/all',
    UpdateReportedAccount: 'user-report/:id/update',
    DeleteReportedAccount: 'user-report/delete',
  },
  ContactInquiries: {
    GetAllContactInquiries: 'inquiry/all',
    DeleteContactInquiries: 'inquiry/delete',
  },
  ReportSettings: {
    GetAllReportSettings: 'report/all',
    CreateReportSettings: 'report/create',
    UpdateReportSettings: 'report/:id/update',
    DeleteReportSettings: 'report/delete',
  },
  Settings: {
    GetSettings: 'setting',
    UpdateSettings: 'setting/update',
  },
  Group: {
    GetAllGroups: 'group/all',
    DeleteGroup: 'group/delete',
    UpdateGroup: 'group/update',
    MembersGroup: 'group/members',
    MembersRoleGroup: 'group/member/update/role',
    RemoveGroupMember: 'group/member/remove',
  },
  SMSGateway: {
    GetAllGateways: 'gateway',
    CreateGateway: 'gateway/create',
    UpdateGateway: 'gateway/update/:id',
    ToggleGatewayStatus: 'gateway/toggle/:id',
  },
  Demo: {
    Demo: 'demo',
  },
  Mail: {
    TestMail: 'send-test-email',
  },
  CustomSMSGateways: {
    getAllGateways: 'custom/sms',
    saveGateway: 'custom/sms/save',
    testGateway: 'custom/sms/test',
  },
  SponsoredStatuses: {
    getSponsoredStatuses: 'status/sponsored',
    Delete: 'status/delete',
    Create: 'status/create',
  },
  Messages: {
    SendMessage: 'announcement/send',
    GetAnnouncement: 'announcement/fetch',
    UpdateAnnouncement: 'announcement/update/:id',
    DeleteAnnouncement: 'announcement/delete',
  },
  Plan: {
    GetAllPlans: 'plan',
    CreatePlan: 'plan/create',
    UpdatePlan: 'plan/update/:id',
    UpdatePlanStatus: 'plan/status/:id',
    SetDefaultPlan: 'plan/set-default/:id',
    DeletePlan: 'plan/delete',
  },
  Verification: {
    GetAllVerificationRequests: 'verification/request/all',
    ApproveVerification: 'verification/request/approve',
    RejectVerification: 'verification/request/reject',
    AdminApprove: 'verification/admin/approve',
    DeleteVerification: 'verification/delete',
  },
  Language: {
    GetAllLanguages: 'language',
    Active: 'language/active',
    CreateLanguage: 'language/create',
    UpdateLanguage: 'language/update/:id',
    UpdateLanguageStatus: 'language/:id/update/status',
    DeleteLanguages: 'language/delete',
    GetTranslation: 'language/:locale/translation',
  },
} as const

export const URL_KEYS: { [K in keyof typeof URL]: { [P in keyof (typeof URL)[K]]: string } } = Object.fromEntries(
  Object.entries(URL).map(([key, subKeys]) => [
    key,
    Object.fromEntries(Object.entries(subKeys).map(([subKey, path]) => [subKey, `${BASE_URL}${path}`])),
  ]),
) as {
  [K in keyof typeof URL]: { [P in keyof (typeof URL)[K]]: string }
}

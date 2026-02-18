import { KEYS, URL_KEYS } from '../constants'
import type {
  AccountPayload,
  CreateFAQPayload,
  CreatePagePayload,
  CreatePlanPayload,
  CreateStatusResponse,
  DeleteStatusPayload,
  DeleteStatusResponse,
  Message,
  RemoveMemberResponse,
  ReportedAccountsPayload,
  ReportReasonPayload,
  ResetPasswordPayload,
  StickersPayload,
  UpdateFAQPayload,
  UpdatePagePayload,
  UpdatePasswordPayload,
  UpdatePlanPayload,
  UpdateProfileResponse,
  WallpaperPayload,
  ApproveVerificationPayload,
  AdminApproveVerificationPayload,
  RejectVerificationPayload,
} from '../types/api'
import { CreateGatewayPayload, SMSGateway, TestMailFormValues, UpdateGatewayPayload } from '../types/settings'
import remove from './delete'
import { useApiPost } from './hooks'
import post from './post'
import put from './put'

const mutations = {
  useRequestForgotPassword: () =>
    useApiPost<{ identifier: string }, void>([KEYS.SEND_PASSWORD_EMAIL], (input) =>
      post(URL_KEYS.Auth.ForgotPassword, input),
    ),
  useVerifyOtp: () =>
    useApiPost<{ identifier: string | null; otp: string }, void>([KEYS.VERIFY_OTP], (input) =>
      post(URL_KEYS.Auth.VerifyOtp, input),
    ),
  useResendOtp: () =>
    useApiPost<{ identifier: string | null }, void>([KEYS.RESEND_OTP], (input) => post(URL_KEYS.Auth.ResendOtp, input)),
  useResetPassword: () =>
    useApiPost<ResetPasswordPayload, void>([KEYS.RESET_PASSWORD], (input) => post(URL_KEYS.Auth.ResetPassword, input)),
  useUpdatePassword: () =>
    useApiPost<UpdatePasswordPayload, void>([KEYS.PASSWORD_UPDATE], (input) =>
      put(URL_KEYS.Profile.UpdatePassword, input),
    ),
  useUpdateAccountProfile: () =>
    useApiPost<AccountPayload | FormData, UpdateProfileResponse>(
      [KEYS.USER_UPDATE, KEYS.USER],
      (input: AccountPayload | FormData) => put(URL_KEYS.Profile.UpdateDetails, input),
    ),
  useUpdateSetting: () =>
    useApiPost<FormData, void>([KEYS.SETTINGS_UPDATE, KEYS.SETTINGS], (input) =>
      put(URL_KEYS.Settings.UpdateSettings, input),
    ),
  useTestMail: () =>
    useApiPost<TestMailFormValues, void>([KEYS.TEST_MAIL], (input) => post(URL_KEYS.Mail.TestMail, input)),
  useSaveGateway: () => useApiPost([KEYS.SAVE_GATEWAY], (input) => post(URL_KEYS.CustomSMSGateways.saveGateway, input)),
  useTestGateway: () => useApiPost([KEYS.TEST_GATEWAY], (input) => post(URL_KEYS.CustomSMSGateways.testGateway, input)),
  useDeleteUser: () =>
    useApiPost([KEYS.DELETE_USER, KEYS.ALL_USERS], (input: { ids: string[] }) =>
      remove(URL_KEYS.Users.DeleteUser, input),
    ),
  useUpdateUserStatus: () =>
    useApiPost([KEYS.UPDATE_USER_STATUS, KEYS.ALL_USERS], (input: { id: string; status: string }) => {
      const url = URL_KEYS.Users.UpdateUserStatus.replace(':id', `${input.id}`)
      return put(url, { id: input.id, status: input.status })
    }),
  useUpdateProfile: () =>
    useApiPost<AccountPayload | FormData, UpdateProfileResponse>(
      [KEYS.USER_UPDATE, KEYS.USER],
      (input: AccountPayload | FormData) => put(URL_KEYS.Users.UpdateDetails, input),
    ),
  useDeleteFaq: () =>
    useApiPost([KEYS.DELETE_FAQ, KEYS.ALL_FAQS], (input: { ids: number[] }) => remove(URL_KEYS.FAQ.DeleteFaq, input)),
  useUpdateFaqStatus: () =>
    useApiPost([KEYS.UPDATE_FAQ_STATUS, KEYS.ALL_FAQS], (input: { id: number; status: boolean }) => {
      return put(URL_KEYS.FAQ.UpdateFaqStatus.replace(':id', input?.id.toString()), { status: input?.status })
    }),
  useCreateFaq: () =>
    useApiPost<CreateFAQPayload, void>([KEYS.CREATE_FAQ, KEYS.ALL_FAQS], (input) =>
      post(URL_KEYS.FAQ.CreateFaq, input),
    ),
  useUpdateFaq: () =>
    useApiPost<{ id: string; data: UpdateFAQPayload }, void>([KEYS.UPDATE_FAQ, KEYS.ALL_FAQS], ({ id, data }) =>
      put(URL_KEYS.FAQ.UpdateFaq.replace(':id', id), data),
    ),
  useUpdateWallpaperStatus: () =>
    useApiPost(
      [KEYS.UPDATE_WALLPAPER_STATUS, KEYS.ALL_WALLPAPER],
      (input: { id: number; status?: boolean; isDefault?: boolean }) => {
        return put(URL_KEYS.Wallpapers.UpdateWallpaperStatus.replace(':id', input?.id.toString()), {
          status: input.status,
          isDefault: input.isDefault,
        })
      },
    ),
  useDeleteWallpaper: () =>
    useApiPost([KEYS.DELETE_WALLPAPER, KEYS.ALL_WALLPAPER], (input: { ids: number[] }) =>
      remove(URL_KEYS.Wallpapers.DeleteWallpaper, input),
    ),
  useCreateWallpaper: () =>
    useApiPost<WallpaperPayload, void>([KEYS.CREATE_WALLPAPER, KEYS.ALL_WALLPAPER], (input) =>
      post(URL_KEYS.Wallpapers.CreateWallpaper, input),
    ),
  useUpdateWallpaper: () =>
    useApiPost<{ id: number; data: WallpaperPayload }, void>(
      [KEYS.UPDATE_WALLPAPER, KEYS.ALL_WALLPAPER],
      ({ id, data }) => put(URL_KEYS.Wallpapers.UpdateWallpaper.replace(':id', id.toString()), data),
    ),
  useUpdateStickersStatus: () =>
    useApiPost([KEYS.UPDATE_STICKERS_STATUS, KEYS.ALL_STICKERS], (input: { id: string; status: boolean }) => {
      return put(URL_KEYS.Stickers.UpdateStickersStatus.replace(':id', input?.id), {
        status: input?.status,
      })
    }),
  useDeleteStickers: () =>
    useApiPost([KEYS.DELETE_STICKERS, KEYS.ALL_STICKERS], (input: { ids: string[] }) =>
      remove(URL_KEYS.Stickers.DeleteStickers, input),
    ),
  useCreateStickers: () =>
    useApiPost<StickersPayload, void>([KEYS.CREATE_STICKERS, KEYS.STICKERS], (input) =>
      post(URL_KEYS.Stickers.CreateStickers, input),
    ),
  useUpdateStickers: () =>
    useApiPost<{ id: string; data: StickersPayload }, void>([KEYS.UPDATE_STICKERS, KEYS.STICKERS], ({ id, data }) =>
      put(URL_KEYS.Stickers.UpdateStickers.replace(':id', id), data),
    ),
  useCreatePage: () =>
    useApiPost<CreatePagePayload, void>([KEYS.CREATE_PAGE, KEYS.ALL_PAGES], (input) =>
      post(URL_KEYS.Page.CreatePage, input),
    ),
  useUpdatePage: () =>
    useApiPost<{ id: string; data: UpdatePagePayload }, void>([KEYS.UPDATE_PAGE, KEYS.ALL_PAGES], ({ id, data }) =>
      put(URL_KEYS.Page.UpdatePage.replace(':id', id.toString()), data),
    ),
  useDeletePage: () =>
    useApiPost([KEYS.DELETE_PAGE, KEYS.ALL_PAGES], (input: { ids: number[] }) =>
      remove(URL_KEYS.Page.DeletePage, input),
    ),
  useUpdatePageStatus: () =>
    useApiPost([KEYS.UPDATE_PAGE_STATUS, KEYS.ALL_PAGES], (input: { id: number; status: boolean }) => {
      return put(URL_KEYS.Page.UpdatePageStatus.replace(':id', input?.id.toString()), { status: input?.status })
    }),
  useUpdateReportedAccounts: () =>
    useApiPost<{ id: number | string; data: ReportedAccountsPayload }, void>(
      [KEYS.UPDATE_REPORTED_ACCOUNTS, KEYS.ALL_REPORTED_ACCOUNTS],
      ({ id, data }) => put(URL_KEYS.ReportedAccounts.UpdateReportedAccount.replace(':id', id.toString()), data),
    ),
  useDeleteReportedAccounts: () =>
    useApiPost([KEYS.DELETE_REPORTED_ACCOUNTS, KEYS.ALL_REPORTED_ACCOUNTS], (input: { ids: number[] }) =>
      remove(URL_KEYS.ReportedAccounts.DeleteReportedAccount, input),
    ),
  useDeleteContactInquiries: () =>
    useApiPost([KEYS.DELETE_CONTACT_INQUIRIES, KEYS.ALL_CONTACT_INQUIRIES], (input: { ids: number[] }) =>
      remove(URL_KEYS.ContactInquiries.DeleteContactInquiries, input),
    ),
  useDeleteReportSettings: () =>
    useApiPost([KEYS.DELETE_REPORT_SETTINGS, KEYS.ALL_REPORT_SETTINGS], (input: { ids: number[] }) =>
      remove(URL_KEYS.ReportSettings.DeleteReportSettings, input),
    ),
  useCreateReportSettings: () =>
    useApiPost<ReportReasonPayload, void>([KEYS.CREATE_REPORT_SETTINGS, KEYS.ALL_REPORT_SETTINGS], (input) =>
      post(URL_KEYS.ReportSettings.CreateReportSettings, input),
    ),
  useUpdateReportSettings: () =>
    useApiPost<{ id: string; data: ReportReasonPayload }, void>(
      [KEYS.UPDATE_REPORT_SETTINGS, KEYS.ALL_REPORT_SETTINGS],
      ({ id, data }) => put(URL_KEYS.ReportSettings.UpdateReportSettings.replace(':id', id.toString()), data),
    ),
  useDeleteGroups: () =>
    useApiPost([KEYS.DELETE_GROUPS, KEYS.ALL_GROUPS], (input: { ids: number[] }) =>
      remove(URL_KEYS.Group.DeleteGroup, input),
    ),
  useUpdateGroupMemberRole: () =>
    useApiPost<{ group_id: string; user_id: number; new_role: string }, void>([KEYS.UPDATE_GROUP_ROLE], (input) =>
      post(URL_KEYS.Group.MembersRoleGroup, input),
    ),
  useRemoveMemberFromGroup: () =>
    useApiPost<{ group_id: number | string; user_ids: number[] | undefined }, RemoveMemberResponse>(
      [KEYS.REMOVE_GROUP_MEMBER],
      (input) => post(URL_KEYS.Group.RemoveGroupMember, input),
    ),
  useUpdateGroups: () =>
    useApiPost([KEYS.UPDATE_GROUPS, KEYS.ALL_GROUPS], (input) => put(URL_KEYS.Group.UpdateGroup, input)),

  useCreateSMSGateway: () =>
    useApiPost<CreateGatewayPayload, { message: string; gateway: SMSGateway }>(
      [KEYS.CREATE_SMS_GATEWAY, KEYS.ALL_SMS_GATEWAYS],
      (input) => post(URL_KEYS.SMSGateway.CreateGateway, input),
    ),

  useUpdateSMSGateway: () =>
    useApiPost<{ id: number; data: UpdateGatewayPayload }, { message: string; gateway: SMSGateway }>(
      [KEYS.UPDATE_SMS_GATEWAY, KEYS.ALL_SMS_GATEWAYS],
      ({ id, data }) => put(URL_KEYS.SMSGateway.UpdateGateway.replace(':id', id.toString()), data),
    ),

  useToggleSMSGatewayStatus: () =>
    useApiPost<{ id: number; enabled: boolean }, { message: string; gateway: SMSGateway }>(
      [KEYS.UPDATE_SMS_GATEWAY_STATUS, KEYS.ALL_SMS_GATEWAYS],
      (input) =>
        post(URL_KEYS.SMSGateway.ToggleGatewayStatus.replace(':id', input.id.toString()), {
          enabled: input.enabled,
        }),
    ),
  useDeleteStatus: () =>
    useApiPost<DeleteStatusPayload, DeleteStatusResponse>([KEYS.DELETE_STATUS], (input) =>
      remove(URL_KEYS.SponsoredStatuses.Delete, input),
    ),
  useCreateStatus: () =>
    useApiPost<FormData, CreateStatusResponse>([KEYS.CREATE_STATUS], (input) =>
      post(URL_KEYS.SponsoredStatuses.Create, input),
    ),
  useRegister: () => useApiPost([KEYS.REGISTER], (input) => post(URL_KEYS.Users.CreateUser, input)),
  useSendAnnouncement: () =>
    useApiPost<FormData, { messages: Message[] }>([KEYS.SEND_MESSAGE], (input) =>
      post(URL_KEYS.Messages.SendMessage, input),
    ),
  useUpdateAnnouncements: () =>
    useApiPost<{ id: number; data: FormData }, void>([KEYS.UPDATE_MESSAGE, KEYS.GET_MESSAGE], ({ id, data }) =>
      put(URL_KEYS.Messages.UpdateAnnouncement.replace(':id', `${id}`), data),
    ),
  useDeleteAnnouncement: () =>
    useApiPost([KEYS.DELETE_ANNOUNCEMENT], (input) => remove(URL_KEYS.Messages.DeleteAnnouncement, input)),
  useCreatePlan: () =>
    useApiPost<CreatePlanPayload, void>([KEYS.CREATE_PLAN, KEYS.ALL_PLANS], (input) =>
      post(URL_KEYS.Plan.CreatePlan, input),
    ),
  useUpdatePlan: () =>
    useApiPost<{ id: string; data: UpdatePlanPayload }, void>([KEYS.UPDATE_PLAN, KEYS.ALL_PLANS], ({ id, data }) =>
      put(URL_KEYS.Plan.UpdatePlan.replace(':id', id.toString()), data),
    ),
  useDeletePlan: () =>
    useApiPost([KEYS.DELETE_PLAN, KEYS.ALL_PLANS], (input: { ids: number[] }) => post(URL_KEYS.Plan.DeletePlan, input)),
  useUpdatePlanStatus: () =>
    useApiPost([KEYS.UPDATE_PLAN_STATUS, KEYS.ALL_PLANS], (input: { id: number; status: string }) => {
      return put(URL_KEYS.Plan.UpdatePlanStatus.replace(':id', input?.id.toString()), { status: input?.status })
    }),
  useSetDefaultPlan: () =>
    useApiPost([KEYS.SET_DEFAULT_PLAN, KEYS.ALL_PLANS], (input: { id: number }) => {
      return put(URL_KEYS.Plan.SetDefaultPlan.replace(':id', input?.id.toString()), {})
    }),
  useApproveVerification: () =>
    useApiPost<ApproveVerificationPayload, { message: string; data: any }>(
      [KEYS.APPROVE_VERIFICATION, KEYS.ALL_VERIFICATION_REQUESTS],
      (input) => post(URL_KEYS.Verification.ApproveVerification, input),
    ),
  useRejectVerification: () =>
    useApiPost<RejectVerificationPayload, { message: string; data: any }>(
      [KEYS.REJECT_VERIFICATION, KEYS.ALL_VERIFICATION_REQUESTS],
      (input) => post(URL_KEYS.Verification.RejectVerification, input),
    ),
  useAdminApproveVerification: () =>
    useApiPost<AdminApproveVerificationPayload, { success: boolean; message: string; data: any }>(
      [KEYS.ADMIN_APPROVE_VERIFICATION, KEYS.ALL_USERS],
      (input) => post(URL_KEYS.Verification.AdminApprove, input),
    ),
  useCreateLanguage: () =>
    useApiPost<FormData, void>([KEYS.CREATE_LANGUAGE, KEYS.ALL_LANGUAGES], (input) =>
      post(URL_KEYS.Language.CreateLanguage, input),
    ),
  useUpdateLanguage: () =>
    useApiPost<{ id: string; data: FormData }, void>([KEYS.UPDATE_LANGUAGE, KEYS.ALL_LANGUAGES], ({ id, data }) =>
      put(URL_KEYS.Language.UpdateLanguage.replace(':id', id.toString()), data),
    ),
  useUpdateLanguageStatus: () =>
    useApiPost([KEYS.UPDATE_LANGUAGE_STATUS, KEYS.ALL_LANGUAGES], (input: { id: number; status: boolean }) => {
      return put(URL_KEYS.Language.UpdateLanguageStatus.replace(':id', input?.id.toString()), {
        status: input?.status,
      })
    }),
  useDeleteLanguages: () =>
    useApiPost([KEYS.DELETE_LANGUAGES, KEYS.ALL_LANGUAGES], (input: { ids: number[] }) =>
      remove(URL_KEYS.Language.DeleteLanguages, input),
    ),
  useStartImpersonation: () =>
    useApiPost<{ targetUserId: string }, { message: string; token: string }>([KEYS.START_IMPERSONATION], (input) =>
      post(URL_KEYS.Users.Impersonation, input),
    ),
  useDeleteVerification: () =>
    useApiPost([KEYS.DELETE_VERIFICATION_REQUEST], (input: { ids: string[] }) =>
      remove(URL_KEYS.Verification.DeleteVerification, input),
    ),
}

export default mutations

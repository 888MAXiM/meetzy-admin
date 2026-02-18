import type { UseQueryOptions } from '@tanstack/react-query'
import { KEYS, URL_KEYS } from '../constants'
import type {
  AccountResponse,
  AnnouncementsResponse,
  CombinedErrorResponse,
  ContactInquiryResponse,
  DashboardResponse,
  FAQListResponse,
  GroupData,
  GroupListResponse,
  PageListResponse,
  Params,
  PlanListResponse,
  ReportedAccountsResponse,
  ReportReasonResponse,
  SettingsResponse,
  SmsGatewayResponse,
  SponsoredStatusResponse,
  StickersListResponse,
  UserListResponse,
  VerificationRequestsResponse,
  WallpapersListResponse,
  LanguageListResponse,
  TranslationResponse,
} from '../types/api'
import { SMSGateway } from '../types/settings'
import get from './get'
import { useApiGet } from './hooks'

const queries = {
  useGetUserDetails: () => useApiGet<AccountResponse>([KEYS.USER], () => get(URL_KEYS.Profile.Details)),
  useGetUsers: (params: Params) =>
    useApiGet<UserListResponse>([KEYS.ALL_USERS, params], () => get(URL_KEYS.Users.GetAllUsers, params)),
  useGetFaqs: (params: Params) =>
    useApiGet<FAQListResponse>([KEYS.ALL_FAQS, params], () => get(URL_KEYS.FAQ.GetAllFaqs, params)),
  useGetWallpapers: (params: Params) =>
    useApiGet<WallpapersListResponse>([KEYS.ALL_WALLPAPER, params], () =>
      get(URL_KEYS.Wallpapers.GetAllWallpapers, params),
    ),
  useGetStickers: (params: Params) =>
    useApiGet<StickersListResponse>([KEYS.STICKERS, params], () => get(URL_KEYS.Stickers.GetAllStickers, params)),
  useGetPages: (params: Params) =>
    useApiGet<PageListResponse>([KEYS.ALL_PAGES, params], () => get(URL_KEYS.Page.GetAllPages, params)),
  useGetReportedAccounts: (params: Params) =>
    useApiGet<ReportedAccountsResponse>([KEYS.ALL_REPORTED_ACCOUNTS, params], () =>
      get(URL_KEYS.ReportedAccounts.GetAllReportedAccounts, params),
    ),
  useGetContactInquiries: (params: Params) =>
    useApiGet<ContactInquiryResponse>([KEYS.ALL_CONTACT_INQUIRIES, params], () =>
      get(URL_KEYS.ContactInquiries.GetAllContactInquiries, params),
    ),
  useGetReportSettings: (params: Params) =>
    useApiGet<ReportReasonResponse>([KEYS.ALL_REPORT_SETTINGS, params], () =>
      get(URL_KEYS.ReportSettings.GetAllReportSettings, params),
    ),
  useGetSettings: () =>
    useApiGet<SettingsResponse>([KEYS.SETTINGS], () => get(URL_KEYS.Settings.GetSettings), {
      staleTime: 1000 * 60 * 60,
    }),
  useGetDashboard: () => useApiGet<DashboardResponse>([KEYS.ALL_USERS], () => get(URL_KEYS.Dashboard.GetDashboard)),
  useGetGroups: (params: Params) =>
    useApiGet<GroupListResponse>([KEYS.ALL_GROUPS, params], () => get(URL_KEYS.Group.GetAllGroups, params)),
  useGetGroupMembers: (
    params?: Params,
    options?: Omit<UseQueryOptions<GroupData, CombinedErrorResponse, GroupData, unknown[]>, 'queryKey' | 'queryFn'>,
  ) =>
    useApiGet<GroupData, Params>([KEYS.GET_GROUP_MEMBERS, params], () => get(URL_KEYS.Group.MembersGroup, params), {
      ...options,
    }),
  useGetDemoStatus: (
    options?: Omit<
      UseQueryOptions<{ demo: boolean }, CombinedErrorResponse, { demo: boolean }, unknown[]>,
      'queryKey' | 'queryFn'
    >,
  ) =>
    useApiGet<{ demo: boolean }>([KEYS.DEMO_STATUS], () => get(URL_KEYS.Demo.Demo), {
      staleTime: 1000 * 60 * 60,
      ...options,
    }),
  useGetSMSGateways: (params?: Params) =>
    useApiGet<SMSGateway[]>([KEYS.ALL_SMS_GATEWAYS, params], () => get(URL_KEYS.SMSGateway.GetAllGateways, params)),
  useGetAllGateways: () =>
    useApiGet<SmsGatewayResponse>([KEYS.ALL_GATEWAY], () => get(URL_KEYS.CustomSMSGateways.getAllGateways)),
  useGetSponsoredStatuses: (params: Params) =>
    useApiGet<SponsoredStatusResponse>([KEYS.GET_SPONSORED_STATUSES, params], () =>
      get(URL_KEYS.SponsoredStatuses.getSponsoredStatuses, params),
    ),
  useGetAnnouncements: (params: Params) =>
    useApiGet<AnnouncementsResponse>([KEYS.GET_MESSAGE, params], () => get(URL_KEYS.Messages.GetAnnouncement, params)),
  useGetPlans: (params: Params) =>
    useApiGet<PlanListResponse>([KEYS.ALL_PLANS, params], () => get(URL_KEYS.Plan.GetAllPlans, params)),
  useGetVerificationRequests: (params: Params) =>
    useApiGet<VerificationRequestsResponse>([KEYS.ALL_VERIFICATION_REQUESTS, params], () =>
      get(URL_KEYS.Verification.GetAllVerificationRequests, params),
    ),
  useGetLanguages: (params: Params) =>
    useApiGet<LanguageListResponse>([KEYS.ALL_LANGUAGES, params], () => get(URL_KEYS.Language.GetAllLanguages, params)),
  useGetTranslation: (locale: string, enabled: boolean = true) =>
    useApiGet<TranslationResponse>(
      [KEYS.GET_TRANSLATION, locale],
      () => get(URL_KEYS.Language.GetTranslation.replace(':locale', locale)),
      {
        enabled: enabled && !!locale,
        staleTime: 1000 * 60 * 60,
        retry: false, // Don't retry if translation not found
      },
    ),
  useFetchActiveLanguages: () =>
    useApiGet<LanguageListResponse>([KEYS.ACTIVE_LANGUAGE], () => get(URL_KEYS.Language.Active)),
}

export default queries

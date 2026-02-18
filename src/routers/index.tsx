import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../auth/login'
import Users from '../components/users'
import { ROUTES } from '../constants'
import Layout from '../layouts'
import ErrorPage from '../pages/ErrorPage'
import PrivateRoutes from './PrivateRoutes'
import PublicRoutes from './PublicRoutes'
import EditUser from '../components/users/EditUser'
import Faqs from '../components/faqs'
import FaqForm from '../components/faqs/FaqForm'
import ChatWallpapers from '../components/chatWallpapers'
import WallpaperForm from '../components/chatWallpapers/WallpaperForm'
import Stickers from '../components/stickers'
import StickersForm from '../components/stickers/StickersForm'
import Pages from '../components/pages'
import PageForm from '../components/pages/PageForm'
import ReportedAccounts from '../components/reportedAccounts'
import ReportedAccountsForm from '../components/reportedAccounts/ReportedAccountsForm'
import ForgotPassword from '../auth/forgotPassword'
import NewPassword from '../auth/newPassword'
import VerifyOtp from '../auth/verifyOtp'
import ContactInquiries from '../components/contactInquiries'
import ReportSettings from '../components/reportSettings'
import ReportSettingsForm from '../components/reportSettings/ReportSettingsForm'
import UserProfile from '../components/userProfile'
import EmailConfiguration from '../components/emailConfiguration'
import GeneralSettings from '../components/generalSettings'
import FrontendSettings from '../components/frontendSettings'
import MediaSettings from '../components/mediaSettings'
import Dashboard from '../components/dashboard'
import Groups from '../components/groups'
import GroupMembers from '../components/groups/GroupMembers'
import GroupForm from '../components/groups/GroupForm'
import SMSGateways from '../components/smsGateways'
import SMSSettings from '../components/customSmsGateways'
import SponsoredStatus from '../components/sponsoredStatus'
import SponsoredStatusForm from '../components/sponsoredStatus/SponsoredStatusForm'
import Announcements from '../components/announcements'
import AnnouncementsForm from '../components/announcements/AnnouncementsForm'
import Plans from '../components/plans'
import PlanForm from '../components/plans/PlansForm'
import VerificationRequests from '../components/verificationRequests'
import Languages from '../components/languages'
import LanguageForm from '../components/languages/LanguageForm'

export const Router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          { path: ROUTES.DASHBOARD, element: <Dashboard /> },
          { path: ROUTES.PROFILE, element: <UserProfile /> },
          { path: ROUTES.USERS, element: <Users /> },
          { path: ROUTES.GROUPS, element: <Groups /> },
          { path: ROUTES.EDIT_GROUP, element: <GroupForm /> },
          { path: ROUTES.MANAGE_MEMBERS, element: <GroupMembers /> },
          { path: ROUTES.EDIT_USERS, element: <EditUser /> },
          { path: ROUTES.CREATE_USER, element: <EditUser /> },
          { path: ROUTES.MANAGE_FAQS, element: <Faqs /> },
          { path: ROUTES.ADD_FAQ, element: <FaqForm /> },
          { path: ROUTES.EDIT_FAQ, element: <FaqForm /> },
          { path: ROUTES.CHAT_WALLPAPERS, element: <ChatWallpapers /> },
          { path: ROUTES.ADD_WALLPAPER, element: <WallpaperForm /> },
          { path: ROUTES.EDIT_WALLPAPER, element: <WallpaperForm /> },
          { path: ROUTES.STICKERS, element: <Stickers /> },
          { path: ROUTES.ADD_STICKERS, element: <StickersForm /> },
          { path: ROUTES.EDIT_STICKERS, element: <StickersForm /> },
          { path: ROUTES.PLANS, element: <Plans /> },
          { path: ROUTES.ADD_PLAN, element: <PlanForm /> },
          { path: ROUTES.EDIT_PLAN, element: <PlanForm /> },
          { path: ROUTES.PAGES, element: <Pages /> },
          { path: ROUTES.ADD_PAGE, element: <PageForm /> },
          { path: ROUTES.EDIT_PAGE, element: <PageForm /> },
          { path: ROUTES.REPORTED_ACCOUNTS, element: <ReportedAccounts /> },
          { path: ROUTES.EDIT_REPORTED_ACCOUNTS, element: <ReportedAccountsForm /> },
          { path: ROUTES.CONTACT_INQUIRIES, element: <ContactInquiries /> },
          { path: ROUTES.REPORT_SETTINGS, element: <ReportSettings /> },
          { path: ROUTES.ADD_REPORT_SETTINGS, element: <ReportSettingsForm /> },
          { path: ROUTES.EDIT_REPORT_SETTINGS, element: <ReportSettingsForm /> },
          { path: ROUTES.EMAIL_CONFIGURATION, element: <EmailConfiguration /> },
          { path: ROUTES.SMS_GATEWAYS, element: <SMSGateways /> },
          { path: ROUTES.CUSTOM_SMS_GATEWAY, element: <SMSSettings /> },
          { path: ROUTES.GENERAL_SETTINGS, element: <GeneralSettings /> },
          { path: ROUTES.FRONTEND_SETTINGS, element: <FrontendSettings /> },
          { path: ROUTES.MEDIA_SETTINGS, element: <MediaSettings /> },
          { path: ROUTES.SPONSORED_STATUS, element: <SponsoredStatus /> },
          { path: ROUTES.ADD_SPONSORED_STATUS, element: <SponsoredStatusForm /> },
          { path: ROUTES.ANNOUNCEMENTS, element: <Announcements /> },
          { path: ROUTES.MAKE_ANNOUNCEMENTS, element: <AnnouncementsForm /> },
          { path: ROUTES.EDIT_ANNOUNCEMENTS, element: <AnnouncementsForm /> },
          { path: ROUTES.VERIFICATION_REQUESTS, element: <VerificationRequests /> },
          { path: ROUTES.LANGUAGES, element: <Languages /> },
          { path: ROUTES.ADD_LANGUAGE, element: <LanguageForm /> },
          { path: ROUTES.EDIT_LANGUAGE, element: <LanguageForm /> },
        ],
      },
    ],
  },
  {
    element: <PublicRoutes />,
    children: [
      { path: ROUTES.LOGIN, element: <Login /> },
      { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
      { path: ROUTES.VERIFY_OTP, element: <VerifyOtp /> },
      { path: ROUTES.SET_NEW_PASSWORD, element: <NewPassword /> },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
])

import { ROUTES } from '../../constants'
import type { MenuItem } from '../../types/layout'

export const SidebarMenuList: MenuItem[] = [
  {
    title: 'dashboard',
    Items: [
      {
        title: 'overview',
        id: 1,
        icon: 'home',
        type: 'link',
        path: ROUTES.DASHBOARD,
      },
    ],
  },
  {
    title: 'user_management',
    Items: [
      {
        title: 'all_users',
        id: 2,
        icon: 'user',
        type: 'link',
        path: ROUTES.USERS,
      },
      {
        title: 'all_groups',
        id: 3,
        icon: 'project-users',
        type: 'link',
        path: ROUTES.GROUPS,
      },
      {
        title: 'reported_accounts',
        id: 4,
        icon: 'reports',
        type: 'link',
        path: ROUTES.REPORTED_ACCOUNTS,
      },
      {
        title: 'verification_requests',
        id: 41,
        icon: 'Verification',
        type: 'link',
        path: ROUTES.VERIFICATION_REQUESTS,
      },
    ],
  },
  {
    title: 'content',
    Items: [
      {
        title: 'pages',
        id: 5,
        icon: 'sample-page',
        type: 'link',
        path: ROUTES.PAGES,
      },
      {
        title: 'faqs',
        id: 6,
        icon: 'error',
        type: 'link',
        path: ROUTES.MANAGE_FAQS,
      },
      {
        title: 'chat_wallpapers',
        id: 7,
        icon: 'chat-wallpaper',
        type: 'link',
        path: ROUTES.CHAT_WALLPAPERS,
      },
      {
        title: 'stickers',
        id: 8,
        icon: 'smile',
        type: 'link',
        path: ROUTES.STICKERS,
      },
      {
        title: 'plans',
        id: 9,
        icon: 'plan',
        type: 'link',
        path: ROUTES.PLANS,
      },
    ],
  },
  {
    title: 'sponsor',
    Items: [
      {
        title: 'sponsored_status',
        id: 10,
        icon: 'sidebar-status',
        type: 'link',
        path: ROUTES.SPONSORED_STATUS,
      },
      {
        title: 'announcements',
        id: 5,
        icon: 'broadcast',
        type: 'link',
        path: ROUTES.ANNOUNCEMENTS,
        iconClass: 'announcements-icon',
      },
    ],
  },
  {
    title: 'communication',
    Items: [
      {
        title: 'contact_inquiries',
        id: 11,
        icon: 'authenticate',
        type: 'link',
        path: ROUTES.CONTACT_INQUIRIES,
      },
      {
        title: 'email_configuration',
        id: 10,
        icon: 'email',
        type: 'link',
        path: ROUTES.EMAIL_CONFIGURATION,
      },
    ],
  },
  {
    title: 'system_settings',
    Items: [
      {
        title: 'general_settings',
        id: 11,
        icon: 'setting',
        type: 'link',
        path: ROUTES.GENERAL_SETTINGS,
      },
      {
        title: 'languages',
        id: 17,
        icon: 'language',
        type: 'link',
        path: ROUTES.LANGUAGES,
      },
      {
        title: 'sms_gateways',
        id: 12,
        icon: 'sms-icon',
        type: 'link',
        path: ROUTES.SMS_GATEWAYS,
      },
      {
        title: 'custom_sms_gateways',
        id: 13,
        icon: 'sms-custom',
        type: 'link',
        path: ROUTES.CUSTOM_SMS_GATEWAY,
      },
      {
        title: 'frontend_settings',
        id: 14,
        icon: 'logos',
        type: 'link',
        path: ROUTES.FRONTEND_SETTINGS,
      },
      {
        title: 'media_chat_settings',
        id: 15,
        icon: 'custom-sms',
        type: 'link',
        path: ROUTES.MEDIA_SETTINGS,
      },
      {
        title: 'report_settings',
        id: 16,
        icon: 'coming-soon',
        type: 'sub',
        path: ROUTES.REPORT_SETTINGS,
      },
    ],
  },
]

import type { FormikHelpers } from 'formik'
import type { ChangeEvent } from 'react'
import type { NavigateFunction } from 'react-router-dom'
import type { AccountPayload, CombinedErrorResponse, SingleUser, UpdateProfileResponse } from './api'

export interface EditProfileFormValues {
  first_name: string
  last_name?: string
  country_code: string
  phone: string
  email?: string
  bio: string
  avatar?: string
}

export interface EditChannelFormValues {
  name: string
  email?: string
  avatar?: string
  description?: string
}

export interface EditProfileProps {
  profileImageFile: File | null
  removeAvatar: boolean
}

export interface UpdatePasswordFormValues {
  new_password: string
  old_password: string
  confirm_password: string
}

export interface EditChannelProfileProps {
  setAvatar: (file: File | null) => void
  removeAvatar: boolean
  setRemoveAvatar: (remove: boolean) => void
}

export interface LocationState {
  userData?: SingleUser
}

export interface FormValues {
  first_name: string
  last_name?: string
  phone: string
  country_code: string
  email: string
  password: string
}

export type UpdateProfileMutation = (
  data: FormData | AccountPayload,
  options?: {
    onSuccess?: (response: UpdateProfileResponse) => void
    onError?: (error: CombinedErrorResponse) => void
  },
) => void

export type SubmitHandler = (
  values: FormValues,
  userData: SingleUser | undefined,
  avatar: File | null,
  removeAvatar: boolean,
  navigate: NavigateFunction,
  helpers: FormikHelpers<FormValues>,
) => Promise<void>

export interface EditUserProfileProps {
  userData?: SingleUser
  avatarPreview: string | null
  removeAvatar: boolean
  hasAvatar: boolean
  onAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void
  onRemoveAvatar: () => void
}

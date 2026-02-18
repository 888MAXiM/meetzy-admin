import { type NavigateFunction } from 'react-router-dom'
import { Announcement } from './api'

export interface FormValues {
  title: string
  message: string
  media: string | File | null
  link?: string
  additionalKey?: string
  redirectURL?: string
}

export type SubmitHandler = (
  values: FormValues,
  isEdit: boolean,
  avatar: File | null,
  id: string | undefined,
  navigate: NavigateFunction,
  setSubmitting: (isSubmitting: boolean) => void,
  removeAvatar: boolean,
  AnnounceData: Announcement,
) => void

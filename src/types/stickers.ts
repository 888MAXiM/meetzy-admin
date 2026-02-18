import { type NavigateFunction } from 'react-router-dom'

export interface FormValues {
  name: string
  stickers: string | File | null
  statusSwitch: boolean
}

export type SubmitHandler = (
  values: FormValues,
  isEdit: boolean,
  avatar: File | null,
  id: string | undefined,
  navigate: NavigateFunction,
  setSubmitting: (isSubmitting: boolean) => void,
  removeAvatar: boolean,
) => void

import { type NavigateFunction } from 'react-router-dom'

export interface FormValues {
  name: string
  description: string | null
  avatar: string | File | null
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

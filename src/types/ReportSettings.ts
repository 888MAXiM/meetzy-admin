import { type NavigateFunction } from 'react-router-dom'

export interface FormValues {
  title: string
}

export type SubmitHandler = (
  values: FormValues,
  isEdit: boolean,
  id: string | undefined,
  navigate: NavigateFunction,
  setSubmitting: (isSubmitting: boolean) => void,
) => void

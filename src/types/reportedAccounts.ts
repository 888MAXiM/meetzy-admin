import type { FormikHelpers } from 'formik'
import type { NavigateFunction } from 'react-router-dom'

export interface FormValues {
  status: string
  adminNote: string | null
}

export interface SelectOption {
  label: string
  value: string | number
  statusType: string
}

export type SubmitHandler = (
  values: FormValues,
  isEdit: boolean,
  id: string | undefined,
  navigate: NavigateFunction,
  helpers: FormikHelpers<FormValues>,
) => void

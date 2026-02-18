import type { FormikHelpers } from 'formik'
import type { NavigateFunction } from 'react-router-dom'
import type { CreatePagePayload } from './api'

export type FormValues = CreatePagePayload

export interface SelectOption {
  label: string
  value: string | number
}

export type SubmitHandler = (
  values: FormValues,
  isEdit: boolean,
  id: string | undefined,
  navigate: NavigateFunction,
  helpers: FormikHelpers<FormValues>,
) => void

import type { FormikHelpers } from 'formik'
import type { NavigateFunction } from 'react-router-dom'
import { SingleLanguage } from './api'

export interface FormValues {
  name: string
  locale: string
  isActive: boolean
  translationFile: File | null
  flag: string
}

export type SubmitHandler = (
  values: FormValues,
  isEdit: boolean,
  id: string | undefined,
  navigate: NavigateFunction,
  helpers: FormikHelpers<FormValues>,
  languageData: SingleLanguage | undefined,
  fileName: string | undefined,
) => void

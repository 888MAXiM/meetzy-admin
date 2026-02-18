import type { FormikHelpers } from 'formik'
import type { NavigateFunction } from 'react-router-dom'
import * as Yup from 'yup'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import type { FormValues, SubmitHandler } from '../../types/languages'
import { toaster } from '../../utils/custom-functions'

export const getValidationSchema = (isEdit: boolean) => {
  const baseSchema = {
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    locale: Yup.string()
      .required('Locale is required')
      .min(2, 'Locale must be at least 2 characters')
      .max(10, 'Locale must not exceed 10 characters')
      .matches(/^[a-z]{2}(-[a-z]{2,3})?$/i, 'Locale must be in format like: en, en-us, etc.'),
    flag: Yup.string().nullable(),
    translationFile: isEdit
      ? Yup.mixed()
          .nullable()
          .test('fileType', 'Only JSON files are allowed', (value) => {
            if (!value) return true
            return value instanceof File && (value.type === 'application/json' || value.name.endsWith('.json'))
          })
          .test('fileSize', 'File size must be less than 5MB', (value) => {
            if (!value) return true
            return value instanceof File && value.size <= 5 * 1024 * 1024
          })
      : Yup.mixed()
          .required('Translation file is required')
          .test('fileType', 'Only JSON files are allowed', (value) => {
            if (!value) return false
            return value instanceof File && (value.type === 'application/json' || value.name.endsWith('.json'))
          })
          .test('fileSize', 'File size must be less than 5MB', (value) => {
            if (!value) return false
            return value instanceof File && value.size <= 5 * 1024 * 1024
          }),
  }

  return Yup.object(baseSchema)
}
export const useLanguageFormHelpers = () => {
  const { mutate: createLanguage } = mutations.useCreateLanguage()
  const { mutate: updateLanguage } = mutations.useUpdateLanguage()

  const handleSubmit: SubmitHandler = (
    values: FormValues,
    isEdit: boolean,
    id: string | undefined,
    navigate: NavigateFunction,
    { setSubmitting }: FormikHelpers<FormValues>,
    languageData,
    fileName,
  ) => {
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('locale', values.locale)
    formData.append('isActive', values.isActive ? 'true' : 'false')

    if (values.flag) {
      formData.append('flag', values.flag)
    }

    if (values.translationFile instanceof File) {
      formData.append('translation', values.translationFile)
    }

    if (isEdit && id) {
      if (!fileName) {
        toaster('error', 'Translation file is required')
        setSubmitting(false)
        return
      }
      updateLanguage(
        {
          id: id,
          data: formData as any,
        },
        {
          onSuccess: () => {
            toaster('success', 'Language updated successfully')
            navigate(ROUTES.LANGUAGES)
          },
          onError: (error: any) => {
            console.error('Update error:', error)
            toaster('error', error.message)
            setSubmitting(false)
          },
        },
      )
    } else {
      if (!values.translationFile) {
        toaster('error', 'Translation file is required for new languages')
        setSubmitting(false)
        return
      }
      createLanguage(formData as any, {
        onSuccess: () => {
          toaster('success', 'Language created successfully')
          navigate(ROUTES.LANGUAGES)
        },
        onError: (error: any) => {
          console.error('Create error:', error)
          toaster('error', error.message)
          setSubmitting(false)
        },
      })
    }
  }

  return {
    handleSubmit,
  }
}

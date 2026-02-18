import { type NavigateFunction } from 'react-router-dom'
import * as Yup from 'yup'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import type { ReportReasonPayload } from '../../types/api'
import type { FormValues, SubmitHandler } from '../../types/ReportSettings'
import { toaster } from '../../utils/custom-functions'

export const validationSchema = Yup.object({
  title: Yup.string()
    .required('Question is required')
    .min(1, 'Question must be at least 1 characters')
    .max(500, 'Question must not exceed 500 characters'),
})

export const useReportSettingsHelpers = () => {
  const { mutate: createReportSettings } = mutations.useCreateReportSettings()
  const { mutate: updateReportSettings } = mutations.useUpdateReportSettings()

  const handleSubmit: SubmitHandler = (
    values: FormValues,
    isEdit: boolean,
    id: string | undefined,
    navigate: NavigateFunction,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    const payload: ReportReasonPayload = {
      title: values.title,
    }

    if (isEdit && id) {
      updateReportSettings(
        { id: id, data: payload as ReportReasonPayload },
        {
          onSuccess: () => {
            toaster('success', 'Report updated successfully')
            navigate(ROUTES.REPORT_SETTINGS)
          },
          onError: () => {
            toaster('error', 'Failed to update Report')
            setSubmitting(false)
          },
        },
      )
    } else {
      createReportSettings(payload, {
        onSuccess: () => {
          toaster('success', 'Report created successfully')
          navigate(ROUTES.REPORT_SETTINGS)
        },
        onError: () => {
          toaster('error', 'Failed to create Report')
          setSubmitting(false)
        },
      })
    }
  }

  return {
    handleSubmit,
  }
}

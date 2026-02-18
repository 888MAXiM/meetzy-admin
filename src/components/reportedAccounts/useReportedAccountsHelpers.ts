import type { FormikHelpers } from 'formik'
import { type NavigateFunction } from 'react-router-dom'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import type { ReportedAccountsPayload } from '../../types/api'
import type { FormValues, SelectOption } from '../../types/reportedAccounts'
import { toaster } from '../../utils/custom-functions'

export const typeOptions: SelectOption[] = [
  { label: 'Pending', value: 'pending', statusType: 'pending' },
  { label: 'Under Review', value: 'under review', statusType: 'under_review' },
  { label: 'Resolved', value: 'resolved', statusType: 'resolved' },
  { label: 'Dismissed', value: 'dismissed', statusType: 'dismissed' },
  { label: 'Banned', value: 'banned', statusType: 'banned' },
]

export const useReportedAccountsHelpers = () => {
  const { mutate: updateReportedAccounts } = mutations.useUpdateReportedAccounts()

  const handleSubmit = (
    values: FormValues,
    isEdit: boolean,
    id: string | undefined,
    navigate: NavigateFunction,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    const payload: ReportedAccountsPayload = {
      status: values.status,
      admin_notes: values.adminNote,
    }

    if (isEdit && id) {
      updateReportedAccounts(
        { id: id, data: payload as ReportedAccountsPayload },
        {
          onSuccess: () => {
            toaster('success', 'ReportedAccounts updated successfully')
            navigate(ROUTES.REPORTED_ACCOUNTS)
            formikHelpers.setSubmitting(false)
          },
          onError: () => {
            toaster('error', 'Failed to update ReportedAccounts')
            formikHelpers.setSubmitting(false)
          },
        },
      )
    }
  }

  return {
    handleSubmit,
  }
}

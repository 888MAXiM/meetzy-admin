import { type NavigateFunction } from 'react-router-dom'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import { FormValues, SubmitHandler } from '../../types/status'
import { toaster } from '../../utils/custom-functions'

export const useStatusFormHelpers = () => {
  const { mutate: createStatus } = mutations.useCreateStatus()

  const handleSubmit: SubmitHandler = (
    values: FormValues,
    isEdit: boolean,
    avatar: File | null,
    id: string | undefined,
    navigate: NavigateFunction,
    setSubmitting: (isSubmitting: boolean) => void,
    removeAvatar: boolean,
  ) => {
    const formData = new FormData()
    formData.append('caption', values.caption)

    if (removeAvatar) {
      formData.append('remove_avatar', 'true')
    } else if (avatar instanceof File) {
      formData.append('status', avatar)
      formData.append('type', 'image')
    }
    formData.append('isSponsored', `true`)

    createStatus(formData, {
      onSuccess: () => {
        toaster('success', 'Status created successfully')
        navigate(ROUTES.SPONSORED_STATUS)
      },
      onError: () => {
        toaster('error', 'Failed to create Status')
        setSubmitting(false)
      },
    })
  }

  return {
    handleSubmit,
  }
}

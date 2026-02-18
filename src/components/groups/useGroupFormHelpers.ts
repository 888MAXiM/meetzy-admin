import { type NavigateFunction } from 'react-router-dom'
import * as Yup from 'yup'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import { toaster } from '../../utils/custom-functions'
import type { FormValues, SubmitHandler } from '../../types/group'

export const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(1, 'Name must be at least 1 characters')
    .max(500, 'Name must not exceed 500 characters'),
})

export const useGroupFormHelpers = () => {
  const { mutate: updateGroup } = mutations.useUpdateGroups()

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
    formData.append('name', values.name)
    formData.append('description', values.description || '')

    if (removeAvatar) {
      formData.append('remove_avatar', 'true')
    } else if (avatar instanceof File) {
      formData.append('avatar', avatar)
    }

    if (isEdit && id) {
      formData.append('group_id', id)

      updateGroup(formData, {
        onSuccess: () => {
          toaster('success', 'Group updated successfully')
          navigate(ROUTES.GROUPS)
        },
        onError: () => {
          toaster('error', 'Failed to update Group')
          setSubmitting(false)
        },
      })
    }
  }

  return {
    handleSubmit,
  }
}

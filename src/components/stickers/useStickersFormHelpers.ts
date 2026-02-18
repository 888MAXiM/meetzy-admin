import { type NavigateFunction } from 'react-router-dom'
import * as Yup from 'yup'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import type { StickersPayload } from '../../types/api'
import { toaster } from '../../utils/custom-functions'
import type { FormValues, SubmitHandler } from '../../types/stickers'

export const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(1, 'Name must be at least 1 characters')
    .max(500, 'Name must not exceed 500 characters'),
  statusSwitch: Yup.boolean(),
})

export const useStickersFormHelpers = () => {
  const { mutate: createStickers } = mutations.useCreateStickers()
  const { mutate: updateStickers } = mutations.useUpdateStickers()

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
    formData.append('title', values.name)
    formData.append('status', values.statusSwitch ? 'true' : 'false')

    if (removeAvatar) {
      formData.append('remove_avatar', 'true')
    } else if (avatar instanceof File) {
      formData.append('sticker', avatar)
    }

    if (isEdit && id) {
      updateStickers(
        { id: id, data: formData as unknown as StickersPayload },
        {
          onSuccess: () => {
            toaster('success', 'Stickers updated successfully')
            navigate(ROUTES.STICKERS)
          },
          onError: () => {
            toaster('error', 'Failed to update Stickers')
            setSubmitting(false)
          },
        },
      )
    } else {
      createStickers(formData as unknown as StickersPayload, {
        onSuccess: () => {
          toaster('success', 'Stickers created successfully')
          navigate(ROUTES.STICKERS)
        },
        onError: () => {
          toaster('error', 'Failed to create Stickers')
          setSubmitting(false)
        },
      })
    }
  }

  return {
    handleSubmit,
  }
}

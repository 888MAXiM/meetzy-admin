import { type NavigateFunction } from 'react-router-dom'
import * as Yup from 'yup'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import type { WallpaperPayload } from '../../types/api'
import type { FormValues, SubmitHandler } from '../../types/wallpaper'
import { toaster } from '../../utils/custom-functions'

export const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(1, 'Name must be at least 1 characters')
    .max(500, 'Name must not exceed 500 characters'),
  statusSwitch: Yup.boolean(),
})

export const useWallpaperFormHelpers = () => {
  const { mutate: createWallpaper } = mutations.useCreateWallpaper()
  const { mutate: updateWallpaper } = mutations.useUpdateWallpaper()

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
    formData.append('status', values.statusSwitch ? 'true' : 'false')

    if (removeAvatar) {
      formData.append('remove_avatar', 'true')
    } else if (avatar instanceof File) {
      formData.append('wallpaper', avatar)
    }

    if (isEdit && id) {
      updateWallpaper(
        { id: parseInt(id), data: formData as unknown as WallpaperPayload },
        {
          onSuccess: () => {
            toaster('success', 'Wallpaper updated successfully')
            navigate(ROUTES.CHAT_WALLPAPERS)
          },
          onError: () => {
            toaster('error', 'Failed to update Wallpaper')
            setSubmitting(false)
          },
        },
      )
    } else {
      createWallpaper(formData as unknown as WallpaperPayload, {
        onSuccess: () => {
          toaster('success', 'Wallpaper created successfully')
          navigate(ROUTES.CHAT_WALLPAPERS)
        },
        onError: () => {
          toaster('error', 'Failed to create Wallpaper')
          setSubmitting(false)
        },
      })
    }
  }

  return {
    handleSubmit,
  }
}

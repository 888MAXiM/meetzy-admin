import { type NavigateFunction } from 'react-router-dom'
import { toast } from 'react-toastify'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import { FormValues, SubmitHandler } from '../../types/announcement'
import { Announcement } from '../../types/api'

export const useAnnouncementsHelpers = () => {
  const { mutate } = mutations.useSendAnnouncement()
  const { mutate: updateAnnouncements } = mutations.useUpdateAnnouncements()

  const handleSubmit: SubmitHandler = (
    values: FormValues,
    isEdit: boolean,
    avatar: File | null,
    id: string | undefined,
    navigate: NavigateFunction,
    setSubmitting: (isSubmitting: boolean) => void,
    removeAvatar: boolean,
    AnnounceData: Announcement,
  ) => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('content', values.message)

    if (AnnounceData) {
      formData.append('id', `${AnnounceData?.id}`)
    }

    if (values.additionalKey) {
      formData.append('announcement_type', values.additionalKey)
    }

    if (values.redirectURL) {
      formData.append('redirect_url', values.redirectURL)
    }

    if (values.link) {
      formData.append('action_link', values.link)
    }

    if (removeAvatar) {
      formData.append('remove_avatar', 'true')
    } else if (avatar instanceof File) {
      formData.append('file', avatar)
    }

    if (isEdit) {
      updateAnnouncements(
        { id: AnnounceData?.id, data: formData },
        {
          onSuccess: (response: any) => {
            const message = response?.message || 'Profile updated successfully'
            toast.success(message)
            navigate(ROUTES.ANNOUNCEMENTS)
          },
        },
      )
    } else {
      mutate(formData, {
        onSuccess: () => {
          const message = 'User created successfully'
          toast.success(message)
          navigate(ROUTES.ANNOUNCEMENTS)
        },
      })
    }
  }

  return {
    handleSubmit,
  }
}

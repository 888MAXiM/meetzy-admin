import type { NavigateFunction } from 'react-router-dom'
import { toast } from 'react-toastify'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import type { SingleUser, UpdateProfileResponse } from '../../types/api'
import type { FormValues, SubmitHandler } from '../../types/profile'
import { useCountry } from '../../utils/hooks/useCountry'

export const useEditUserHelper = () => {
  const { getCountryNameByCode } = useCountry()

  const { mutate: register } = mutations.useRegister()
  const { mutate: updateProfile } = mutations.useUpdateProfile()

  const handleSubmit: SubmitHandler = async (
    values: FormValues,
    userData: SingleUser | undefined,
    avatar: File | null,
    removeAvatar: boolean,
    navigate: NavigateFunction,
  ) => {
    const formData = new FormData()

    const countryName = getCountryNameByCode(values.country_code)

    if (userData) formData.append('id', `${userData.id}`)
    formData.append('name', `${values.first_name} ${values.last_name}`)
    formData.append('phone', values.phone)
    formData.append('country_code', values.country_code)
    formData.append('country', countryName)
    formData.append('email', values.email)
    formData.append('password', values.password)

    if (removeAvatar) {
      formData.append('remove_avatar', 'true')
    } else if (avatar instanceof File) {
      formData.append('avatar', avatar)
    }

    if (userData?.id) {
      updateProfile(formData, {
        onSuccess: (response: UpdateProfileResponse) => {
          const message = response?.message || 'Profile updated successfully'
          toast.success(message)
          navigate(ROUTES.USERS)
        },
      })
    } else {
      register(formData, {
        onSuccess: () => {
          const message = 'User created successfully'
          toast.success(message)
          navigate(ROUTES.USERS)
        },
      })
    }
  }

  return {
    handleSubmit,
  }
}

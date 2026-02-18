import * as Yup from 'yup'
import { type NavigateFunction } from 'react-router-dom'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import { toaster } from '../../utils/custom-functions'
import type { FormValues, SubmitHandler } from '../../types/faqs'
import type { CreateFAQPayload, UpdateFAQPayload } from '../../types/api'

export const validationSchema = Yup.object({
  question: Yup.string()
    .required('Question is required')
    .min(1, 'Question must be at least 1 characters')
    .max(500, 'Question must not exceed 500 characters'),
  answer: Yup.string()
    .required('Answer is required')
    .min(1, 'Answer must be at least 1 characters')
    .max(2000, 'Answer must not exceed 2000 characters'),
  statusSwitch: Yup.boolean(),
})

export const useFaqFormHelpers = () => {
  const { mutate: createFaq } = mutations.useCreateFaq()
  const { mutate: updateFaq } = mutations.useUpdateFaq()

  const handleSubmit: SubmitHandler = (
    values: FormValues,
    isEdit: boolean,
    id: string | undefined,
    navigate: NavigateFunction,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    const payload: CreateFAQPayload = {
      title: values.question,
      description: values.answer,
      status: values.statusSwitch ? true : false,
    }

    if (isEdit && id) {
      updateFaq(
        { id: id, data: payload as UpdateFAQPayload },
        {
          onSuccess: () => {
            toaster('success', 'FAQ updated successfully')
            navigate(ROUTES.MANAGE_FAQS)
          },
          onError: () => {
            toaster('error', 'Failed to update FAQ')
            setSubmitting(false)
          },
        },
      )
    } else {
      createFaq(payload, {
        onSuccess: () => {
          toaster('success', 'FAQ created successfully')
          navigate(ROUTES.MANAGE_FAQS)
        },
        onError: () => {
          toaster('error', 'Failed to create FAQ')
          setSubmitting(false)
        },
      })
    }
  }

  return {
    handleSubmit,
  }
}

import { NavigateFunction } from 'react-router-dom'
import { mutations } from '../../api'
import { ROUTES } from '../../constants'
import { toaster } from '../custom-functions'
import { PlanFormValues, PlanSubmitHandler } from '../../types/plans'
import { CreatePlanPayload, UpdatePlanPayload } from '../../types/api'

export const usePlanFormHelpers = () => {
  const { mutate: createPlan } = mutations.useCreatePlan()
  const { mutate: updatePlan } = mutations.useUpdatePlan()

  const handleSubmit: PlanSubmitHandler = (
    values: PlanFormValues,
    isEdit: boolean,
    id: string | undefined,
    navigate: NavigateFunction,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    const payload: CreatePlanPayload = {
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      price_per_user_per_month: Number(values.price_per_user_per_month),
      price_per_user_per_year: values.price_per_user_per_year ? Number(values.price_per_user_per_year) : null,
      billing_cycle: values.billing_cycle,
      max_members_per_group: Number(values.max_members_per_group),
      max_broadcasts_list: Number(values.max_broadcasts_list),
      max_members_per_broadcasts_list: Number(values.max_members_per_broadcasts_list),
      max_status: Number(values.max_status),
      max_groups: Number(values.max_groups),
      allows_file_sharing: values.allows_file_sharing,
      video_calls_enabled: values.video_calls_enabled,
      display_order: Number(values.display_order) || 0,
      is_default: values.is_default,
      status: values.statusSwitch ? 'active' : 'inactive',
    }

    if (isEdit && id) {
      updatePlan(
        { id: id, data: payload as UpdatePlanPayload },
        {
          onSuccess: () => {
            toaster('success', 'Plan updated successfully')
            navigate(ROUTES.PLANS)
          },
          onError: (error) => {
            console.error('Update error:', error)
            toaster('error', 'Failed to update plan')
            setSubmitting(false)
          },
        },
      )
    } else {
      createPlan(payload, {
        onSuccess: () => {
          toaster('success', 'Plan created successfully')
          navigate(ROUTES.PLANS)
        },
        onError: (error) => {
          console.error('Create error:', error)
          toaster('error', 'Failed to create plan')
          setSubmitting(false)
        },
      })
    }
  }

  return {
    handleSubmit,
  }
}

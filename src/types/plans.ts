import { NavigateFunction } from 'react-router-dom'

export interface PlanFormValues {
  name: string
  slug: string
  description: string
  price_per_user_per_month: number | string
  price_per_user_per_year: number | string
  billing_cycle: 'monthly' | 'yearly' | 'both'
  max_members_per_group: number | string
  max_broadcasts_list: number | string
  max_members_per_broadcasts_list: number | string
  max_status: number | string
  max_groups: number | string
  allows_file_sharing: boolean
  video_calls_enabled: boolean
  display_order: number | string
  is_default: boolean
  statusSwitch: boolean
}

export type PlanSubmitHandler = (
  values: PlanFormValues,
  isEdit: boolean,
  id: string | undefined,
  navigate: NavigateFunction,
  setSubmitting: (isSubmitting: boolean) => void,
) => void



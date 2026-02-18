import { AxiosError } from 'axios'
import type { Params } from '../types/api'
import apiClient from './apiClient'

async function get<T>(url: string, params?: Params, headers?: Record<string, string>): Promise<T> {
  try {
    const response = await apiClient.get<T>(url, {
      params,
      headers,
    })
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<any>
    const responseData = axiosError.response?.data as { message?: string; error?: string; details?: string[] }
    const message = responseData?.details?.[0] || responseData?.message || responseData?.error || axiosError.message || 'Something went wrong'

    throw new Error(message)
  }
}

export default get

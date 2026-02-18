import { AxiosError, type AxiosRequestConfig } from 'axios'
import apiClient from './apiClient'

async function put<TInput, TResponse>(
  url: string,
  data?: TInput,
  customConfig: Partial<AxiosRequestConfig> = {},
): Promise<TResponse> {
  try {
    const response = await apiClient.put<TResponse>(url, data, customConfig)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<any>
    const responseData = axiosError.response?.data as { message?: string; error?: string; details?: string[] }
    const message = responseData?.details?.[0] || responseData?.message || responseData?.error || axiosError.message || 'Something went wrong'
    throw new Error(message)
  }
}

export default put

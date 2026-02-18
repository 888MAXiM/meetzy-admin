import { AxiosError, type AxiosRequestConfig } from 'axios'
import apiClient from './apiClient'

async function remove<T>(url: string, data?: any, customConfig: Partial<AxiosRequestConfig> = {}): Promise<T> {
  try {
    const config: AxiosRequestConfig = {
      ...customConfig,
      data,
    }
    const response = await apiClient.delete<T>(url, config)
    return response.data
  } catch (error: any) {
    const axiosError = error as AxiosError<any>
    const responseData = axiosError.response?.data as { message?: string; error?: string; details?: string[] }

    const message = responseData?.details?.[0] || responseData?.message || responseData?.error || axiosError.message || 'Something went wrong'

    throw new Error(message)
  }
}

export default remove

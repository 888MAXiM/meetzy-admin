import { AxiosError } from 'axios'
import { errorMessage, toaster } from '../utils/custom-functions'
import apiClient from './apiClient'

async function post<TInput, TResponse>(url: string, data?: TInput, token?: string): Promise<TResponse> {
  try {
    const config: { headers?: Record<string, string> } = {}
    
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      }
    }

    const response = await apiClient.post<TResponse>(url, data, config)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<any>
    const responseData = axiosError.response?.data as { details?: string[]; message?: string; error?: string }

    const message = responseData?.details?.[0] || responseData?.message || responseData?.error || axiosError.message || 'Something went wrong'
    toaster('error', errorMessage(error))
    throw new Error(message)
  }
}

export default post

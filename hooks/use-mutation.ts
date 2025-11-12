import { useState } from "react"
import { apiMutations } from "@/lib/api/mutations"
import { APIError } from "@/lib/errors"

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

/**
 * Custom hook for API mutations (POST, PUT, DELETE, PATCH)
 */
export function useMutation<T = any>(
  method: "post" | "put" | "patch" | "delete",
  options?: UseMutationOptions<T>
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = async (url: string, data?: any) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiMutations[method]<T>(url, data)
      options?.onSuccess?.(result)
      console.log("result", result)
      return result
    } catch (err: any) {
      const error = err.response
        ? new APIError(
            err.response.data?.message || "An error occurred",
            err.response.status,
            err.response.data
          )
        : new Error("Network error")

      setError(error)
      options?.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutate,
    isLoading,
    error,
  }
}


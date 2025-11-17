import { useAPI } from "./use-api"
import { useMutation } from "./use-mutation"
import { API_ENDPOINTS } from "@/lib/constants"
import {
  AdminDashboardStats,
  AdminUsersResponse,
  AdminUserDetailResponse,
  UpdateUserLimitsRequest,
  UpdateUserLimitsResponse,
} from "@/types/api"

export function useAdminDashboard(enabled: boolean = true) {
  const { data, error, isLoading, mutate } = useAPI<AdminDashboardStats>(
    enabled ? API_ENDPOINTS.ADMIN.DASHBOARD : null,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    stats: data?.stats,
    error,
    isLoading,
    refetch: mutate,
  }
}

export function useAdminUsers(
  page: number = 1,
  limit: number = 20,
  search?: string,
  enabled: boolean = true
) {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })
  if (search) {
    searchParams.append("search", search)
  }

  const { data, error, isLoading, mutate } = useAPI<AdminUsersResponse>(
    enabled ? `${API_ENDPOINTS.ADMIN.USERS}?${searchParams.toString()}` : null,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    users: data?.users || [],
    pagination: data?.pagination,
    error,
    isLoading,
    refetch: mutate,
  }
}

export function useAdminUser(userId: string | null) {
  const { data, error, isLoading, mutate } = useAPI<AdminUserDetailResponse>(
    userId ? API_ENDPOINTS.ADMIN.USER(userId) : null,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    user: data?.user,
    error,
    isLoading,
    refetch: mutate,
  }
}

export function useAdminActions() {
  const { mutate: updateUserLimits, isLoading: isUpdatingLimits } =
    useMutation<UpdateUserLimitsResponse>("put", {
      onError: (error) => {
        console.error("Failed to update user limits:", error)
      },
    })

  const { mutate: updateUserSubscription, isLoading: isUpdatingSubscription } =
    useMutation("put", {
      onError: (error) => {
        console.error("Failed to update user subscription:", error)
      },
    })

  const handleUpdateUserLimits = async (
    userId: string,
    limits: UpdateUserLimitsRequest
  ) => {
    try {
      const response = await updateUserLimits(
        API_ENDPOINTS.ADMIN.USER_LIMITS(userId),
        limits
      )
      return response
    } catch (error) {
      throw error
    }
  }

  const handleUpdateUserSubscription = async (
    userId: string,
    planId: string
  ) => {
    try {
      const response = await updateUserSubscription(
        API_ENDPOINTS.ADMIN.USER_SUBSCRIPTION(userId),
        { planId }
      )
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    updateUserLimits: handleUpdateUserLimits,
    updateUserSubscription: handleUpdateUserSubscription,
    isUpdatingLimits,
    isUpdatingSubscription,
  }
}

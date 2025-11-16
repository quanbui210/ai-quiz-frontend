import { useAPI } from "./use-api"
import { useMutation } from "./use-mutation"
import { API_ENDPOINTS } from "@/lib/constants"
import { apiClient } from "@/lib/api/client"
import {
  SubscriptionResponse,
  PlansResponse,
  CheckoutResponse,
  PortalResponse,
} from "@/types/api"

export function useSubscription() {
  const { data, error, isLoading, mutate } = useAPI<SubscriptionResponse>(
    API_ENDPOINTS.SUBSCRIPTION.ME,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  return {
    subscription: data?.subscription,
    usage: data?.usage,
    error,
    isLoading,
    refetch: mutate,
  }
}

export function usePlans() {
  const { data, error, isLoading } = useAPI<PlansResponse>(
    API_ENDPOINTS.SUBSCRIPTION.PLANS,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    plans: data?.plans || [],
    error,
    isLoading,
  }
}

export function useSubscriptionActions(refetch?: () => void) {
  const { mutate: createCheckout, isLoading: isCreatingCheckout } =
    useMutation<CheckoutResponse>("post", {
      onError: (error) => {
        console.error("Failed to create checkout:", error)
      },
    })

  const { mutate: cancelSubscription, isLoading: isCanceling } =
    useMutation("post", {
      onError: (error) => {
        console.error("Failed to cancel subscription:", error)
      },
    })

  const { mutate: resumeSubscription, isLoading: isResuming } =
    useMutation("post", {
      onError: (error) => {
        console.error("Failed to resume subscription:", error)
      },
    })

  const getPortalUrl = async () => {
    try {
      const response = await apiClient.get<PortalResponse>(
        API_ENDPOINTS.SUBSCRIPTION.PORTAL
      )
      return response.data
    } catch (error) {
      console.error("Failed to get portal:", error)
      throw error
    }
  }

  const handleCreateCheckout = async (planId: string): Promise<CheckoutResponse> => {
    try {
      const response = await createCheckout(
        API_ENDPOINTS.SUBSCRIPTION.CREATE_CHECKOUT,
        { planId }
      )
      
      if (response?.updated) {
        if (refetch) {
          await refetch()
        }
        return response
      }
      
      if (response?.checkoutUrl) {
        window.location.href = response.checkoutUrl
      }
      
      return response
    } catch (error) {
      throw error
    }
  }

  const handleCancel = async () => {
    try {
      await cancelSubscription(API_ENDPOINTS.SUBSCRIPTION.CANCEL, {})
    } catch (error) {
      throw error
    }
  }

  const handleResume = async () => {
    try {
      await resumeSubscription(API_ENDPOINTS.SUBSCRIPTION.RESUME, {})
    } catch (error) {
      throw error
    }
  }

  const handleGetPortal = async () => {
    try {
      const response = await getPortalUrl()
      if (response?.url) {
        window.location.href = response.url
      }
    } catch (error) {
      throw error
    }
  }

  return {
    createCheckout: handleCreateCheckout,
    cancel: handleCancel,
    resume: handleResume,
    getPortal: handleGetPortal,
    isCreatingCheckout,
    isCanceling,
    isResuming,
    isGettingPortal: false,
  }
}


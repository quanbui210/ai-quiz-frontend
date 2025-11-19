import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/use-auth-store"
import { useAPI } from "./use-api"
import { useMutation } from "./use-mutation"
import { API_ENDPOINTS } from "@/lib/constants"
import { apiClient } from "@/lib/api/client"
import {
  AuthLoginResponse,
  AuthSessionResponse,
  AuthMeResponse,
} from "@/types/api"

export function useAuth() {
  const router = useRouter()
  const {
    user,
    session,
    isAuthenticated,
    isLoading: storeIsLoading,
    isAdmin,
    admin,
    hasHydrated,
    setAuth,
    setUser,
    logout: clearAuth,
    setLoading,
  } = useAuthStore()

  useEffect(() => {
    if (typeof window !== "undefined" && !hasHydrated) {
      const checkHydration = setTimeout(() => {
        const store = useAuthStore.getState()
        if (!store.hasHydrated) {
          try {
            const stored = localStorage.getItem("auth-storage")
            if (stored) {
              const parsed = JSON.parse(stored)
              if (parsed.state) {
                store.setHasHydrated(true)
              } else {
                store.setHasHydrated(true)
                store.setLoading(false)
              }
            } else {
              store.setHasHydrated(true)
              store.setLoading(false)
            }
          } catch (e) {
            store.setHasHydrated(true)
            store.setLoading(false)
          }
        }
      }, 100)

      return () => clearTimeout(checkHydration)
    }
  }, [hasHydrated])

  const sessionEndpoint = hasHydrated && session && session.access_token
    ? API_ENDPOINTS.AUTH.SESSION
    : null


  const {
    data: sessionData,
    mutate: refetchSession,
    error: sessionError,
    isLoading: isLoadingSession,
  } = useAPI<AuthSessionResponse>(
    sessionEndpoint,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onErrorRetry: () => {},
      errorRetryCount: 0,
      shouldRetryOnError: false,
      dedupingInterval: 5000,
      focusThrottleInterval: 5000,
    }
  )


  const {
    data: userData,
    mutate: refetchUser,
    error: userError,
  } = useAPI<AuthMeResponse>(
    hasHydrated && session && session.access_token
      ? API_ENDPOINTS.AUTH.ME
      : null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onErrorRetry: () => {},
      errorRetryCount: 0,
      shouldRetryOnError: false,
    }
  )

  useEffect(() => {
    if (!session || !session.access_token) {
      return
    }

    const sessionIs401 =
      sessionError &&
      ((sessionError as any)?.response?.status === 401 ||
        (sessionError as any)?.status === 401)
    const userIs401 =
      userError &&
      ((userError as any)?.response?.status === 401 ||
        (userError as any)?.status === 401)

    if (sessionIs401 || userIs401) {
      clearAuth()
      router.push("/")
    }
  }, [session, sessionError, userError, clearAuth, router])

  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user as any, {
        isAdmin: userData.isAdmin,
        admin: userData.admin || null,
      })
    }
  }, [userData, setUser])

  useEffect(() => {
    if (sessionData) {
      console.log("Session data received from endpoint:", sessionData)
      if (!sessionData.user) {
        console.error("Session data missing user:", sessionData)
        setLoading(false) 
        return
      }
      if (!sessionData.session) {
        console.error("Session data missing session:", sessionData)
        setLoading(false) 
        return
      }
      if (!sessionData.session.access_token) {
        console.error("Session data missing access_token:", sessionData)
        setLoading(false) // Stop loading even on error
        return
      }
      
      const currentSession = session?.access_token
      const newSession = sessionData.session.access_token
      if (currentSession === newSession) {
        console.log("Session token unchanged, skipping update")
        setLoading(false) //
        return
      }
      
      console.log("Setting auth from session endpoint - user:", sessionData.user?.id, "session:", !!sessionData.session?.access_token)
      setAuth(sessionData)
      setLoading(false) // Session validated successfully
      
      // Force a re-render and verify storage
      setTimeout(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem("auth-storage") : null
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            const hasSession = parsed?.state?.session?.access_token
            const hasUser = parsed?.state?.user?.id
            const storedToken = parsed?.state?.session?.access_token
            console.log("Session endpoint - Verification - Stored session:", !!hasSession, "Stored user:", !!hasUser, "Token matches:", storedToken === newSession)
            if (!hasSession || !hasUser) {
              console.error("WARNING: Session endpoint data not properly stored!", parsed)
              // Try to manually set it again
              console.log("Attempting to manually store session data...")
              setAuth(sessionData)
            }
          } catch (e) {
            console.error("Failed to verify stored session data:", e)
          }
        } else {
          console.error("WARNING: No auth-storage found in localStorage after setAuth!")
        }
      }, 200)
    } else if (sessionEndpoint && !isLoadingSession && !sessionError) {
      console.log("Session endpoint enabled but no data received yet (loading:", isLoadingSession, "error:", !!sessionError, ")")
    } else if (hasHydrated && sessionEndpoint && !isLoadingSession && sessionError) {
      setLoading(false)
    } else if (hasHydrated && !sessionEndpoint && !session) {
      setLoading(false)
    }
  }, [sessionData, setAuth, session, sessionEndpoint, isLoadingSession, sessionError, hasHydrated, setLoading])

  const login = useCallback(async () => {
    setLoading(true)
    try {
      const frontendUrl =
        process.env.NEXT_PUBLIC_FRONTEND_URL ||
        (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")

      const response = await apiClient.get<{ url: string }>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          params: {
            redirectTo: `${frontendUrl}/callback`,
          },
        }
      )

      if (response.data?.url) {
        window.location.href = response.data.url
      } else {
        setLoading(false)
        throw new Error("No redirect URL in response")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setLoading(false)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to initiate login"
      throw new Error(errorMessage)
    }
  }, [setLoading])

  const { mutate: signOutMutation, isLoading: isSigningOut } = useMutation<{
    message: string
  }>("post", {
    onSuccess: () => {
      clearAuth()
      router.push("/")
    },
    onError: () => {
      clearAuth()
      router.push("/")
    },
  })

  const signOut = useCallback(() => {
    signOutMutation(API_ENDPOINTS.AUTH.SIGNOUT)
  }, [signOutMutation])

  const handleCallback = useCallback(
    async (code: string) => {
      setLoading(true)
      try {
        const response = await fetch(`/api/auth/callback?code=${code}`)

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }))
          setLoading(false)
          throw new Error(
            errorData.error || errorData.details || "Callback failed"
          )
        }

        const data: AuthLoginResponse = await response.json()
        setAuth(data)
        router.push("/dashboard")
      } catch (error) {
        console.error("OAuth callback error:", error)
        setLoading(false)
        router.push("/?error=callback_failed")
      } finally {
        setLoading(false)
      }
    },
    [setAuth, setLoading, router]
  )

  const isLoading = !hasHydrated || storeIsLoading || isSigningOut || isLoadingSession

  return {
    user,
    session,
    isAuthenticated: hasHydrated ? isAuthenticated : false, // Don't trust auth state until hydrated
    isLoading,
    isAdmin,
    admin,
    login,
    signOut,
    handleCallback,
    refetchSession,
    refetchUser,
  }
}

import { useAuth } from "./use-auth"

export function useAdminCheck() {
  const { isAdmin, isLoading } = useAuth()
  
  return { 
    isAdmin: isAdmin || false, 
    isChecking: isLoading 
  }
}


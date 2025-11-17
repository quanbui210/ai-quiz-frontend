import { useAPI } from "./use-api"
import { useMutation } from "./use-mutation"
import { API_ENDPOINTS } from "@/lib/constants"
import {
  ChatSession,
  ChatSessionsResponse,
  ChatSessionResponse,
  ChatMessagesResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from "@/types/api"

export function useChatSessions() {
  const { data, error, isLoading, mutate } = useAPI<ChatSessionsResponse>(
    API_ENDPOINTS.CHAT.SESSIONS,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    sessions: data?.sessions || [],
    isLoading,
    error,
    refetch: mutate,
  }
}

export function useChatSession(id: string | null) {
  const { data, error, isLoading, mutate } = useAPI<ChatSessionResponse>(
    id ? API_ENDPOINTS.CHAT.SESSION(id) : null,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    session: data?.session,
    isLoading,
    error,
    refetch: mutate,
  }
}

export function useChatMessages(sessionId: string | null) {
  const { data, error, isLoading, mutate } = useAPI<ChatMessagesResponse>(
    sessionId ? API_ENDPOINTS.CHAT.MESSAGES(sessionId) : null,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    messages: data?.messages || [],
    isLoading,
    error,
    refetch: mutate,
  }
}

export function useCreateChatSession() {
  const { mutate, isLoading, error } = useMutation<ChatSessionResponse>("post")

  const createSession = async (
    documentId?: string,
    title?: string,
    model?: string
  ) => {
    const payload: any = {}
    if (documentId) payload.documentId = documentId
    if (title) payload.title = title
    if (model) payload.model = model
    return mutate(API_ENDPOINTS.CHAT.CREATE_SESSION, payload)
  }

  return {
    createSession,
    isLoading,
    error,
  }
}

export function useSendChatMessage() {
  const { mutate, isLoading, error } =
    useMutation<SendChatMessageResponse>("post")

  const sendMessage = async (sessionId: string, message: string) => {
    const payload: SendChatMessageRequest = { message }
    return mutate(API_ENDPOINTS.CHAT.SEND_MESSAGE(sessionId), payload)
  }

  return {
    sendMessage,
    isLoading,
    error,
  }
}

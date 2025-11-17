import { useState } from "react"
import { useAPI } from "./use-api"
import { useMutation } from "./use-mutation"
import { API_ENDPOINTS } from "@/lib/constants"
import {
  Document,
  DocumentsListResponse,
  DocumentUploadResponse,
  DocumentGenerateQuizResponse,
} from "@/types/api"
import { apiClient } from "@/lib/api/client"

export function useDocuments() {
  const { data, error, isLoading, mutate } = useAPI<DocumentsListResponse>(
    API_ENDPOINTS.DOCUMENT.LIST,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    documents: data?.documents || [],
    isLoading,
    error,
    refetch: mutate,
  }
}

export function useDocument(id: string | null) {
  const { data, error, isLoading, mutate } = useAPI<{ document: Document }>(
    id ? API_ENDPOINTS.DOCUMENT.GET(id) : null,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    document: data?.document,
    isLoading,
    error,
    refetch: mutate,
  }
}

export function useDocumentUpload() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const uploadDocument = async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await apiClient.post<DocumentUploadResponse>(
        API_ENDPOINTS.DOCUMENT.UPLOAD,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      return response.data
    } catch (err: any) {
      const error = new Error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to upload document"
      )
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    uploadDocument,
    isLoading,
    error,
  }
}

export function useDocumentDelete() {
  const { mutate, isLoading, error } = useMutation("delete")

  const deleteDocument = async (id: string) => {
    return mutate(API_ENDPOINTS.DOCUMENT.DELETE(id))
  }

  return {
    deleteDocument,
    isLoading,
    error,
  }
}

export function useDocumentGenerateQuiz() {
  const { mutate, isLoading, error } = useMutation<DocumentGenerateQuizResponse>("post")

  const generateQuiz = async (documentId: string) => {
    return mutate(API_ENDPOINTS.DOCUMENT.GENERATE_QUIZ(documentId))
  }

  return {
    generateQuiz,
    isLoading,
    error,
  }
}

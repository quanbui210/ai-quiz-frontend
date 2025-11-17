// API request/response types

import { Quiz, User } from "./prisma"

export interface AuthLoginInitResponse {
  url: string
  message: string
}

export interface AuthLoginResponse {
  message: string
  user: User
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
    expires_in: number
    token_type: string
    user: User
  }
  isAdmin?: boolean
  admin?: {
    role: string
    permissions: string[]
  }
}

export interface AuthSessionResponse {
  user: User
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
    expires_in: number
    token_type: string
  }
  isAdmin?: boolean
  admin?: {
    role: string
    permissions: string[]
  }
}

export interface AuthMeResponse {
  user: User
  isAdmin?: boolean
  admin?: {
    role: string
    permissions: string[]
  }
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data?: T
  message?: string
  success: boolean
  error?: string
}

// Error response
export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}

export interface TopicSuggestRequest {
  userTopic: string
}

export interface TopicSuggestResponse {
  topics: string[]
}

export interface TopicCreateRequest {
  name: string
}

export interface TopicCreateResponse {
  topic: {
    id: string
    name: string
    description: string | null
    createdAt: string
    updatedAt: string
  }
}

export interface AnalyticsResponse {
  weeklyComparison: {
    attempts: {
      thisWeek: number
      lastWeek: number
      change: number
    }
    topics: {
      thisWeek: number
      lastWeek: number
      change: number
    }
    progress: {
      thisWeek: number
      lastWeek: number
      change: number
    }
  }
  performance: {
    timeSeries: {
      last7Days: Array<{
        date: string
        averageScore: number | null
        attemptCount: number
      }>
      last30Days: Array<{
        date: string
        averageScore: number | null
        attemptCount: number
      }>
      last90Days: Array<{
        date: string
        averageScore: number | null
        attemptCount: number
      }>
    }
  }
  topics: Array<{
    topicId: string
    topicName: string
    progressPercentage: number
    averageScore: number
    completedQuizzes: number
    totalQuizzes: number
    lastAttemptAt: string | null
  }>
  overview: {
    overallProgress: number
  }
  time?: {
    totalTimeSpent: number
    averageTimeSpent: number
    totalTimeSet: number
    averageTimeSet: number
    timeEfficiency: number
  }
}

export interface SubscriptionPlan {
  id: string
  name: string
  stripePriceId: string | null
  stripeProductId: string | null
  isDefault: boolean
  isActive: boolean
  isCustom: boolean
  maxTopics: number
  maxQuizzes: number
  maxDocuments: number
  allowedModels: string[]
  createdAt: string
  updatedAt: string
  price?: {
    id: string
    amount: number
    currency: string
    formatted: string
    interval: "month" | "year"
    intervalCount: number
    stripePriceId: string
    stripeProductId: string | null
  } | null
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  maxTopics: number
  maxQuizzes: number
  maxDocuments: number
  allowedModels: string[]
  status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID"
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  plan: SubscriptionPlan
}

export interface SubscriptionUsage {
  topicsCount: number
  quizzesCount: number
  documentsCount: number
  topicsRemaining: number
  quizzesRemaining: number
  documentsRemaining: number
}

export interface SubscriptionResponse {
  subscription: Subscription
  usage: SubscriptionUsage
}

export interface PlansResponse {
  plans: SubscriptionPlan[]
}

export interface CheckoutResponse {
  checkoutUrl?: string
  sessionId?: string
  updated?: boolean
  message?: string
  planId?: string
  planName?: string
}

export interface PortalResponse {
  url: string
}

export interface AdminDashboardStats {
  stats: {
    totalUsers: number
    activeSubscriptions: number
    canceledSubscriptions: number
    freeSubscriptions: number
    paidSubscriptions: number
    totalSubscriptions: number
    totalTopics: number
    totalQuizzes: number
    totalDocuments: number
    totalUsage: {
      topics: number
      quizzes: number
      documents: number
    }
    revenue: {
      total: number
      monthly: number
      yearly: number
      currency: string
    }
    totalPlans: number
    subscriptionBreakdown: Array<{
      planName: string
      count: number
    }>
    subscriptions?: Array<{
      id: string
      userId: string
      user: {
        id: string
        email: string
        name: string | null
        joinedAt: string
      }
      plan: {
        id: string
        name: string
        stripePriceId: string | null
      }
      status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID"
      currentPeriodStart: string
      currentPeriodEnd: string
      cancelAtPeriodEnd: boolean
      stripeCustomerId: string | null
      stripeSubscriptionId: string | null
      limits: {
        maxTopics: number
        maxQuizzes: number
        maxDocuments: number
        allowedModels: string[]
      }
      createdAt: string
      updatedAt: string
    }>
  }
}

export interface AdminUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: string
  subscription: {
    id: string
    planId: string
    status: string
    maxTopics: number
    maxQuizzes: number
    maxDocuments: number
    plan: {
      id: string
      name: string
    }
  } | null
  usage: {
    topicsCount: number
    quizzesCount: number
    documentsCount: number
  }
  adminProfile: {
    id: string
    role: string
    permissions: string[]
  } | null
}

export interface AdminUsersResponse {
  users: AdminUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AdminUserDetailResponse {
  user: AdminUser
}

export interface UpdateUserLimitsRequest {
  maxTopics?: number
  maxQuizzes?: number
  maxDocuments?: number
  allowedModels?: string[]
}

export interface UpdateUserLimitsResponse {
  message: string
  subscription: {
    id: string
    maxTopics: number
    maxQuizzes: number
    maxDocuments: number
    allowedModels: string[]
  }
}

export type DocumentStatus = "UPLOADING" | "PROCESSING" | "READY" | "ERROR"

export interface Document {
  id: string
  userId: string
  filename: string
  filePath: string
  fileSize: number
  mimeType: string
  status: DocumentStatus
  vectorized: boolean
  chunkCount: number
  createdAt: string
  updatedAt: string
}

export interface DocumentUploadResponse {
  message: string
  document: Document
}

export interface DocumentsListResponse {
  documents: Document[]
}

export interface DocumentGenerateQuizResponse {
  message: string
  quiz: {
    id: string
    topicId: string
  }
}

export interface DocumentQuizzesResponse {
  documentId: string
  quizzes: Array<{
    id: string
    title: string
    type: string
    difficulty: string
    createdAt: string | Date
    count: number
    status: string
    topicId?: string | null
    documentId?: string | null
  }>
  count: number
}

export interface DocumentChatsResponse {
  documentId: string
  sessions: Array<{
    id: string
    title: string | null
    model: string
    createdAt: string
    updatedAt: string
    _count?: {
      messages: number
    }
  }>
  count: number
}

export type ChatRole = "USER" | "ASSISTANT" | "SYSTEM"

export interface ChatMessage {
  id: string
  sessionId: string
  role: ChatRole
  content: string
  contextChunks?: Array<{
    chunkIndex: number
    chunkText: string
  }>
  tokenCount?: number
  createdAt: string
}

export interface ChatSession {
  id: string
  userId: string
  documentId: string | null
  title: string | null
  model: string
  createdAt: string
  updatedAt: string
  messages?: ChatMessage[]
}

export interface ChatSessionsResponse {
  sessions: ChatSession[]
}

export interface ChatSessionResponse {
  message?: string
  session: ChatSession
}

export interface ChatMessagesResponse {
  messages: ChatMessage[]
}

export interface SendChatMessageRequest {
  message: string
}

export interface SendChatMessageResponse {
  message: string
  contextUsed?: boolean
  contextChunks?: Array<{
    chunkIndex: number
    text: string
    similarity: number
  }>
  tokenUsage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

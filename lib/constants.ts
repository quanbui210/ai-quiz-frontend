// Application constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    CALLBACK: "/api/v1/auth/callback",
    SESSION: "/api/v1/auth/session",
    ME: "/api/v1/auth/me",
    SIGNOUT: "/api/v1/auth/signout",
  },
  TOPIC: {
    SUGGEST: "/api/v1/topic/suggest",
    CREATE: "/api/v1/topic/create",
    GET: (id: string) => `/api/v1/topic/${id}`,
    LIST: "/api/v1/topic/list",
    UPDATE: (id: string) => `/api/v1/topic/${id}`,
    DELETE: (id: string) => `/api/v1/topic/${id}`,
  },
  QUIZ: {
    SUGGEST_TOPIC: "/api/v1/quiz/suggest-topic",
    VALIDATE_TOPIC: "/api/v1/quiz/validate-topic",
    CREATE: "/api/v1/quiz/create",
    GET: (id: string) => `/api/v1/quiz/${id}`,
    LIST_BY_TOPIC: (topicId: string) => `/api/v1/quiz/list/${topicId}`,
    RESULTS: (id: string) => `/api/v1/results/quiz/${id}`,
    DELETE: (id: string) => `/api/v1/quiz/${id}`,
    PAUSE: (id: string) => `/api/v1/quiz/${id}/pause`,
    RESUME: (id: string) => `/api/v1/quiz/${id}/resume`,
  },
  ANALYTICS: {
    ME: "/api/v1/results/analytics/me",
  },
  SUBSCRIPTION: {
    PLANS: "/api/v1/subscription/plans",
    ME: "/api/v1/subscription/me",
    CREATE_CHECKOUT: "/api/v1/subscription/create-checkout",
    CANCEL: "/api/v1/subscription/cancel",
    RESUME: "/api/v1/subscription/resume",
    PORTAL: "/api/v1/subscription/portal",
  },
  ADMIN: {
    DASHBOARD: "/api/v1/admin/dashboard",
    USERS: "/api/v1/admin/users",
    USER: (userId: string) => `/api/v1/admin/users/${userId}`,
    USER_LIMITS: (userId: string) => `/api/v1/admin/users/${userId}/limits`,
    USER_SUBSCRIPTION: (userId: string) =>
      `/api/v1/admin/users/${userId}/subscription`,
    PLANS: "/api/v1/admin/plans",
  },
  DOCUMENT: {
    UPLOAD: "/api/v1/documents/upload",
    LIST: "/api/v1/documents",
    GET: (id: string) => `/api/v1/documents/${id}`,
    DELETE: (id: string) => `/api/v1/documents/${id}`,
    GENERATE_QUIZ: (id: string) => `/api/v1/documents/${id}/quiz`,
    QUIZZES: (id: string) => `/api/v1/documents/${id}/quizzes`,
    CHATS: (id: string) => `/api/v1/documents/${id}/chats`,
  },
  CHAT: {
    SESSIONS: "/api/v1/chat/sessions",
    SESSION: (id: string) => `/api/v1/chat/sessions/${id}`,
    CREATE_SESSION: "/api/v1/chat/sessions",
    MESSAGES: (sessionId: string) =>
      `/api/v1/chat/sessions/${sessionId}/messages`,
    SEND_MESSAGE: (sessionId: string) =>
      `/api/v1/chat/sessions/${sessionId}/messages`,
    DELETE_SESSION: (sessionId: string) => `/api/v1/chat/sessions/${sessionId}`,
  },
} as const

export const APP_CONFIG = {
  APP_NAME: "QuizzAI",
} as const

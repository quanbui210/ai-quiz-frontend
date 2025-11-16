import { test, expect } from "@playwright/test"

const mockQuiz = {
  id: "quiz-123",
  title: "Test Quiz",
  count: 5,
  createdAt: "2024-01-01T00:00:00Z",
  difficulty: "INTERMEDIATE",
  status: "ACTIVE",
  timer: 900000,
  type: "MULTIPLE_CHOICE",
  questions: [
    {
      id: "q1",
      text: "What is the primary role of HTTP?",
      type: "MULTIPLE_CHOICE",
      options: ["Protocol", "Language", "Framework", "Database"],
    },
    {
      id: "q2",
      text: "What does REST stand for?",
      type: "MULTIPLE_CHOICE",
      options: [
        "Representational State Transfer",
        "Remote State Transfer",
        "Resource State Transfer",
        "Representative State Transfer",
      ],
    },
    {
      id: "q3",
      text: "What is a RESTful API?",
      type: "MULTIPLE_CHOICE",
      options: [
        "An API that follows REST principles",
        "A type of database",
        "A programming language",
        "A web framework",
      ],
    },
    {
      id: "q4",
      text: "What HTTP method is used for creating resources?",
      type: "MULTIPLE_CHOICE",
      options: ["GET", "POST", "PUT", "DELETE"],
    },
    {
      id: "q5",
      text: "What HTTP status code indicates success?",
      type: "MULTIPLE_CHOICE",
      options: ["200", "400", "500", "300"],
    },
  ],
}

test.describe("Quiz Pause/Resume Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          session: {
            access_token: "test-token",
          },
        }),
      })
    })

    await page.route("**/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "test-user-id",
            email: "test@example.com",
            name: "Test User",
          },
        }),
      })
    })

    await page.goto("/")
    await page.evaluate(() => {
      localStorage.setItem(
        "auth-storage",
        JSON.stringify({
          state: {
            user: {
              id: "test-user-id",
              email: "test@example.com",
              name: "Test User",
            },
            session: {
              access_token: "test-token",
            },
            isAuthenticated: true,
          },
        })
      )
    })

    await page.route("**/api/v1/quiz/quiz-123", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ quiz: mockQuiz }),
      })
    })

    await page.route("**/api/v1/quiz/quiz-123/resume", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "No paused attempt found" }),
      })
    })
  })

  test("should display quiz page with questions", async ({ page }) => {
    await page.goto("/quizzes/quiz-123")

    await expect(page.getByText("Test Quiz")).toBeVisible()
    await expect(page.getByText("What is the primary role of HTTP?")).toBeVisible()
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible()
  })

  test("should show pause button when timer is active", async ({ page }) => {
    await page.goto("/quizzes/quiz-123")

    const pauseButton = page.getByRole("button", { name: /pause/i })
    await expect(pauseButton).toBeVisible()
    await expect(pauseButton).toBeEnabled()
  })

  test("should pause quiz successfully", async ({ page }) => {
    let pauseRequest: any = null
    await page.route("**/api/v1/quiz/quiz-123/pause", async (route) => {
      const request = route.request()
      pauseRequest = request.postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          attemptId: "attempt-123",
          status: "PAUSED",
          elapsedTime: 300,
          answeredQuestions: 2,
          totalQuestions: 5,
        }),
      })
    })

    await page.goto("/quizzes/quiz-123")
    await page.getByText("Protocol").click()
    await page.waitForTimeout(100)
    await page.getByRole("button", { name: /next question/i }).click()
    await page.waitForTimeout(100)
    await page.getByText("Representational State Transfer").click()
    await page.waitForTimeout(100)
    await page.getByRole("button", { name: /pause/i }).click()
    await page.waitForResponse("**/api/v1/quiz/quiz-123/pause")
    expect(pauseRequest).toBeTruthy()
    expect(pauseRequest.answers).toHaveLength(2)
    expect(pauseRequest.answers[0].questionId).toBe("q1")
    expect(pauseRequest.answers[0].userAnswer).toBe("Protocol")
    expect(pauseRequest.elapsedTime).toBeGreaterThanOrEqual(0)
    await expect(page.getByText("Quiz Paused")).toBeVisible()
    await expect(
      page.getByText(/You've answered.*2.*out of.*5.*questions/i)
    ).toBeVisible()
    await page.getByRole("button", { name: /^ok$/i }).click()
    await expect(page.getByText("Quiz Paused")).not.toBeVisible()
  })

  test("should show error dialog when pause fails", async ({ page }) => {
    await page.route("**/api/v1/quiz/quiz-123/pause", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Failed to pause quiz" }),
      })
    })

    await page.goto("/quizzes/quiz-123")
    await page.getByRole("button", { name: /pause/i }).click()
    await page.waitForResponse("**/api/v1/quiz/quiz-123/pause")
    await expect(page.getByText("Error")).toBeVisible()
    await expect(page.getByText(/failed to pause quiz/i)).toBeVisible()
    await page.getByRole("button", { name: /^ok$/i }).click()
  })

  test("should check for paused attempt on page load", async ({ page }) => {
    await page.route("**/api/v1/quiz/quiz-123/resume", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          attemptId: "attempt-123",
          status: "PAUSED",
          elapsedTime: 300,
          questions: [
            {
              id: "q1",
              text: "What is the primary role of HTTP?",
              type: "MULTIPLE_CHOICE",
              options: ["Protocol", "Language", "Framework", "Database"],
              savedAnswer: "Protocol",
            },
            {
              id: "q2",
              text: "What does REST stand for?",
              type: "MULTIPLE_CHOICE",
              options: [
                "Representational State Transfer",
                "Remote State Transfer",
                "Resource State Transfer",
                "Representative State Transfer",
              ],
              savedAnswer: "Representational State Transfer",
            },
            {
              id: "q3",
              text: "What is a RESTful API?",
              type: "MULTIPLE_CHOICE",
              options: [
                "An API that follows REST principles",
                "A type of database",
                "A programming language",
                "A web framework",
              ],
              savedAnswer: null,
            },
            {
              id: "q4",
              text: "What HTTP method is used for creating resources?",
              type: "MULTIPLE_CHOICE",
              options: ["GET", "POST", "PUT", "DELETE"],
              savedAnswer: null,
            },
            {
              id: "q5",
              text: "What HTTP status code indicates success?",
              type: "MULTIPLE_CHOICE",
              options: ["200", "400", "500", "300"],
              savedAnswer: null,
            },
          ],
        }),
      })
    })

    await page.goto("/quizzes/quiz-123")
    await page.waitForResponse("**/api/v1/quiz/quiz-123/resume")
    await expect(page.getByRole("heading", { name: "Resume Quiz" })).toBeVisible()
    await expect(
      page.getByText(/You have a paused quiz/i)
    ).toBeVisible()
    await expect(page.getByText(/2 questions answered/i)).toBeVisible()
    await expect(
      page.getByRole("button", { name: /start fresh/i })
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: /resume quiz/i })
    ).toBeVisible()
  })

  test("should resume quiz with saved answers", async ({ page }) => {
    await page.route("**/api/v1/quiz/quiz-123/resume", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          attemptId: "attempt-123",
          status: "PAUSED",
          elapsedTime: 300,
          questions: [
            {
              id: "q1",
              text: "What is the primary role of HTTP?",
              type: "MULTIPLE_CHOICE",
              options: ["Protocol", "Language", "Framework", "Database"],
              savedAnswer: "Protocol",
            },
            {
              id: "q2",
              text: "What does REST stand for?",
              type: "MULTIPLE_CHOICE",
              options: [
                "Representational State Transfer",
                "Remote State Transfer",
                "Resource State Transfer",
                "Representative State Transfer",
              ],
              savedAnswer: "Representational State Transfer",
            },
            ...mockQuiz.questions.slice(2),
          ],
        }),
      })
    })

    await page.goto("/quizzes/quiz-123")
    await page.waitForResponse("**/api/v1/quiz/quiz-123/resume")
    await page.getByRole("button", { name: /resume quiz/i }).click()
    await page.waitForTimeout(500)
    const firstAnswer = page
      .locator('button:has-text("Protocol")')
      .first()
    await expect(firstAnswer).toHaveClass(/border-blue-500|bg-blue-50/)
    await page.getByRole("button", { name: /next question/i }).click()
    await page.waitForTimeout(100)
    const secondAnswer = page
      .locator('button:has-text("Representational State Transfer")')
      .first()
    await expect(secondAnswer).toHaveClass(/border-blue-500|bg-blue-50/)
    const timer = page.locator('text=/\\d+:\\d+/').first()
    await expect(timer).toBeVisible()
  })

  test("should start fresh when clicking Start Fresh button", async ({ page }) => {
    await page.route("**/api/v1/quiz/quiz-123/resume", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          attemptId: "attempt-123",
          status: "PAUSED",
          elapsedTime: 300,
          questions: mockQuiz.questions.map((q, i) => ({
            ...q,
            savedAnswer: i < 2 ? mockQuiz.questions[i].options[0] : null,
          })),
        }),
      })
    })

    await page.goto("/quizzes/quiz-123")
    await page.waitForResponse("**/api/v1/quiz/quiz-123/resume")
    await page.getByRole("button", { name: /start fresh/i }).click()
    await page.waitForTimeout(500)
    const firstAnswer = page.locator('button:has-text("Protocol")').first()
    await expect(firstAnswer).not.toHaveClass(/border-blue-500|bg-blue-50/)
    const timer = page.locator('text=/\\d+:\\d+/').first()
    await expect(timer).toBeVisible()
  })

  test("should not show resume dialog when no paused attempt exists", async ({
    page,
  }) => {
    await page.route("**/api/v1/quiz/quiz-123/resume", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "No paused attempt found" }),
      })
    })

    await page.goto("/quizzes/quiz-123")
    await page.waitForResponse("**/api/v1/quiz/quiz-123/resume")
    await expect(page.getByText("Resume Quiz")).not.toBeVisible()
    await expect(page.getByText("Test Quiz")).toBeVisible()
    await expect(page.getByText("What is the primary role of HTTP?")).toBeVisible()
  })

  test("should include attemptId in submit when resuming", async ({ page }) => {
    let submitRequest: any = null
    await page.route("**/api/v1/quiz/quiz-123/resume", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          attemptId: "attempt-123",
          status: "PAUSED",
          elapsedTime: 300,
          questions: mockQuiz.questions.map((q) => ({
            ...q,
            savedAnswer: null,
          })),
        }),
      })
    })

    await page.route("**/api/v1/quiz/quiz-123/submit", async (route) => {
      const request = route.request()
      submitRequest = request.postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          attemptId: "attempt-123",
          score: 100,
          correctCount: 5,
        }),
      })
    })

    await page.goto("/quizzes/quiz-123")
    await page.waitForResponse("**/api/v1/quiz/quiz-123/resume")
    await page.getByRole("button", { name: /resume quiz/i }).click()
    await page.waitForTimeout(500)
    for (let i = 0; i < mockQuiz.questions.length; i++) {
      const question = mockQuiz.questions[i]
      await page.getByText(question.options[0]).click()
      await page.waitForTimeout(100)
      if (i < mockQuiz.questions.length - 1) {
        await page.getByRole("button", { name: /next question/i }).click()
        await page.waitForTimeout(100)
      }
    }
    await page.getByRole("button", { name: /submit quiz/i }).click()
    await page.waitForResponse("**/api/v1/quiz/quiz-123/submit")
    expect(submitRequest).toBeTruthy()
    expect(submitRequest.attemptId).toBe("attempt-123")
    expect(submitRequest.answers).toHaveLength(5)
  })

  test("should stop timer when quiz is paused", async ({ page }) => {
    await page.route("**/api/v1/quiz/quiz-123/pause", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          attemptId: "attempt-123",
          status: "PAUSED",
          elapsedTime: 300,
          answeredQuestions: 0,
          totalQuestions: 5,
        }),
      })
    })

    await page.goto("/quizzes/quiz-123")
    await page.waitForTimeout(1000)
    const timerBefore = await page
      .locator('text=/\\d+:\\d+/')
      .first()
      .textContent()
    await page.waitForTimeout(2000)
    await page.getByRole("button", { name: /pause/i }).click()
    await page.waitForResponse("**/api/v1/quiz/quiz-123/pause")
    await page.waitForTimeout(2000)
    const timerAfter = await page
      .locator('text=/\\d+:\\d+/')
      .first()
      .textContent()
    expect(timerAfter).toBe(timerBefore)
  })

  test("should hide pause button after pausing", async ({ page }) => {
    await page.route("**/api/v1/quiz/quiz-123/pause", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          attemptId: "attempt-123",
          status: "PAUSED",
          elapsedTime: 300,
          answeredQuestions: 1,
          totalQuestions: 5,
        }),
      })
    })

    await page.goto("/quizzes/quiz-123")

    await page.getByRole("button", { name: /pause/i }).click()
    await page.waitForResponse("**/api/v1/quiz/quiz-123/pause")

    await page.getByRole("button", { name: /^ok$/i }).click()
    await page.waitForTimeout(100)

    await expect(page.getByRole("button", { name: /pause/i })).not.toBeVisible()
  })
})

test.describe("Quiz Generation and Validation", () => {
  const mockTopic = {
    id: "topic-123",
    name: "RESTful APIs",
    userId: "test-user-id",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  }

  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          session: {
            access_token: "test-token",
          },
        }),
      })
    })

    await page.route("**/api/v1/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "test-user-id",
            email: "test@example.com",
            name: "Test User",
          },
        }),
      })
    })

    await page.goto("/")
    await page.evaluate(() => {
      localStorage.setItem(
        "auth-storage",
        JSON.stringify({
          state: {
            user: {
              id: "test-user-id",
              email: "test@example.com",
              name: "Test User",
            },
            session: {
              access_token: "test-token",
            },
            isAuthenticated: true,
          },
        })
      )
    })

    await page.route("**/api/v1/topic/topic-123", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockTopic),
      })
    })

    await page.route("**/api/v1/quiz/list/topic-123", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([]),
      })
    })

    await page.route("**/api/v1/results/analytics/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          topics: [],
          overview: {
            overallProgress: 0,
          },
          weeklyComparison: {
            attempts: { thisWeek: 0, lastWeek: 0, change: 0 },
            topics: { thisWeek: 0, lastWeek: 0, change: 0 },
            progress: { thisWeek: 0, lastWeek: 0, change: 0 },
          },
        }),
      })
    })
  })

  test("should validate quiz topic name", async ({ page }) => {
    let validateRequest: any = null

    await page.route("**/api/v1/quiz/validate-topic", async (route) => {
      const request = route.request()
      validateRequest = request.postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isValid: true,
          message: "Quiz topic is valid",
        }),
      })
    })

    await page.goto("/topics/topic-123")
    await page.getByRole("button", { name: /generate quiz/i }).click()
    await page.waitForTimeout(500)

    const input = page.getByPlaceholder(/enter quiz topic/i).first()
    await input.fill("HTTP Methods")
    await page.waitForTimeout(600)

    await page.waitForResponse("**/api/v1/quiz/validate-topic")
    expect(validateRequest).toBeTruthy()
    expect(validateRequest.name).toBe("HTTP Methods")
    expect(validateRequest.method).toBe("POST")
  })

  test("should show validation error for invalid topic", async ({ page }) => {
    await page.route("**/api/v1/quiz/validate-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isValid: false,
          message: "Topic name is too short",
        }),
      })
    })

    await page.goto("/topics/topic-123")
    await page.getByRole("button", { name: /generate quiz/i }).click()
    await page.waitForTimeout(500)

    const input = page.getByPlaceholder(/enter quiz topic/i).first()
    await input.fill("Hi")
    await page.waitForTimeout(600)

    await page.waitForResponse("**/api/v1/quiz/validate-topic")
    await expect(page.getByText(/topic name is too short/i)).toBeVisible()
  })

  test("should show validation success indicator", async ({ page }) => {
    await page.route("**/api/v1/quiz/validate-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isValid: true,
          message: "Valid topic",
        }),
      })
    })

    await page.goto("/topics/topic-123")
    await page.getByRole("button", { name: /generate quiz/i }).click()
    await page.waitForTimeout(500)

    const input = page.getByPlaceholder(/enter quiz topic/i).first()
    await input.fill("REST API Design")
    await page.waitForTimeout(600)

    await page.waitForResponse("**/api/v1/quiz/validate-topic")
    await expect(page.locator('svg[class*="text-green"], [data-testid="check-icon"]').first()).toBeVisible()
  })

  test("should create quiz successfully", async ({ page }) => {
    let createRequest: any = null

    await page.route("**/api/v1/quiz/suggest-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          topics: ["REST API Design", "HTTP Methods", "API Best Practices"],
        }),
      })
    })

    await page.route("**/api/v1/quiz/validate-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isValid: true,
          message: "Valid topic",
        }),
      })
    })

    await page.route("**/api/v1/quiz/create", async (route) => {
      const request = route.request()
      createRequest = request.postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          quiz: {
            id: "new-quiz-123",
            title: "REST API Design",
            topicId: "topic-123",
            createdAt: "2024-01-01T00:00:00Z",
          },
        }),
      })
    })

    await page.goto("/topics/topic-123")
    await page.getByRole("button", { name: /generate quiz/i }).click()
    await page.waitForTimeout(500)

    const input = page.getByPlaceholder(/enter quiz topic/i).first()
    await input.fill("REST API Design")
    await page.waitForTimeout(600)

    await page.getByRole("button", { name: /create quiz/i }).click()
    await page.waitForResponse("**/api/v1/quiz/create")

    expect(createRequest).toBeTruthy()
    expect(createRequest.title).toBe("REST API Design")
    expect(createRequest.topicId).toBe("topic-123")
    expect(createRequest.userId).toBe("test-user-id")
    expect(createRequest.questionCount).toBe(15)
    expect(createRequest.difficulty).toBe("INTERMEDIATE")
    expect(createRequest.quizType).toBe("MULTIPLE_CHOICE")
  })

  test("should create quiz with custom timer", async ({ page }) => {
    let createRequest: any = null

    await page.route("**/api/v1/quiz/suggest-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          topics: ["REST API Design"],
        }),
      })
    })

    await page.route("**/api/v1/quiz/validate-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isValid: true,
        }),
      })
    })

    await page.route("**/api/v1/quiz/create", async (route) => {
      const request = route.request()
      createRequest = request.postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          quiz: {
            id: "new-quiz-123",
            title: "REST API Design",
            topicId: "topic-123",
            createdAt: "2024-01-01T00:00:00Z",
          },
        }),
      })
    })

    await page.goto("/topics/topic-123")
    await page.getByRole("button", { name: /generate quiz/i }).click()
    await page.waitForTimeout(500)

    await page.getByLabel(/timer/i).click()
    await page.getByText(/30 minutes/i).click()

    const input = page.getByPlaceholder(/enter quiz topic/i).first()
    await input.fill("REST API Design")
    await page.waitForTimeout(600)

    await page.getByRole("button", { name: /create quiz/i }).click()
    await page.waitForResponse("**/api/v1/quiz/create")

    expect(createRequest.timer).toBe(1800000)
  })

  test("should create quiz without timer", async ({ page }) => {
    let createRequest: any = null

    await page.route("**/api/v1/quiz/suggest-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          topics: ["REST API Design"],
        }),
      })
    })

    await page.route("**/api/v1/quiz/validate-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isValid: true,
        }),
      })
    })

    await page.route("**/api/v1/quiz/create", async (route) => {
      const request = route.request()
      createRequest = request.postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          quiz: {
            id: "new-quiz-123",
            title: "REST API Design",
            topicId: "topic-123",
            createdAt: "2024-01-01T00:00:00Z",
          },
        }),
      })
    })

    await page.goto("/topics/topic-123")
    await page.getByRole("button", { name: /generate quiz/i }).click()
    await page.waitForTimeout(500)

    await page.getByLabel(/timer/i).click()
    await page.getByText(/no timer/i).click()

    const input = page.getByPlaceholder(/enter quiz topic/i).first()
    await input.fill("REST API Design")
    await page.waitForTimeout(600)

    await page.getByRole("button", { name: /create quiz/i }).click()
    await page.waitForResponse("**/api/v1/quiz/create")

    expect(createRequest.timer).toBeUndefined()
  })

  test("should show error when quiz creation fails", async ({ page }) => {
    await page.route("**/api/v1/quiz/suggest-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          topics: ["REST API Design"],
        }),
      })
    })

    await page.route("**/api/v1/quiz/validate-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isValid: true,
        }),
      })
    })

    await page.route("**/api/v1/quiz/create", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Failed to create quiz",
        }),
      })
    })

    await page.goto("/topics/topic-123")
    await page.getByRole("button", { name: /generate quiz/i }).click()
    await page.waitForTimeout(500)

    const input = page.getByPlaceholder(/enter quiz topic/i).first()
    await input.fill("REST API Design")
    await page.waitForTimeout(600)

    await page.getByRole("button", { name: /create quiz/i }).click()
    await page.waitForResponse("**/api/v1/quiz/create")
    await page.waitForTimeout(500)

    await expect(page.getByText(/failed to create quiz/i)).toBeVisible()
  })

  test("should select suggestion and create quiz", async ({ page }) => {
    let createRequest: any = null

    await page.route("**/api/v1/quiz/suggest-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          topics: ["REST API Design", "HTTP Methods", "API Best Practices"],
        }),
      })
    })

    await page.route("**/api/v1/quiz/validate-topic", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          isValid: true,
        }),
      })
    })

    await page.route("**/api/v1/quiz/create", async (route) => {
      const request = route.request()
      createRequest = request.postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          quiz: {
            id: "new-quiz-123",
            title: "HTTP Methods",
            topicId: "topic-123",
            createdAt: "2024-01-01T00:00:00Z",
          },
        }),
      })
    })

    await page.goto("/topics/topic-123")
    await page.getByRole("button", { name: /generate quiz/i }).click()
    await page.waitForTimeout(500)

    await page.waitForResponse("**/api/v1/quiz/suggest-topic")
    await page.getByText("HTTP Methods").click()
    await page.waitForTimeout(300)

    await page.getByRole("button", { name: /create quiz/i }).click()
    await page.waitForResponse("**/api/v1/quiz/create")

    expect(createRequest.title).toBe("HTTP Methods")
  })
})


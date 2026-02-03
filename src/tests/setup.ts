import { expect, afterEach, vi, beforeAll } from 'vitest'
import '@testing-library/jest-dom'

// Set up environment variables BEFORE any tests run
beforeAll(() => {
  vi.stubEnv('VITE_WEATHERSTACK_KEY', '6117e9e1a1f7c8e0caf37c601d9da981')
  vi.stubEnv('VITE_WEATHERSTACK_BASE_URL', 'http://api.weatherstack.com')
})

// Mock fetch globally for all tests
vi.stubGlobal('fetch', vi.fn())

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks()
})


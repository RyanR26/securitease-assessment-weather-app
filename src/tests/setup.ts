import { afterEach, vi, beforeAll } from 'vitest'
import '@testing-library/jest-dom'

// Set up environment variables BEFORE any tests run
beforeAll(() => {
  vi.stubEnv('VITE_WEATHER_API_KEY', '74e6d7b015084305b61161544260402')
  vi.stubEnv('VITE_WEATHER_API_BASE_URL', 'http://api.weatherapi.com/v1')
})

// Mock fetch globally for all tests
vi.stubGlobal('fetch', vi.fn())

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks()
})


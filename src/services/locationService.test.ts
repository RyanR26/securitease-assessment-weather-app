import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getUserLocation, getLocationFromCoordinates, getCurrentLocationString } from '@/services/locationService'

describe('locationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getUserLocation', () => {
    it('should return coordinates when geolocation is available and permission granted', async () => {
      const mockPosition = {
        coords: {
          latitude: 51.5085,
          longitude: -0.1257,
        },
      }

      const mockGetCurrentPosition = vi.fn((success) => {
        success(mockPosition)
      })

      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      })

      const result = await getUserLocation()

      expect(result).toEqual({
        latitude: 51.5085,
        longitude: -0.1257,
      })
      expect(mockGetCurrentPosition).toHaveBeenCalled()
    })

    it('should return null when geolocation is not supported', async () => {
      Object.defineProperty(navigator, 'geolocation', {
        value: undefined,
        configurable: true,
      })

      const result = await getUserLocation()

      expect(result).toBeNull()
    })

    it('should return null when user denies permission', async () => {
      const mockError = new Error('User denied geolocation')

      const mockGetCurrentPosition = vi.fn((_success, error) => {
        error(mockError)
      })

      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      })

      const result = await getUserLocation()

      expect(result).toBeNull()
      expect(mockGetCurrentPosition).toHaveBeenCalled()
    })

    it('should pass correct options to getCurrentPosition', async () => {
      const mockPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      }

      const mockGetCurrentPosition = vi.fn((success) => {
        success(mockPosition)
      })

      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      })

      await getUserLocation()

      expect(mockGetCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      )
    })
  })

  describe('getLocationFromCoordinates', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn())
    })

    it('should return location string when API call succeeds', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          location: {
            name: 'London',
            country: 'United Kingdom',
          },
        }),
      }

      vi.mocked(fetch).mockResolvedValue(mockResponse as any)

      const result = await getLocationFromCoordinates(51.5085, -0.1257)

      expect(result).toBe('London, United Kingdom')
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('51.5085%2C-0.1257')
      )
    })

    it('should return null when API returns error', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          error: {
            message: 'Invalid coordinates',
          },
        }),
      }

      vi.mocked(fetch).mockResolvedValue(mockResponse as any)

      const result = await getLocationFromCoordinates(999, 999)

      expect(result).toBeNull()
    })

    it('should return null when API response is not ok', async () => {
      const mockResponse = {
        ok: false,
        statusText: 'Not Found',
      }

      vi.mocked(fetch).mockResolvedValue(mockResponse as any)

      const result = await getLocationFromCoordinates(51.5085, -0.1257)

      expect(result).toBeNull()
    })

    it('should return null when location data is incomplete', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          location: {
            name: 'London',
            // Missing country
          },
        }),
      }

      vi.mocked(fetch).mockResolvedValue(mockResponse as any)

      const result = await getLocationFromCoordinates(51.5085, -0.1257)

      expect(result).toBeNull()
    })

    it('should return null when fetch throws an error', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      const result = await getLocationFromCoordinates(51.5085, -0.1257)

      expect(result).toBeNull()
    })
  })

  describe('getCurrentLocationString', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn())
    })

    it('should return location string when both geolocation and API succeed', async () => {
      const mockPosition = {
        coords: {
          latitude: 51.5085,
          longitude: -0.1257,
        },
      }

      const mockGetCurrentPosition = vi.fn((success) => {
        success(mockPosition)
      })

      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      })

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          location: {
            name: 'London',
            country: 'United Kingdom',
          },
        }),
      }

      vi.mocked(fetch).mockResolvedValue(mockResponse as any)

      const result = await getCurrentLocationString()

      expect(result).toBe('London, United Kingdom')
    })

    it('should return null when geolocation fails', async () => {
      const mockGetCurrentPosition = vi.fn((_success, error) => {
        error(new Error('Permission denied'))
      })

      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      })

      const result = await getCurrentLocationString()

      expect(result).toBeNull()
    })

    it('should return null when API call fails', async () => {
      const mockPosition = {
        coords: {
          latitude: 51.5085,
          longitude: -0.1257,
        },
      }

      const mockGetCurrentPosition = vi.fn((success) => {
        success(mockPosition)
      })

      Object.defineProperty(navigator, 'geolocation', {
        value: { getCurrentPosition: mockGetCurrentPosition },
        configurable: true,
      })

      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      const result = await getCurrentLocationString()

      expect(result).toBeNull()
    })
  })
})


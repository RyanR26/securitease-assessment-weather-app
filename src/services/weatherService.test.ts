import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCurrentWeather, getForecast } from './weatherService'

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentWeather', () => {
    it('should fetch and transform current weather data', async () => {
      const mockResponse = {
        current: {
          temperature: 25,
          feelslike: 24,
          weather_descriptions: ['Sunny'],
          weather_icons: ['http://icon.url'],
          humidity: 65,
          wind_speed: 10,
          wind_degree: 180,
          pressure: 1013,
          visibility: 10,
          uv_index: 7,
        },
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getCurrentWeather('London')

      expect(result).toEqual({
        temperature: 25,
        feelsLike: 24,
        condition: 'Sunny',
        icon: 'http://icon.url',
        humidity: 65,
        windSpeed: 10,
        windDirection: 180,
        pressure: 1013,
        visibility: 10,
        uvIndex: 7,
      })

      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringContaining('query=London'),
        { signal: undefined }
      )
    })

    it('should throw error when API returns error', async () => {
      const mockResponse = {
        error: {
          code: 615,
          info: 'Request failed',
        },
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await expect(getCurrentWeather('InvalidCity')).rejects.toThrow(
        'Weather service error'
      )
    })

    it('should throw error on network failure', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(
        new Error('Network error')
      )

      await expect(getCurrentWeather('London')).rejects.toThrow(
        'Weather service error'
      )
    })

    it('should throw error on HTTP error status', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response)

      await expect(getCurrentWeather('London')).rejects.toThrow()
    })
  })

  describe('getForecast', () => {
    it('should fetch and transform forecast data', async () => {
      const mockResponse = {
        forecast: {
          forecastday: [
            {
              date: '2024-01-15',
              maxtemp: 28,
              mintemp: 20,
              avgtemp: 24,
              description: 'Sunny',
              icon: 'http://icon.url',
              chanceofrainmm: 10,
              totalsnowinches: 0,
              avghumidity: 60,
              avgwind_kmph: 12,
            },
          ],
        },
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getForecast('London', 1)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        date: '2024-01-15',
        maxTemp: 28,
        minTemp: 20,
        avgTemp: 24,
        condition: 'Sunny',
        icon: 'http://icon.url',
        precipitationChance: 10,
        precipitationAmount: 0,
        humidity: 60,
        windSpeed: 12,
      })
    })

    it('should clamp days between 1 and 10', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ forecast: { forecastday: [] } }),
      } as Response)

      await getForecast('London', 15)

      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringContaining('forecast_days=10'),
        { signal: undefined }
      )
    })

    it('should use default 7 days when not specified', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ forecast: { forecastday: [] } }),
      } as Response)

      await getForecast('London')

      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringContaining('forecast_days=7'),
        { signal: undefined }
      )
    })
  })
})

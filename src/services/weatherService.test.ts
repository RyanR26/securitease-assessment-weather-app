import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCurrentWeather, getForecastWeather, getHistoricalWeather } from './weatherService'

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCurrentWeather', () => {
    it('should fetch and transform current weather data', async () => {
      const mockResponse = {
        current: {
          temp_c: 25,
          feelslike_c: 24,
          condition: {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/128x128/day/113.png',
          },
          humidity: 65,
          wind_kph: 10,
          wind_degree: 180,
          pressure_mb: 1013,
          vis_km: 10,
          uv: 7,
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
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
        humidity: 65,
        windSpeed: 10,
        windDirection: 180,
        pressure: 1013,
        visibility: 10,
        uvIndex: 7,
      })

      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringContaining('q=London'),
        { signal: undefined }
      )
    })

    it('should throw error when API returns error', async () => {
      const mockResponse = {
        error: {
          code: 1006,
          message: 'No matching location found.',
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

  describe('getForecastWeather', () => {
    it('should fetch and transform forecast data', async () => {
      const mockResponse = {
        forecast: {
          forecastday: [
            {
              date: '2024-01-15',
              day: {
                maxtemp_c: 28,
                mintemp_c: 20,
                avgtemp_c: 24,
                condition: {
                  text: 'Sunny',
                  icon: '//cdn.weatherapi.com/weather/128x128/day/113.png',
                },
                daily_chance_of_rain: 10,
                totalprecip_mm: 0,
                avghumidity: 60,
                maxwind_kph: 12,
              },
            },
          ],
        },
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getForecastWeather('London', 1)

      expect(result).toHaveLength(1)
      expect(result![0]).toEqual({
        date: '2024-01-15',
        maxTemp: 28,
        minTemp: 20,
        avgTemp: 24,
        condition: 'Sunny',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
        precipitationChance: 10,
        precipitationAmount: 0,
        humidity: 60,
        windSpeed: 12,
      })
    })

    it('should clamp days between 1 and 3', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ forecast: { forecastday: [] } }),
      } as Response)

      await getForecastWeather('London', 15)

      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringContaining('days=3'),
        { signal: undefined }
      )
    })

    it('should use default 3 days when not specified', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ forecast: { forecastday: [] } }),
      } as Response)

      await getForecastWeather('London')

      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringContaining('days=3'),
        { signal: undefined }
      )
    })
  })

  describe('getHistoricalWeather', () => {
    it('should fetch and transform historical weather data', async () => {
      const mockResponse = {
        forecast: {
          forecastday: [
            {
              date: '2024-01-10',
              day: {
                maxtemp_c: 22,
                mintemp_c: 15,
                avgtemp_c: 18,
                condition: {
                  text: 'Cloudy',
                  icon: '//cdn.weatherapi.com/weather/128x128/day/122.png',
                },
                daily_chance_of_rain: 30,
                totalprecip_mm: 5,
                avghumidity: 70,
                maxwind_kph: 15,
              },
            },
          ],
        },
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getHistoricalWeather('London', 1)

      expect(result).toHaveLength(1)
      expect(result![0]).toEqual({
        date: '2024-01-10',
        maxTemp: 22,
        minTemp: 15,
        avgTemp: 18,
        condition: 'Cloudy',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/122.png',
        precipitationChance: 30,
        precipitationAmount: 5,
        humidity: 70,
        windSpeed: 15,
      })
    })

    it('should use default 7 days when not specified', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ forecast: { forecastday: [] } }),
      } as Response)

      await getHistoricalWeather('London')

      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringContaining('dt='),
        { signal: undefined }
      )
      expect(vi.mocked(fetch)).toHaveBeenCalledWith(
        expect.stringContaining('end_dt='),
        { signal: undefined }
      )
    })

    it('should throw error when API returns error', async () => {
      const mockResponse = {
        error: {
          code: 1006,
          message: 'No matching location found.',
        },
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      await expect(getHistoricalWeather('InvalidCity')).rejects.toThrow(
        'Weather service error'
      )
    })

    it('should throw error on network failure', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(
        new Error('Network error')
      )

      await expect(getHistoricalWeather('London')).rejects.toThrow(
        'Weather service error'
      )
    })
  })
})

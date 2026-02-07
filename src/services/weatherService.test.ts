import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getCurrentWeather, getForecastWeather, getHistoricalWeather, filterHistoricalDataByLocalTime } from './weatherService'
import { clearAllCache } from './cacheService'
import type { ForecastDay } from '@/types'

describe('weatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearAllCache()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getCurrentWeather', () => {
    it('should fetch and transform current weather data', async () => {
      const mockResponse = {
        location: {
          name: 'London',
          country: 'United Kingdom',
          lat: 51.5085,
          lon: -0.1257,
          localtime: '2024-01-15 14:30:00',
          tz_id: 'Europe/London',
        },
        current: {
          temp_c: 25,
          temp_f: 77,
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
          precip_mm: 0,
          chance_of_rain: 0,
        },
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await getCurrentWeather('London')

      expect(result).toEqual({
        location: 'London',
        country: 'United Kingdom',
        latitude: 51.5085,
        longitude: -0.1257,
        localTime: '2024-01-15 14:30:00',
        timeZoneId: 'Europe/London',
        temperature: 25,
        temperatureF: 77,
        feelsLike: 24,
        condition: 'Sunny',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
        humidity: 65,
        precipitation: 0,
        chanceOfRain: 0,
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
                maxtemp_f: 82,
                mintemp_f: 68,
                avgtemp_f: 75,
                condition: {
                  text: 'Sunny',
                  icon: '//cdn.weatherapi.com/weather/128x128/day/113.png',
                },
                daily_chance_of_rain: 10,
                totalprecip_mm: 0,
                avghumidity: 60,
                maxwind_kph: 12,
                avgvis_km: 10,
                uv: 7,
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
        maxTempF: 82,
        minTempF: 68,
        avgTempF: 75,
        condition: 'Sunny',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
        precipitationChance: 10,
        precipitationAmount: 0,
        humidity: 60,
        windSpeed: 12,
        maxWindSpeed: 12,
        visibility: 10,
        uvIndex: 7,
      })
    })
  })

  describe('getHistoricalWeather', () => {
    it('should fetch and transform historical weather data', async () => {
      const mockResponse = {
        location: {
          localtime: '2024-01-10 12:00:00',
        },
        forecast: {
          forecastday: [
            {
              date: '2024-01-10',
              day: {
                maxtemp_c: 22,
                mintemp_c: 15,
                avgtemp_c: 18,
                maxtemp_f: 72,
                mintemp_f: 59,
                avgtemp_f: 64,
                condition: {
                  text: 'Cloudy',
                  icon: '//cdn.weatherapi.com/weather/128x128/day/122.png',
                },
                daily_chance_of_rain: 30,
                totalprecip_mm: 5,
                avghumidity: 70,
                maxwind_kph: 15,
                avgvis_km: 8,
                uv: 3,
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
        maxTempF: 72,
        minTempF: 59,
        avgTempF: 64,
        condition: 'Cloudy',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/122.png',
        precipitationChance: 30,
        precipitationAmount: 5,
        humidity: 70,
        windSpeed: 15,
        maxWindSpeed: 15,
        visibility: 8,
        uvIndex: 3,
      })
    })

    it('should use default 7 days when not specified', async () => {
      const mockResponse = {
        location: { localtime: '2024-01-15 12:00:00' },
        forecast: {
          forecastday: [
            {
              date: '2024-01-09',
              day: {
                maxtemp_c: 20,
                mintemp_c: 15,
                avgtemp_c: 17,
                maxtemp_f: 68,
                mintemp_f: 59,
                avgtemp_f: 63,
                condition: { text: 'Cloudy', icon: '//cdn.weatherapi.com/weather/128x128/day/122.png' },
                daily_chance_of_rain: 30,
                totalprecip_mm: 5,
                avghumidity: 70,
                maxwind_kph: 15,
                avgvis_km: 8,
                uv: 3,
              },
            },
          ],
        },
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
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

  describe('filterHistoricalDataByLocalTime', () => {
    beforeEach(() => {
      // Mock the current date to 2024-01-15 for consistent testing
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
    })

    const mockForecastDays = [
      {
        date: '2024-01-10',
        maxTemp: 20,
        minTemp: 15,
        avgTemp: 17,
        maxTempF: 68,
        minTempF: 59,
        avgTempF: 63,
        condition: 'Cloudy',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/122.png',
        precipitationChance: 30,
        precipitationAmount: 5,
        humidity: 70,
        windSpeed: 15,
        maxWindSpeed: 15,
        visibility: 8,
        uvIndex: 3,
      },
      {
        date: '2024-01-11',
        maxTemp: 22,
        minTemp: 16,
        avgTemp: 19,
        maxTempF: 72,
        minTempF: 61,
        avgTempF: 66,
        condition: 'Sunny',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
        precipitationChance: 10,
        precipitationAmount: 0,
        humidity: 60,
        windSpeed: 12,
        maxWindSpeed: 12,
        visibility: 10,
        uvIndex: 7,
      },
      {
        date: '2024-01-12',
        maxTemp: 24,
        minTemp: 18,
        avgTemp: 21,
        maxTempF: 75,
        minTempF: 64,
        avgTempF: 70,
        condition: 'Rainy',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/302.png',
        precipitationChance: 80,
        precipitationAmount: 10,
        humidity: 80,
        windSpeed: 20,
        maxWindSpeed: 20,
        visibility: 5,
        uvIndex: 2,
      },
      {
        date: '2024-01-13',
        maxTemp: 23,
        minTemp: 17,
        avgTemp: 20,
        maxTempF: 73,
        minTempF: 63,
        avgTempF: 68,
        condition: 'Partly Cloudy',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/116.png',
        precipitationChance: 20,
        precipitationAmount: 2,
        humidity: 65,
        windSpeed: 10,
        maxWindSpeed: 10,
        visibility: 9,
        uvIndex: 5,
      },
      {
        date: '2024-01-14',
        maxTemp: 25,
        minTemp: 19,
        avgTemp: 22,
        maxTempF: 77,
        minTempF: 66,
        avgTempF: 72,
        condition: 'Clear',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
        precipitationChance: 0,
        precipitationAmount: 0,
        humidity: 55,
        windSpeed: 8,
        maxWindSpeed: 8,
        visibility: 10,
        uvIndex: 8,
      },
    ] as [ForecastDay, ForecastDay, ForecastDay, ForecastDay, ForecastDay]

    it('should return last 3 days when localTime is in the future', () => {
      const result = filterHistoricalDataByLocalTime(mockForecastDays, '2024-01-16 12:00:00')

      expect(result).toHaveLength(3)
      expect(result[0].date).toBe('2024-01-12')
      expect(result[1].date).toBe('2024-01-13')
      expect(result[2].date).toBe('2024-01-14')
    })

    it('should return first 3 days when localTime is in the past', () => {
      const result = filterHistoricalDataByLocalTime(mockForecastDays, '2024-01-08 12:00:00')

      expect(result).toHaveLength(3)
      expect(result[0].date).toBe('2024-01-10')
      expect(result[1].date).toBe('2024-01-11')
    })

    it('should return middle 3 days when localTime is today', () => {
      const result = filterHistoricalDataByLocalTime(mockForecastDays, '2024-01-15 12:00:00')

      expect(result).toHaveLength(3)
      expect(result[0].date).toBe('2024-01-11')
      expect(result[1].date).toBe('2024-01-12')
      expect(result[2].date).toBe('2024-01-13')
    })

    it('should return correct data structure for future dates', () => {
      const result = filterHistoricalDataByLocalTime(mockForecastDays, '2024-01-16 12:00:00')

      // When localTime is in the future, returns last 3 days: [2024-01-12, 2024-01-13, 2024-01-14]
      expect(result[0]).toEqual({
        date: '2024-01-12',
        maxTemp: 24,
        minTemp: 18,
        avgTemp: 21,
        maxTempF: 75,
        minTempF: 64,
        avgTempF: 70,
        condition: 'Rainy',
        icon: 'https://cdn.weatherapi.com/weather/128x128/day/302.png',
        precipitationChance: 80,
        precipitationAmount: 10,
        humidity: 80,
        windSpeed: 20,
        maxWindSpeed: 20,
        visibility: 5,
        uvIndex: 2,
      })
    })
  })
})

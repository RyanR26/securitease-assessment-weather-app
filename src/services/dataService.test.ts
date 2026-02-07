import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCurrentWeatherData, getForecastWeatherData, getHistoricalWeatherData } from '@/services/dataService'
import * as weatherService from '@/services/weatherService'
import { clearAllCache } from '@/services/cacheService'

vi.mock('./weatherService')

describe('dataService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearAllCache()
  })

  describe('getCurrentWeatherData', () => {
    it('should fetch from weather service and cache the result', async () => {
      const mockWeatherData = {
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
        windSpeed: 10,
        windDirection: 180,
        pressure: 1013,
        visibility: 10,
        uvIndex: 7,
        precipitation: 0,
        chanceOfRain: 0,
      }

      vi.mocked(weatherService.getCurrentWeather).mockResolvedValueOnce(mockWeatherData)

      const result = await getCurrentWeatherData('London')

      expect(result).toEqual(mockWeatherData)
      expect(weatherService.getCurrentWeather).toHaveBeenCalledWith('London', undefined)
    })

    it('should return cached data on second call', async () => {
      const mockWeatherData = {
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
        windSpeed: 10,
        windDirection: 180,
        pressure: 1013,
        visibility: 10,
        uvIndex: 7,
        precipitation: 0,
        chanceOfRain: 0,
      }

      vi.mocked(weatherService.getCurrentWeather).mockResolvedValueOnce(mockWeatherData)

      // First call
      const result1 = await getCurrentWeatherData('London')
      expect(result1).toEqual(mockWeatherData)

      // Second call should use cache
      const result2 = await getCurrentWeatherData('London')
      expect(result2).toEqual(mockWeatherData)

      // Weather service should only be called once
      expect(weatherService.getCurrentWeather).toHaveBeenCalledTimes(1)
    })

    it('should return null if weather service returns null', async () => {
      vi.mocked(weatherService.getCurrentWeather).mockResolvedValueOnce(null)

      const result = await getCurrentWeatherData('InvalidCity')

      expect(result).toBeNull()
    })
  })

  describe('getForecastWeatherData', () => {
    it('should fetch from weather service and cache the result', async () => {
      const mockForecastData = [
        {
          date: '2024-01-16',
          condition: 'Sunny',
          icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
          maxTemp: 28,
          minTemp: 20,
          avgTemp: 24,
          maxTempF: 82,
          minTempF: 68,
          avgTempF: 75,
          maxWindSpeed: 12,
          windSpeed: 10,
          humidity: 60,
          precipitationAmount: 0,
          precipitationChance: 10,
          visibility: 10,
          uvIndex: 7,
        },
      ]

      vi.mocked(weatherService.getForecastWeather).mockResolvedValueOnce(mockForecastData)

      const result = await getForecastWeatherData('London', 7)

      expect(result).toEqual(mockForecastData)
      expect(weatherService.getForecastWeather).toHaveBeenCalledWith('London', 7, undefined)
    })

    it('should return cached data on second call', async () => {
      const mockForecastData = [
        {
          date: '2024-01-16',
          condition: 'Sunny',
          icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
          maxTemp: 28,
          minTemp: 20,
          avgTemp: 24,
          maxTempF: 82,
          minTempF: 68,
          avgTempF: 75,
          maxWindSpeed: 12,
          windSpeed: 10,
          humidity: 60,
          precipitationAmount: 0,
          precipitationChance: 10,
          visibility: 10,
          uvIndex: 7,
        },
      ]

      vi.mocked(weatherService.getForecastWeather).mockResolvedValueOnce(mockForecastData)

      // First call
      const result1 = await getForecastWeatherData('London', 7)
      expect(result1).toEqual(mockForecastData)

      // Second call should use cache
      const result2 = await getForecastWeatherData('London', 7)
      expect(result2).toEqual(mockForecastData)

      // Weather service should only be called once
      expect(weatherService.getForecastWeather).toHaveBeenCalledTimes(1)
    })
  })

  describe('getHistoricalWeatherData', () => {
    it('should fetch from weather service and cache the result', async () => {
      const mockHistoricalData = [
        {
          date: '2024-01-10',
          condition: 'Cloudy',
          icon: 'https://cdn.weatherapi.com/weather/128x128/day/122.png',
          maxTemp: 22,
          minTemp: 15,
          avgTemp: 18,
          maxTempF: 72,
          minTempF: 59,
          avgTempF: 64,
          maxWindSpeed: 15,
          windSpeed: 15,
          humidity: 70,
          precipitationAmount: 5,
          precipitationChance: 30,
          visibility: 8,
          uvIndex: 3,
        },
      ]

      vi.mocked(weatherService.getHistoricalWeather).mockResolvedValueOnce(mockHistoricalData)

      const result = await getHistoricalWeatherData('London', 7)

      expect(result).toEqual(mockHistoricalData)
      expect(weatherService.getHistoricalWeather).toHaveBeenCalledWith('London', 7, undefined)
    })

    it('should return cached data on second call', async () => {
      const mockHistoricalData = [
        {
          date: '2024-01-10',
          condition: 'Cloudy',
          icon: 'https://cdn.weatherapi.com/weather/128x128/day/122.png',
          maxTemp: 22,
          minTemp: 15,
          avgTemp: 18,
          maxTempF: 72,
          minTempF: 59,
          avgTempF: 64,
          maxWindSpeed: 15,
          windSpeed: 15,
          humidity: 70,
          precipitationAmount: 5,
          precipitationChance: 30,
          visibility: 8,
          uvIndex: 3,
        },
      ]

      vi.mocked(weatherService.getHistoricalWeather).mockResolvedValueOnce(mockHistoricalData)

      // First call
      const result1 = await getHistoricalWeatherData('London', 7)
      expect(result1).toEqual(mockHistoricalData)

      // Second call should use cache
      const result2 = await getHistoricalWeatherData('London', 7)
      expect(result2).toEqual(mockHistoricalData)

      // Weather service should only be called once
      expect(weatherService.getHistoricalWeather).toHaveBeenCalledTimes(1)
    })
  })
})


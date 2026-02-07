import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { WeatherWidget } from './WeatherWidget'
import * as dataService from '@/services/dataService'
import * as locationService from '@/services/locationService'

vi.mock('@/services/dataService')
vi.mock('@/services/locationService')

const mockCurrentWeather = {
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

const mockForecastData = [
  {
    date: '2024-01-16',
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
  },
]

const mockHistoricalData = [
  {
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
  },
  {
    date: '2024-01-11',
    maxTemp: 23,
    minTemp: 16,
    avgTemp: 19,
    maxTempF: 73,
    minTempF: 61,
    avgTempF: 66,
    condition: 'Partly Cloudy',
    icon: 'https://cdn.weatherapi.com/weather/128x128/day/116.png',
    precipitationChance: 20,
    precipitationAmount: 2,
    humidity: 65,
    windSpeed: 12,
    maxWindSpeed: 12,
    visibility: 9,
    uvIndex: 5,
  },
  {
    date: '2024-01-12',
    maxTemp: 24,
    minTemp: 17,
    avgTemp: 20,
    maxTempF: 75,
    minTempF: 63,
    avgTempF: 68,
    condition: 'Clear',
    icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
    precipitationChance: 0,
    precipitationAmount: 0,
    humidity: 60,
    windSpeed: 10,
    maxWindSpeed: 10,
    visibility: 10,
    uvIndex: 7,
  },
  {
    date: '2024-01-13',
    maxTemp: 25,
    minTemp: 18,
    avgTemp: 21,
    maxTempF: 77,
    minTempF: 64,
    avgTempF: 70,
    condition: 'Sunny',
    icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
    precipitationChance: 0,
    precipitationAmount: 0,
    humidity: 55,
    windSpeed: 8,
    maxWindSpeed: 8,
    visibility: 10,
    uvIndex: 8,
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
]

describe('WeatherWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(locationService.getCurrentLocationString).mockResolvedValue(null)
    vi.mocked(dataService.getCurrentWeatherData).mockResolvedValue(mockCurrentWeather)
    vi.mocked(dataService.getForecastWeatherData).mockResolvedValue(mockForecastData)
    vi.mocked(dataService.getHistoricalWeatherData).mockResolvedValue(mockHistoricalData)
  })

  it('should render loading spinner initially', () => {
    render(<WeatherWidget initialLocation='London' />)
    expect(screen.getByText(/Loading weather/i)).toBeInTheDocument()
  })

  it('should render current weather after loading', async () => {
    render(<WeatherWidget initialLocation='London' />)
    
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument()
    })
  })

  it('should render weather timeline with historical and forecast data', async () => {
    render(<WeatherWidget initialLocation='London' />)
    
    await waitFor(() => {
      expect(screen.getByText('Weather Timeline')).toBeInTheDocument()
    })
  })

  it('should call data services with correct location', async () => {
    render(<WeatherWidget initialLocation='Paris' />)
    
    await waitFor(() => {
      expect(dataService.getCurrentWeatherData).toHaveBeenCalledWith('Paris', expect.any(AbortSignal))
      expect(dataService.getForecastWeatherData).toHaveBeenCalledWith('Paris', 4, expect.any(AbortSignal))
      expect(dataService.getHistoricalWeatherData).toHaveBeenCalledWith('Paris', 5, expect.any(AbortSignal))
    })
  })
})


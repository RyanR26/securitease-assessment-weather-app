import { CurrentWeather, ForecastDay, WeatherResponse, WeatherError } from '@/types'

interface ImportMetaEnv {
  readonly VITE_WEATHERSTACK_KEY: string
  readonly VITE_WEATHERSTACK_BASE_URL: string
}

/**
 * Gets the API key from environment variables
 */
function getApiKey(): string {
  const env = (import.meta as any).env as ImportMetaEnv
  return env.VITE_WEATHERSTACK_KEY
}

/**
 * Gets the base URL from environment variables
 */
function getBaseUrl(): string {
  const env = (import.meta as any).env as ImportMetaEnv
  return env.VITE_WEATHERSTACK_BASE_URL || 'http://api.weatherstack.com'
}

/**
 * Validates that the API key is configured
 */
function validateApiKey(): void {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error(
      'Weather API key is not configured. Please set VITE_WEATHERSTACK_KEY in your .env file.'
    )
  }
}

/**
 * Transforms raw API response to CurrentWeather type
 */
function transformCurrentWeather(data: any): CurrentWeather {
  return {
    temperature: data.temperature,
    feelsLike: data.feelslike,
    condition: data.weather_descriptions?.[0] || 'Unknown',
    icon: data.weather_icons?.[0] || '',
    humidity: data.humidity,
    windSpeed: data.wind_speed,
    windDirection: data.wind_degree,
    pressure: data.pressure,
    visibility: data.visibility,
    uvIndex: data.uv_index,
  }
}

/**
 * Transforms raw API response to ForecastDay type
 */
function transformForecastDay(data: any): ForecastDay {
  return {
    date: data.date,
    maxTemp: data.maxtemp,
    minTemp: data.mintemp,
    avgTemp: data.avgtemp,
    condition: data.description || 'Unknown',
    icon: data.icon || '',
    precipitationChance: data.chanceofrainmm || 0,
    precipitationAmount: data.totalsnowinches || 0,
    humidity: data.avghumidity,
    windSpeed: data.avgwind_kmph,
  }
}

/**
 * Fetches current weather for a location
 * @param location - City name or coordinates
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Current weather data
 */
export async function getCurrentWeather(
  location: string,
  signal?: AbortSignal
): Promise<CurrentWeather> {
  validateApiKey()

  try {
    const baseUrl = getBaseUrl()
    const apiKey = getApiKey()
    const url = new URL(`${baseUrl}/current`)
    url.searchParams.append('access_key', apiKey)
    url.searchParams.append('query', location)

    const response = await fetch(url.toString(), { signal })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      const error: WeatherError = {
        code: data.error.code,
        message: data.error.info,
        statusCode: response.status,
      }
      throw new Error(error.message)
    }

    return transformCurrentWeather(data.current)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch current weather'
    throw new Error(`Weather service error: ${message}`)
  }
}

/**
 * Fetches weather forecast for a location
 * @param location - City name or coordinates
 * @param days - Number of forecast days (1-10)
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Forecast data
 */
export async function getForecast(
  location: string,
  days: number = 7,
  signal?: AbortSignal
): Promise<ForecastDay[]> {
  validateApiKey()

  // Clamp days between 1 and 10
  const forecastDays = Math.max(1, Math.min(10, days))

  try {
    const baseUrl = getBaseUrl()
    const apiKey = getApiKey()
    const url = new URL(`${baseUrl}/forecast`)
    url.searchParams.append('access_key', apiKey)
    url.searchParams.append('query', location)
    url.searchParams.append('forecast_days', forecastDays.toString())

    const response = await fetch(url.toString(), { signal })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      const error: WeatherError = {
        code: data.error.code,
        message: data.error.info,
        statusCode: response.status,
      }
      throw new Error(error.message)
    }

    return data?.forecast?.forecastday.map(transformForecastDay)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch forecast'
    throw new Error(`Weather service error: ${message}`)
  }
}

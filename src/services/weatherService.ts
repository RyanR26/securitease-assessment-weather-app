import { CurrentWeather, ForecastDay, HistoricalWeatherData, WeatherError } from '@/types'
import { isAtLeastOneDayInFuture, isAtLeastOneDayInPast } from '@/utils/date'

interface ImportMetaEnv {
  readonly VITE_WEATHER_API_KEY: string
  readonly VITE_WEATHER_API_BASE_URL: string
}

/**
 * Gets the API key from environment variables
 */
function getApiKey(): string {
  const env = (import.meta as any).env as ImportMetaEnv
  return env.VITE_WEATHER_API_KEY
}

/**
 * Gets the base URL from environment variables
 */
function getBaseUrl(): string {
  const env = (import.meta as any).env as ImportMetaEnv
  return env.VITE_WEATHER_API_BASE_URL || 'http://api.weatherapi.com/v1'
}

/**
 * Validates that the API key is configured
 */
function validateApiKey(): void {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error(
      'Weather API key is not configured. Please set VITE_WEATHER_API_KEY in your .env file.'
    )
  }
}

/**
 * Transforms raw API response to CurrentWeather type
 */
export function transformCurrentWeather(data: any): CurrentWeather {
  const location = data.location
  const current = data.current
  return {
    location: location?.name || 'Unknown',
    country: location?.country || 'Unknown',
    latitude: location?.lat || 0,
    longitude: location?.lon || 0,
    localTime: location?.localtime || 'Unknown',
    timeZoneId: location?.tz_id || 'Unknown',
    temperature: current.temp_c,
    temperatureF: current.temp_f,
    feelsLike: current.feelslike_c,
    condition: current.condition?.text || 'Unknown',
    icon: current.condition?.icon ? `https:${current.condition.icon}` : '',
    humidity: current.humidity,
    precipitation: current.precip_mm,
    chanceOfRain: current.chance_of_rain,
    windSpeed: current.wind_kph,
    windDirection: current.wind_degree,
    pressure: current.pressure_mb,
    visibility: current.vis_km,
    uvIndex: current.uv,
  }
}

/**
 * Transforms raw API response to ForecastDay type
 */
export function transformForecastDay(data: any): ForecastDay {
  const day = data.day
  return {
    date: data.date,
    maxTemp: day.maxtemp_c,
    minTemp: day.mintemp_c,
    avgTemp: day.avgtemp_c,
    maxTempF: day.maxtemp_f,
    minTempF: day.mintemp_f,
    avgTempF: day.avgtemp_f,
    condition: day.condition?.text || 'Unknown',
    icon: day.condition?.icon ? `https:${day.condition.icon}` : '',
    precipitationChance: day.daily_chance_of_rain || 0,
    precipitationAmount: day.totalprecip_mm || 0,
    humidity: day.avghumidity,
    windSpeed: day.maxwind_kph,
    maxWindSpeed: day.maxwind_kph,
    visibility: day.avgvis_km || 0,
    uvIndex: day.uv || 0,
  }
}

/**
 * Filters historical weather data based on the local time
 * Returns the most relevant 3 days of historical data depending on whether the local time is in the past, present, or future
 * @param data - Tuple of exactly 5 already-transformed ForecastDay objects (historical data)
 * @param localTime - Local time string in format 'YYYY-MM-DD HH:MM:SS' or 'YYYY-MM-DD'
 * @returns Filtered array of 3 ForecastDay objects
 * @example
 * // If localTime is in the future, returns the last 3 days
 * filterHistoricalDataByLocalTime(historicalData, '2024-01-16 12:00:00') // [day2, day3, day4]
 * // If localTime is in the past, returns the first 3 days
 * filterHistoricalDataByLocalTime(historicalData, '2024-01-08 12:00:00') // [day0, day1, day2]
 * // If localTime is today, returns the middle 3 days
 * filterHistoricalDataByLocalTime(historicalData, '2024-01-15 12:00:00') // [day1, day2, day3]
 */
export function filterHistoricalDataByLocalTime(data: HistoricalWeatherData, localTime: string): ForecastDay[] {
    // Extract just the date part (YYYY-MM-DD) from localTime
    const localDate = localTime.split(' ')[0]

    // return last 3 days if in the future
    if (isAtLeastOneDayInFuture(localDate)) {
      return data.slice(-3)
    }
    // first 3 if in the past
    else if (isAtLeastOneDayInPast(localDate)) {
      return data.slice(0, 3)
    }
    // middle 3 days
    return data.slice(1, -1)
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
): Promise<CurrentWeather | null> {
  validateApiKey()

  try {
    const baseUrl = getBaseUrl()
    const apiKey = getApiKey()
    const url = new URL(`${baseUrl}/current.json`)
    url.searchParams.append('key', apiKey)
    url.searchParams.append('q', location)

    const response = await fetch(url.toString(), { signal })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      const error: WeatherError = {
        code: data.error.code,
        message: data.error.message,
        statusCode: response.status,
      }
      throw new Error(error.message)
    }

    return transformCurrentWeather(data)

  } catch (error) {
    return weatherServiceError(error)
  }
}

/**
 * Fetches weather forecast for a location
 * @param location - City name or coordinates
 * @param days - Number of forecast days (1-10)
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Forecast data
 */
export async function getForecastWeather(
  location: string,
  days: number = 7,
  signal?: AbortSignal
): Promise<ForecastDay[] | null> {
  validateApiKey()

  try {
    const baseUrl = getBaseUrl()
    const apiKey = getApiKey()
    const url = new URL(`${baseUrl}/forecast.json`)
    url.searchParams.append('key', apiKey)
    url.searchParams.append('q', location)
    url.searchParams.append('days', days.toString())

    const response = await fetch(url.toString(), { signal })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      const error: WeatherError = {
        code: data.error.code,
        message: data.error.message,
        statusCode: response.status,
      }
      throw new Error(error.message)
    }

    if (!data?.forecast?.forecastday.length) {
      throw new Error('Missing forecast data')
    }

    return data.forecast.forecastday.map(transformForecastDay)

  } catch (error) {
    return weatherServiceError(error)
  }
}

/**
 * Fetches historical weather for a location
 * @param location - City name or coordinates
 * @param days - Number of days to look back (default 7)
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Historical forecast data
 */
export async function getHistoricalWeather(
  location: string,
  days: number = 7,
  signal?: AbortSignal
): Promise<ForecastDay[] | null> {
  validateApiKey()

  try {
    const baseUrl = getBaseUrl()
    const apiKey = getApiKey()
    const url = new URL(`${baseUrl}/history.json`)

    // To accomodate different timezones, we need to get the current date in the location's timezone
    // To solve this we get historical data for 1 day before and 1 day after and then we can filter the data by timezone
    const endDate = new Date()
    endDate.setDate(endDate.getDate()) // yesterday
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - (days - 1))

    // Format YYYY-MM-DD
    const formatDate = (date: Date) => date.toISOString().split('T')[0]

    url.searchParams.append('key', apiKey)
    url.searchParams.append('q', location)
    url.searchParams.append('dt', formatDate(startDate))
    url.searchParams.append('end_dt', formatDate(endDate))

    const response = await fetch(url.toString(), { signal })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      const error: WeatherError = {
        code: data.error.code,
        message: data.error.message,
        statusCode: response.status,
      }
      throw new Error(error.message)
    }

    if (!data?.forecast?.forecastday.length) {
      throw new Error('Missing forecast data')
    }

    return data.forecast.forecastday.map(transformForecastDay)

  } catch (error) {
    return weatherServiceError(error)
  }
}

function weatherServiceError(error: any): null | never {
  if ((error as Error).name === 'AbortError') {
      console.log('Fetch aborted, no error thrown to caller')
      // Return null to indicate graceful handling,
      // preventing the error from propagating further.
      return null
    } 

    const message = error instanceof Error ? error.message : 'Failed to fetch current weather'
    throw new Error(`Weather service error: ${message}`)
}

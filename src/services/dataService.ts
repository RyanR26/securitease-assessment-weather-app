import { CurrentWeather, ForecastDay } from '@/types'
import { getCurrentWeather, getForecastWeather, getHistoricalWeather } from '@/services/weatherService'
import { getCachedData, setCachedData } from '@/services/cacheService'

/**
 * Gets current weather data with caching
 * Checks cache first, returns cached data if available and valid
 * Otherwise fetches from weather service and caches the result
 * @param location - City name or coordinates
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Current weather data
 */
export async function getCurrentWeatherData(
  location: string,
  signal?: AbortSignal
): Promise<CurrentWeather | null> {
  const cacheKey = `weather_current_${location}`
  
  // Check cache first
  const cachedData = getCachedData<CurrentWeather>(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // Fetch from weather service
  const weatherData = await getCurrentWeather(location, signal)
  
  // Cache the result if successful
  if (weatherData) {
    setCachedData(cacheKey, weatherData)
  }
  
  return weatherData
}

/**
 * Gets forecast weather data with caching
 * Checks cache first, returns cached data if available and valid
 * Otherwise fetches from weather service and caches the result
 * @param location - City name or coordinates
 * @param days - Number of forecast days (1-10)
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Forecast data
 */
export async function getForecastWeatherData(
  location: string,
  days: number = 7,
  signal?: AbortSignal
): Promise<ForecastDay[] | null> {
  const cacheKey = `weather_forecast_${location}_${days}`
  
  // Check cache first
  const cachedData = getCachedData<ForecastDay[]>(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // Fetch from weather service
  const forecastData = await getForecastWeather(location, days, signal)
  
  // Cache the result if successful
  if (forecastData) {
    setCachedData(cacheKey, forecastData)
  }
  
  return forecastData
}

/**
 * Gets historical weather data with caching
 * Checks cache first, returns cached data if available and valid
 * Otherwise fetches from weather service and caches the result
 * @param location - City name or coordinates
 * @param days - Number of days to look back (default 7)
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Historical forecast data
 */
export async function getHistoricalWeatherData(
  location: string,
  days: number = 7,
  signal?: AbortSignal
): Promise<ForecastDay[] | null> {
  const cacheKey = `weather_historical_${location}_${days}`
  
  // Check cache first
  const cachedData = getCachedData<ForecastDay[]>(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // Fetch from weather service
  const historicalData = await getHistoricalWeather(location, days, signal)
  
  // Cache the result if successful
  if (historicalData) {
    setCachedData(cacheKey, historicalData)
  }
  
  return historicalData
}


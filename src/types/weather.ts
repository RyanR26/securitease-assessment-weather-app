/**
 * Current weather conditions for a location
 */
export interface CurrentWeather {
  /** Location name */
  location: string
  /** Location country */
  country: string
  /** Latitude coordinate */
  latitude: number
  /** Longitude coordinate */
  longitude: number
  /** Local time in the location */
  localTime: string
  /** Time zone Id */
  timeZoneId: string
  /** Temperature in Celsius */
  temperature: number
  /** Temperature in Fahrenheit */
  temperatureF: number
  /** "Feels like" temperature in Celsius */
  feelsLike: number
  /** Weather condition (e.g., "Sunny", "Rainy", "Cloudy") */
  condition: string
  /** Weather condition icon/code */
  icon: string
  /** Humidity percentage (0-100) */
  humidity: number
  /** Precipitation in mm */
  precipitation: number
  /** Chance of rain (0-100) */
  chanceOfRain: number
  /** Wind speed in km/h */
  windSpeed: number
  /** Wind direction in degrees (0-360) */
  windDirection: number
  /** Atmospheric pressure in hPa */
  pressure: number
  /** Visibility in km */
  visibility: number
  /** UV index */
  uvIndex: number
}

/**
 * Weather forecast for a single day
 */
export interface ForecastDay {
  /** Date in ISO format (YYYY-MM-DD) */
  date: string
  /** Maximum temperature in Celsius */
  maxTemp: number
  /** Minimum temperature in Celsius */
  minTemp: number
  /** Average temperature in Celsius */
  avgTemp: number
  /** Maximum temperature in Fahrenheit */
  maxTempF: number
  /** Minimum temperature in Fahrenheit */
  minTempF: number
  /** Average temperature in Fahrenheit */
  avgTempF: number
  /** Weather condition */
  condition: string
  /** Weather condition icon/code */
  icon: string
  /** Chance of precipitation (0-100) */
  precipitationChance: number
  /** Precipitation amount in mm */
  precipitationAmount: number
  /** Average humidity (0-100) */
  humidity: number
  /** Average wind speed in km/h */
  windSpeed: number
  /** Maximum wind speed in km/h */
  maxWindSpeed: number
  /** Visibility in km */
  visibility: number
  /** UV index */
  uvIndex: number
}

/**
 * Type representing exactly 5 days of historical weather data
 * Used to enforce that filterHistoricalDataByLocalTime receives the correct amount of data
 */
export type HistoricalWeatherData = [ForecastDay, ForecastDay, ForecastDay, ForecastDay, ForecastDay]


/**
 * Complete weather response for a location
 */
export interface WeatherResponse {
  /** Location name */
  location: string
  /** Location country */
  country: string
  /** Latitude coordinate */
  latitude: number
  /** Longitude coordinate */
  longitude: number
  /** Current weather conditions */
  current: CurrentWeather
  /** Forecast for the next days */
  forecast: ForecastDay[]
  /** Last update timestamp in ISO format */
  lastUpdated: string
}

/**
 * API error response
 */
export interface WeatherError {
  /** Error code */
  code: string
  /** Error message */
  message: string
  /** HTTP status code */
  statusCode: number
}


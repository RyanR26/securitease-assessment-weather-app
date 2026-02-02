/**
 * Current weather conditions for a location
 */
export interface CurrentWeather {
  /** Temperature in Celsius */
  temperature: number
  /** "Feels like" temperature in Celsius */
  feelsLike: number
  /** Weather condition (e.g., "Sunny", "Rainy", "Cloudy") */
  condition: string
  /** Weather condition icon/code */
  icon: string
  /** Humidity percentage (0-100) */
  humidity: number
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
}

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


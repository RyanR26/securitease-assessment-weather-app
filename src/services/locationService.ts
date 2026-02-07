/**
 * Gets the user's current location using the Geolocation API
 * @returns Promise that resolves to coordinates {latitude, longitude} or null if unavailable
 * @example
 * const coords = await getUserLocation()
 * if (coords) {
 *   console.log(`Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`)
 * }
 */
export async function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    // Check if geolocation is available in the browser
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser')
      resolve(null)
      return
    }

    // Request user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success callback
        const { latitude, longitude } = position.coords
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`)
        resolve({ latitude, longitude })
      },
      (error) => {
        // Error callback
        console.warn('Geolocation error:', error.message)
        resolve(null)
      },
      {
        // Options: use high accuracy and set timeout
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    )
  })
}

/**
 * Converts coordinates to a location string that can be used with the weather API
 * Uses reverse geocoding via the weather API to get the location name
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Promise that resolves to location string (e.g., 'London, United Kingdom') or null if lookup fails
 * @example
 * const location = await getLocationFromCoordinates(51.5085, -0.1257)
 * // Returns: 'London, United Kingdom'
 */
export async function getLocationFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const apiKey = (import.meta as any).env.VITE_WEATHER_API_KEY
    const baseUrl = (import.meta as any).env.VITE_WEATHER_API_BASE_URL || 'http://api.weatherapi.com/v1'

    if (!apiKey) {
      console.warn('Weather API key not found')
      return null
    }

    const url = new URL(`${baseUrl}/current.json`)
    url.searchParams.append('key', apiKey)
    url.searchParams.append('q', `${latitude},${longitude}`)

    const response = await fetch(url.toString())

    if (!response.ok) {
      console.warn('Failed to get location from coordinates:', response.statusText)
      return null
    }

    const data = await response.json()

    if (data.error) {
      console.warn('Location lookup error:', data.error.message)
      return null
    }

    const location = data.location
    if (location?.name && location?.country) {
      return `${location.name}, ${location.country}`
    }

    return null
  } catch (error) {
    console.warn('Error getting location from coordinates:', error)
    return null
  }
}

/**
 * Gets the user's current location as a location string
 * Attempts to use geolocation API and reverse geocoding to get a human-readable location
 * Falls back to null if any step fails
 * @returns Promise that resolves to location string or null if unavailable
 * @example
 * const location = await getCurrentLocationString()
 * // Returns: 'London, United Kingdom' or null
 */
export async function getCurrentLocationString(): Promise<string | null> {
  try {
    const coords = await getUserLocation()

    if (!coords) {
      return null
    }

    const location = await getLocationFromCoordinates(coords.latitude, coords.longitude)
    return location
  } catch (error) {
    console.warn('Error getting current location string:', error)
    return null
  }
}


/**
 * Cache entry structure with timestamp
 */
interface CacheEntry<T> {
  data: T
  timestamp: number
}

/**
 * Namespace for all cached data in localStorage
 * All cache keys will be prefixed with this namespace to avoid conflicts
 */
const CACHE_NAMESPACE = 'weather-app-cache'

/**
 * Default cache duration in milliseconds (10 minutes)
 * OpenWeather API provides real-time, historical, and forecasted weather data,
 * with core updates occurring every 10 minutes for its model
 */
const DEFAULT_CACHE_DURATION_MS = 10 * 60 * 1000

/**
 * Creates a namespaced cache key
 * @param key - The cache key
 * @returns The namespaced key (e.g., "weather-app-cache:London")
 */
function getNamespacedKey(key: string): string {
  return `${CACHE_NAMESPACE}:${key}`
}

/**
 * Gets a cached value from local storage
 * @param key - The cache key
 * @returns The cached data if valid, null if expired or not found
 * @example
 * const cachedWeather = getCachedData('London')
 * if (cachedWeather) {
 *   console.log('Using cached data:', cachedWeather)
 * }
 */
export function getCachedData<T>(key: string): T | null {
  try {
    const namespacedKey = getNamespacedKey(key)
    const cached = localStorage.getItem(namespacedKey)

    if (!cached) {
      return null
    }

    const entry: CacheEntry<T> = JSON.parse(cached)
    const now = Date.now()
    const age = now - entry.timestamp

    // Check if cache is still valid (within 10 minutes)
    if (age > DEFAULT_CACHE_DURATION_MS) {
      // Cache expired, remove it
      localStorage.removeItem(namespacedKey)
      return null
    }

    return entry.data
  } catch (error) {
    console.warn(`Error reading cache for key "${key}":`, error)
    return null
  }
}

/**
 * Stores data in local storage with a timestamp
 * @param key - The cache key
 * @param data - The data to cache
 * @example
 * setCachedData('London', weatherData)
 */
export function setCachedData<T>(key: string, data: T): void {
  try {
    const namespacedKey = getNamespacedKey(key)
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(namespacedKey, JSON.stringify(entry))
  } catch (error) {
    console.warn(`Error writing cache for key "${key}":`, error)
  }
}

/**
 * Clears a specific cache entry
 * @param key - The cache key to clear
 * @example
 * clearCache('London')
 */
export function clearCache(key: string): void {
  try {
    const namespacedKey = getNamespacedKey(key)
    localStorage.removeItem(namespacedKey)
  } catch (error) {
    console.warn(`Error clearing cache for key "${key}":`, error)
  }
}

/**
 * Clears all cached data in the weather-app-cache namespace
 * @example
 * clearAllCache()
 */
export function clearAllCache(): void {
  try {
    const keysToRemove: string[] = []

    // Find all keys in the namespace
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`${CACHE_NAMESPACE}:`)) {
        keysToRemove.push(key)
      }
    }

    // Remove all namespaced keys
    keysToRemove.forEach(key => localStorage.removeItem(key))
  } catch (error) {
    console.warn('Error clearing all cache:', error)
  }
}

/**
 * Gets the age of a cached entry in milliseconds
 * @param key - The cache key
 * @returns Age in milliseconds, or null if not found or invalid
 * @example
 * const age = getCacheAge('London')
 * if (age && age < 5 * 60 * 1000) {
 *   console.log('Cache is less than 5 minutes old')
 * }
 */
export function getCacheAge(key: string): number | null {
  try {
    const namespacedKey = getNamespacedKey(key)
    const cached = localStorage.getItem(namespacedKey)

    if (!cached) {
      return null
    }

    const entry: CacheEntry<unknown> = JSON.parse(cached)
    return Date.now() - entry.timestamp
  } catch (error) {
    console.warn(`Error getting cache age for key "${key}":`, error)
    return null
  }
}

/**
 * Checks if a cache entry exists and is still valid
 * @param key - The cache key
 * @returns true if cache exists and is valid, false otherwise
 * @example
 * if (isCacheValid('London')) {
 *   console.log('Cache is valid')
 * }
 */
export function isCacheValid(key: string): boolean {
  try {
    const namespacedKey = getNamespacedKey(key)
    const cached = localStorage.getItem(namespacedKey)

    if (!cached) {
      return false
    }

    const entry: CacheEntry<unknown> = JSON.parse(cached)
    const now = Date.now()
    const age = now - entry.timestamp

    return age <= DEFAULT_CACHE_DURATION_MS
  } catch (error) {
    console.warn(`Error checking cache validity for key "${key}":`, error)
    return false
  }
}


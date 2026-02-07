import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getCachedData, setCachedData, clearCache, clearAllCache, getCacheAge, isCacheValid } from '@/services/cacheService'

describe('cacheService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    localStorage.clear()
    vi.useRealTimers()
  })

  describe('setCachedData and getCachedData', () => {
    it('should store and retrieve data from cache', () => {
      const testData = { location: 'London', temperature: 20 }
      
      setCachedData('London', testData)
      const retrieved = getCachedData('London')

      expect(retrieved).toEqual(testData)
    })

    it('should return null for non-existent cache key', () => {
      const result = getCachedData('NonExistent')
      expect(result).toBeNull()
    })

    it('should return null for expired cache (older than 10 minutes)', () => {
      const testData = { location: 'London', temperature: 20 }
      
      setCachedData('London', testData)
      
      // Advance time by 11 minutes
      vi.advanceTimersByTime(11 * 60 * 1000)
      
      const retrieved = getCachedData('London')
      expect(retrieved).toBeNull()
    })

    it('should return data for cache within 10 minutes', () => {
      const testData = { location: 'London', temperature: 20 }
      
      setCachedData('London', testData)
      
      // Advance time by 5 minutes
      vi.advanceTimersByTime(5 * 60 * 1000)
      
      const retrieved = getCachedData('London')
      expect(retrieved).toEqual(testData)
    })

    it('should handle complex objects', () => {
      const complexData = {
        location: 'London',
        current: {
          temperature: 20,
          condition: 'Sunny',
          humidity: 65,
        },
        forecast: [
          { date: '2024-01-16', temp: 18 },
          { date: '2024-01-17', temp: 19 },
        ],
      }
      
      setCachedData('ComplexKey', complexData)
      const retrieved = getCachedData('ComplexKey')

      expect(retrieved).toEqual(complexData)
    })

    it('should handle different data types', () => {
      setCachedData('string', 'test string')
      setCachedData('number', 42)
      setCachedData('boolean', true)
      setCachedData('array', [1, 2, 3])

      expect(getCachedData('string')).toBe('test string')
      expect(getCachedData('number')).toBe(42)
      expect(getCachedData('boolean')).toBe(true)
      expect(getCachedData('array')).toEqual([1, 2, 3])
    })
  })

  describe('clearCache', () => {
    it('should remove a specific cache entry', () => {
      setCachedData('London', { temperature: 20 })
      setCachedData('Paris', { temperature: 15 })

      clearCache('London')

      expect(getCachedData('London')).toBeNull()
      expect(getCachedData('Paris')).toEqual({ temperature: 15 })
    })

    it('should handle clearing non-existent keys gracefully', () => {
      expect(() => clearCache('NonExistent')).not.toThrow()
    })
  })

  describe('clearAllCache', () => {
    it('should clear all cache entries', () => {
      setCachedData('London', { temperature: 20 })
      setCachedData('Paris', { temperature: 15 })
      setCachedData('Tokyo', { temperature: 10 })

      clearAllCache()

      expect(getCachedData('London')).toBeNull()
      expect(getCachedData('Paris')).toBeNull()
      expect(getCachedData('Tokyo')).toBeNull()
    })
  })

  describe('getCacheAge', () => {
    it('should return age of cache in milliseconds', () => {
      setCachedData('London', { temperature: 20 })
      
      vi.advanceTimersByTime(5 * 60 * 1000) // 5 minutes
      
      const age = getCacheAge('London')
      expect(age).toBe(5 * 60 * 1000)
    })

    it('should return null for non-existent cache', () => {
      const age = getCacheAge('NonExistent')
      expect(age).toBeNull()
    })

    it('should return correct age for recently cached data', () => {
      setCachedData('London', { temperature: 20 })
      
      vi.advanceTimersByTime(30 * 1000) // 30 seconds
      
      const age = getCacheAge('London')
      expect(age).toBe(30 * 1000)
    })
  })

  describe('isCacheValid', () => {
    it('should return true for valid cache', () => {
      setCachedData('London', { temperature: 20 })
      
      vi.advanceTimersByTime(5 * 60 * 1000) // 5 minutes
      
      expect(isCacheValid('London')).toBe(true)
    })

    it('should return false for expired cache', () => {
      setCachedData('London', { temperature: 20 })
      
      vi.advanceTimersByTime(11 * 60 * 1000) // 11 minutes
      
      expect(isCacheValid('London')).toBe(false)
    })

    it('should return false for non-existent cache', () => {
      expect(isCacheValid('NonExistent')).toBe(false)
    })

    it('should return true at exactly 10 minutes', () => {
      setCachedData('London', { temperature: 20 })
      
      vi.advanceTimersByTime(10 * 60 * 1000) // exactly 10 minutes
      
      expect(isCacheValid('London')).toBe(true)
    })

    it('should return false just after 10 minutes', () => {
      setCachedData('London', { temperature: 20 })
      
      vi.advanceTimersByTime(10 * 60 * 1000 + 1) // 10 minutes + 1ms
      
      expect(isCacheValid('London')).toBe(false)
    })
  })

  describe('error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      expect(() => setCachedData('London', { temperature: 20 })).not.toThrow()
      
      setItemSpy.mockRestore()
    })

    it('should handle corrupted cache data', () => {
      localStorage.setItem('corrupted', 'invalid json {')
      
      const result = getCachedData('corrupted')
      expect(result).toBeNull()
    })
  })
})


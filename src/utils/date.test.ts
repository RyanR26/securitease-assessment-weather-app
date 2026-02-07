import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  formatDateDdMmYyyy,
  formatDateToWeekday,
  getCurrentTimeByTimeZone,
  isAtLeastOneDayInFuture,
  isAtLeastOneDayInPast,
} from './date'

describe('Date Utilities', () => {
  beforeEach(() => {
    // Mock the current date to 2024-01-15 for consistent testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('formatDateDdMmYyyy', () => {
    it('should format Date object to dd/mm/yyyy', () => {
      const date = new Date('2024-01-15')
      expect(formatDateDdMmYyyy(date)).toBe('15/01/2024')
    })

    it('should format ISO date string to dd/mm/yyyy', () => {
      expect(formatDateDdMmYyyy('2024-01-15')).toBe('15/01/2024')
    })

    it('should handle single digit days and months', () => {
      expect(formatDateDdMmYyyy('2024-01-05')).toBe('05/01/2024')
      expect(formatDateDdMmYyyy('2024-12-09')).toBe('09/12/2024')
    })
  })

  describe('formatDateToWeekday', () => {
    it('should format date to weekday name', () => {
      expect(formatDateToWeekday('2024-01-15')).toBe('Monday')
    })

    it('should handle Date objects', () => {
      const date = new Date('2024-01-15')
      expect(formatDateToWeekday(date)).toBe('Monday')
    })

    it('should return correct weekday for different dates', () => {
      expect(formatDateToWeekday('2024-01-16')).toBe('Tuesday')
      expect(formatDateToWeekday('2024-01-17')).toBe('Wednesday')
    })
  })

  describe('getCurrentTimeByTimeZone', () => {
    it('should return time in HH:MM:SS format', () => {
      const time = getCurrentTimeByTimeZone('UTC')
      expect(time).toMatch(/^\d{2}:\d{2}:\d{2}$/)
    })

    it('should use UTC as default timezone', () => {
      const timeUTC = getCurrentTimeByTimeZone()
      const timeExplicitUTC = getCurrentTimeByTimeZone('UTC')
      expect(timeUTC).toBe(timeExplicitUTC)
    })
  })



  describe('isAtLeastOneDayInFuture', () => {
    it('should return true for tomorrow and beyond', () => {
      expect(isAtLeastOneDayInFuture('2024-01-16')).toBe(true)
      expect(isAtLeastOneDayInFuture('2024-01-17')).toBe(true)
      expect(isAtLeastOneDayInFuture('2024-12-31')).toBe(true)
    })

    it('should return false for today', () => {
      expect(isAtLeastOneDayInFuture('2024-01-15')).toBe(false)
    })

    it('should return false for past dates', () => {
      expect(isAtLeastOneDayInFuture('2024-01-14')).toBe(false)
      expect(isAtLeastOneDayInFuture('2024-01-01')).toBe(false)
    })
  })

  describe('isAtLeastOneDayInPast', () => {
    it('should return true for yesterday and earlier', () => {
      expect(isAtLeastOneDayInPast('2024-01-14')).toBe(true)
      expect(isAtLeastOneDayInPast('2024-01-13')).toBe(true)
      expect(isAtLeastOneDayInPast('2024-01-01')).toBe(true)
    })

    it('should return false for today', () => {
      expect(isAtLeastOneDayInPast('2024-01-15')).toBe(false)
    })

    it('should return false for future dates', () => {
      expect(isAtLeastOneDayInPast('2024-01-16')).toBe(false)
      expect(isAtLeastOneDayInPast('2024-12-31')).toBe(false)
    })
  })
})


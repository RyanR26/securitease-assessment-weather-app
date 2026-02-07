/**
 * Formats a date to dd/mm/yyyy format using en-GB locale
 * @param date - Date object or ISO date string (YYYY-MM-DD)
 * @returns Formatted date string in dd/mm/yyyy format
 * @example
 * formatDateDdMmYyyy(new Date('2024-01-15')) // '15/01/2024'
 * formatDateDdMmYyyy('2024-01-15') // '15/01/2024'
 */
export const formatDateDdMmYyyy = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date

    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

/**
 * Formats a date to its full weekday name (e.g., "Monday", "Tuesday")
 * @param date - Date object or ISO date string (YYYY-MM-DD)
 * @returns Full weekday name in en-GB locale
 * @example
 * formatDateToWeekday(new Date('2024-01-15')) // 'Monday'
 * formatDateToWeekday('2024-01-15') // 'Monday'
 */
export const formatDateToWeekday = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date

    return d.toLocaleDateString('en-GB', {
        weekday: 'long',
    })
}

/**
 * Gets the current time in a specific timezone in HH:MM:SS format (24-hour)
 * @param timeZone - IANA timezone identifier (e.g., 'Europe/London', 'America/New_York')
 * @returns Current time in HH:MM:SS format for the specified timezone
 * @example
 * getCurrentTimeByTimeZone('Europe/London') // '14:30:45'
 * getCurrentTimeByTimeZone('UTC') // '14:30:45'
 */
export const getCurrentTimeByTimeZone = (timeZone: string = 'UTC'): string => {
    const localTime = new Date()

    return localTime.toLocaleString('en-US', {
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
}

/**
 * Checks if a date is at least one day in the future (excluding today)
 * Useful for determining if a date is tomorrow or later
 * @param date - ISO date string in YYYY-MM-DD format
 * @returns true if the date is tomorrow or later, false if today or in the past
 * @example
 * isAtLeastOneDayInFuture('2024-01-16') // true (if today is 2024-01-15)
 * isAtLeastOneDayInFuture('2024-01-15') // false (if today is 2024-01-15)
 * isAtLeastOneDayInFuture('2024-01-14') // false (if today is 2024-01-15)
 */
export const isAtLeastOneDayInFuture = (date: string) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    return date >= tomorrowStr
}

/**
 * Checks if a date is at least one day in the past (excluding today)
 * Useful for determining if a date is yesterday or earlier
 * @param date - ISO date string in YYYY-MM-DD format
 * @returns true if the date is yesterday or earlier, false if today or in the future
 * @example
 * isAtLeastOneDayInPast('2024-01-14') // true (if today is 2024-01-15)
 * isAtLeastOneDayInPast('2024-01-15') // false (if today is 2024-01-15)
 * isAtLeastOneDayInPast('2024-01-16') // false (if today is 2024-01-15)
 */
export const isAtLeastOneDayInPast = (date: string) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    return date <= yesterdayStr
}
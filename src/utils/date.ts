
export const formatDateDdMmYyyy = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date

    return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

export const formatDateToWeekday = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date

    return d.toLocaleDateString('en-GB', {
        weekday: 'long',
    })
}

export const getCurrentTimeByTimeZone = (timeZone: string = 'UTC') => {
    const localTime = new Date()

    return localTime.toLocaleString('en-US', {
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
}

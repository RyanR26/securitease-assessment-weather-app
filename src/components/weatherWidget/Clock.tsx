import React, { useState, useEffect } from 'react'
import { getCurrentTimeByTimeZone } from '@/utils/date'

interface ClockProps {
    timeZone: string
}

export const Clock: React.FC<ClockProps> = ({ timeZone }) => {
    const [time, setTime] = useState<string>(() => getCurrentTimeByTimeZone(timeZone))

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getCurrentTimeByTimeZone(timeZone))
        }, 1000)

        return () => clearInterval(interval)
    }, [timeZone])

    return <div>{time}</div>
}
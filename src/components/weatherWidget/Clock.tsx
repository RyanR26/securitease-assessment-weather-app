import { useState, useEffect } from 'react'
import { getCurrentTimeByTimeZone } from '@/utils/date'

interface ClockProps {
  timeZone: string
  classNames?: string
}

export function Clock({
  timeZone,
  classNames
}: ClockProps) {

  const [time, setTime] = useState<string>(() => getCurrentTimeByTimeZone(timeZone))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTimeByTimeZone(timeZone))
    }, 1000)

    return () => clearInterval(interval)
  }, [timeZone])

  return <div className={`${classNames}`}>{time}</div>
}
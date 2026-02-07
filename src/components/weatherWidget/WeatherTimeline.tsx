import { useRef, useEffect } from 'react'
import { ForecastDay } from '@/types'
import { formatDateDdMmYyyy, formatDateToWeekday } from '@/utils/date'

interface WeatherTimelineProps {
  days: ForecastDay[]
  selectedDate?: string
  dateAtLocation: string
  onDaySelect: (day: ForecastDay) => void
}

export function WeatherTimeline({
  days,
  selectedDate,
  dateAtLocation,
  onDaySelect
}: WeatherTimelineProps) {

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const selectedDayRef = useRef<HTMLDivElement>(null)

  // Snap to center when a day is selected
  useEffect(() => {
    if (selectedDayRef.current && scrollContainerRef.current) {
      selectedDayRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [selectedDate])

  const handleDayClick = (day: ForecastDay) => {
    onDaySelect(day)
  }

  return (
    <div className='overflow-x-auto' ref={scrollContainerRef}>
      <div className='flex gap-4 pb-4'>
        {days.map((day) => (
          <div
            key={day.date}
            ref={selectedDate === day.date ? selectedDayRef : null}
            onClick={() => handleDayClick(day)}
            className={
              `flex-shrink-0 w-40 rounded-lg border p-4 bg-white hover:shadow-lg transition-all cursor-pointer
              ${!selectedDate && dateAtLocation === formatDateDdMmYyyy(day.date) ? 'border-green-500 border-2 shadow-lg' : ''}
              ${selectedDate === day.date ? 'border-blue-500 border-2 shadow-lg' : 'border-gray-200'}`
            }>
            <p className='text-sm text-gray-600'>{formatDateDdMmYyyy(day.date)}</p>
            <p className='font-bold text-sm mb-2'>{formatDateToWeekday(day.date)}</p>
            <img src={day.icon} alt={day.condition} className='mx-auto h-12 w-12' />
            <p className='text-center text-sm mt-2'>{day.condition}</p>
            <div className='mt-3 space-y-1 text-xs'>
              <p>
                <span className='font-bold'>Max:</span> {day.maxTemp}°C
              </p>
              <p>
                <span className='font-bold'>Min:</span> {day.minTemp}°C
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

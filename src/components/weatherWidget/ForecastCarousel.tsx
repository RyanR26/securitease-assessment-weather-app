import React from 'react'
import { ForecastDay } from '../../types'
import { formatDateDdMmYyyy, formatDateToWeekday } from '@/utils/date'

interface ForecastCarouselProps {
  days: ForecastDay[]
}

export const ForecastCarousel: React.FC<ForecastCarouselProps> = ({ days }) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 pb-4">
        {days.map((day) => (
          <div
            key={day.date}
            className="flex-shrink-0 w-40 rounded-lg border p-4 bg-white hover:shadow-lg transition-shadow cursor-pointer"
          >
            <p className="text-sm text-gray-600">{formatDateDdMmYyyy(day.date)}</p>
            <p className="font-bold text-sm mb-2">{formatDateToWeekday(day.date)}</p>
            <img src={day.icon} alt={day.condition} className="mx-auto h-12 w-12" />
            <p className="text-center text-sm mt-2">{day.condition}</p>
            <div className="mt-3 space-y-1 text-xs">
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

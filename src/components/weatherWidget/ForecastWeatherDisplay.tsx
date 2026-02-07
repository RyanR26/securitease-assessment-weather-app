import { ForecastDay } from '@/types'
import { formatDateDdMmYyyy, formatDateToWeekday } from '@/utils/date'

interface ForecastWeatherDisplayProps {
  day: ForecastDay
}

export function ForecastWeatherDisplay({ day }: ForecastWeatherDisplayProps) {

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8' key={day.date}>
      <div className='flex flex-col justify-between gap-4'>
        <div className='flex flex-col items-center'>
          <p className='text-sm'>{formatDateDdMmYyyy(day.date)}</p>
          <p className='font-bold'>{formatDateToWeekday(day.date)}</p>
          <p className='text-xs bg-blue-200 py-1 px-2 rounded-full text-center text-blue-700 mt-2'>
            Forecast
          </p>
        </div>
        <div className='flex flex-col items-center border-b border-t border-gray-300 pb-4'>
          <div className='rounded-lg p-2 flex flex-col items-center w-8/10 animate-short-slide-up-fade-in'>
            <img src={day.icon} alt={day.condition} className='mx-auto' />
            <p className='text-center font-bold'>{day.condition}</p>
          </div>
          <div className='text-6xl font-bold mt-3 flex items-start justify-center gap-2 animate-fade-in'>
            {day.avgTemp}
            <span className='text-2xl'>°C</span>
          </div>
          <div className='text-3xl font-bold text-gray-500 mt-1 flex items-start justify-center gap-2 animate-fade-in'>
            {day.avgTempF}
            <span className='text-lg'>°F</span>
          </div>
        </div>
        <div>
          <p className='text-xs mb-1'>Temperature Range</p>
          <p className='text-sm font-bold'>
            {day.maxTemp}°C / {day.minTemp}°C
          </p>
        </div>
      </div>
      <div className='text-xs font-bold'>
        <dl className='flex flex-col gap-4'>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Avg Temperature:</dt>
            <dd className='animate-short-slide-right-fade-in'>{day.avgTemp}°C</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Max Temperature:</dt>
            <dd className='animate-short-slide-right-fade-in'>{day.maxTemp}°C</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Min Temperature:</dt>
            <dd className='animate-short-slide-right-fade-in'>{day.minTemp}°C</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Humidity:</dt>
            <dd className='animate-short-slide-right-fade-in'>{day.humidity}%</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Precipitation:</dt>
            <dd className='animate-short-slide-right-fade-in'>{day.precipitationAmount} mm</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Chance of Rain:</dt>
            <dd className='animate-short-slide-right-fade-in'>{day.precipitationChance}%</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Wind Speed:</dt>
            <dd className='animate-short-slide-right-fade-in'>{day.windSpeed} kph</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Max Wind Speed:</dt>
            <dd className='animate-short-slide-right-fade-in'>{day.maxWindSpeed} kph</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>UV Index:</dt>
            <dd className='animate-short-slide-right-fade-in'>{day.uvIndex} {day.uvIndex > 5 ? 'High' : 'Low'}</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Visibility:</dt>
            <dd className='animate-short-slide-right-fade-in'>{day.visibility} km</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}


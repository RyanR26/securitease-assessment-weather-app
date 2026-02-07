import { CurrentWeather } from '@/types'
import { formatDateDdMmYyyy } from '@/utils/date'
import { Clock } from '@/components/weatherWidget/Clock'

interface CurrentWeatherProps {
  weather: CurrentWeather
}

export function CurrentWeatherDisplay ({ weather }: CurrentWeatherProps) {

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8' key={weather.location}>
      <div className='flex flex-col justify-between gap-4'>
        <div className='flex flex-col items-center'>
          <p className='text-sm'>{formatDateDdMmYyyy(new Date(weather.localTime))}</p>
          <p className='font-bold'>Today</p>
          <p className='text-xs bg-green-500 py-1 px-2 rounded-full text-center text-white mt-2'>Current Weather</p>
        </div>
        <div className='flex flex-col items-center border-b border-t border-gray-300 pb-4'>
          <div className=' rounded-lg p-2 flex flex-col items-center w-8/10 animate-short-slide-up-fade-in'>
            <img src={weather.icon} alt={weather.condition} className='mx-auto' />
            <p className='text-center font-bold'>{weather.condition}</p>
          </div>
          <div className='text-6xl font-bold mt-3 flex items-start justify-center gap-2 animate-fade-in'>
            {weather.temperature}
            <span className='text-2xl'>°C</span>
          </div>
          <div className='text-3xl font-bold text-gray-500 mt-1 flex items-start justify-center gap-2 animate-fade-in'>
            {weather.temperatureF}
            <span className='text-lg'>°F</span>
          </div>
        </div>
        <div>
          <p className='text-xs mb-1'>Time in {weather.location}</p>
          <Clock timeZone={weather.timeZoneId} classNames='text-sm font-bold' />
        </div>
      </div>
      <div className='text-xs font-bold'>
        <dl className='flex flex-col gap-4'>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Temperature:</dt>
            <dd className='animate-short-slide-right-fade-in'>{weather.temperature}°C</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Feels Like:</dt>
            <dd className='animate-short-slide-right-fade-in'>{weather.feelsLike}°C</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Humidity:</dt>
            <dd className='animate-short-slide-right-fade-in'>{weather.humidity}%</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Precipitation:</dt>
            <dd className='animate-short-slide-right-fade-in'>{weather.precipitation} mm</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Chance of Rain:</dt>
            <dd className='animate-short-slide-right-fade-in'>{weather.chanceOfRain}%</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Wind:</dt>
            <dd className='animate-short-slide-right-fade-in'>{weather.windSpeed} kph</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Wind Direction:</dt>
            <dd className='animate-short-slide-right-fade-in'>{weather.windDirection} °</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>UV Index:</dt>
            <dd className='animate-short-slide-right-fade-in'>{weather.uvIndex} {weather.uvIndex > 5 ? 'High' : 'Low'}</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Pressure:</dt>
            <dd className='animate-short-slide-right-fade-in'>{weather.pressure} mb</dd>
          </div>
          <div className='flex justify-between border-b border-gray-300 py-1'>
            <dt>Visibility:</dt>
            <dd className='animate-short-slide-right-fade-in'>{weather.visibility} km</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
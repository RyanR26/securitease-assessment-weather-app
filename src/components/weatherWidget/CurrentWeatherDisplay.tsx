import React from 'react'
import { CurrentWeather } from '../../types'
import { formatDateDdMmYyyy } from '../../utils/date'
import { Clock } from './Clock'

interface CurrentWeatherProps {
  weather: CurrentWeather
}

export const CurrentWeatherDisplay: React.FC<CurrentWeatherProps> = ({ weather }) => {

    return  (
        <div className="rounded-xl border-2 border-yellow-500 p-6">
            <div className='grid grid-cols-2 gap-1'>
                <div className="flex flex-col justify-between gap-4">
                    <div className='flex flex-col items-center'>
                        <p className='text-sm'>{formatDateDdMmYyyy(new Date())}</p>
                        <h2 className='font-bold'>Current Weather</h2>
                        <img src={weather.icon} alt={weather.condition} className="mx-auto" />
                        <p className="text-center">{weather.condition}</p>
                    </div>
                    <div>
                        <div className="text-6xl font-bold mt-5 flex items-start justify-center gap-2">
                            {weather.temperature} 
                            <span className='text-2xl'>°C</span>
                        </div>
                        <div className="text-3xl font-bold mt-5 flex items-start justify-center gap-2">
                            {weather.temperatureF}
                            <span className='text-lg'>°F</span>
                        </div>
                    </div>
                    <div>
                        <p className='text-sm'>Time in {weather.location}</p>
                        <Clock timeZone={weather.timeZoneId} />
                    </div>
                </div>
                <div className="text-xs font-bold">
                    <dl className='flex flex-col gap-4'>
                        <div className="flex justify-between border-b border-gray-300 py-1">
                            <dt>Temperature:</dt>
                            <dd>{weather.temperature}°C</dd>    
                        </div>
                        <div className="flex justify-between border-b border-gray-300 py-1">
                            <dt>Feels Like:</dt>
                            <dd>{weather.feelsLike}°C</dd>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 py-1">
                            <dt>Humidity:</dt>
                            <dd>{weather.humidity}%</dd>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 py-1">
                            <dt>Precipitation:</dt>
                            <dd>{weather.precipitation} mm</dd>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 py-1">
                            <dt>Chance of Rain:</dt>
                            <dd>{weather.chanceOfRain}%</dd>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 py-1">
                            <dt>Wind:</dt>
                            <dd>{weather.windSpeed} kph</dd>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 py-1">
                            <dt>Wind Direction:</dt>
                            <dd>{weather.windDirection} °</dd>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 py-1">
                            <dt>UV Index:</dt>
                            <dd>{weather.uvIndex} {weather.uvIndex > 5 ? 'High' : 'Low'}</dd>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 py-1">
                            <dt>Pressure:</dt>
                            <dd>{weather.pressure} mb</dd>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 py-1">
                            <dt>Visibility:</dt>
                            <dd>{weather.visibility} km</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}
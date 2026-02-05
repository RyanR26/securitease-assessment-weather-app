import React, { useState, useEffect } from 'react'
import { getCurrentWeather, getForecastWeather, getHistoricalWeather} from '../services/weatherService'
import { CurrentWeather, ForecastDay } from '../types'
import { Card } from './Card'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'

interface WeatherWidgetProps {
  location: string
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location }) => {

  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null)
  const [history, setHistory] = useState<ForecastDay[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {

    if (!location) {
      setCurrent(null)
      setForecast(null)
      setHistory(null)
      setLoading(false)
      return
    }

    // Create an AbortController for this effect run.
    const controller = new AbortController()
    const { signal } = controller

    const fetchData = async () => {

      setLoading(true)
      setError(null)
      
      try {
        // Run all requests in parallel and wait for them to complete.
        const [currentData, forecastData, historyData] = await Promise.all([
          getCurrentWeather(location, signal),
          getForecastWeather(location, 4, signal),
          getHistoricalWeather(location, 3, signal),
        ])

        if (!signal.aborted) {
          // If all succeed, update the state at once. Batch updates.
          setCurrent(currentData)
          setForecast(forecastData)
          setHistory(historyData)
        }

      } catch (err) {
        // Ignore AbortError, as it's an expected part of the cleanup process.
        if ((err as Error).name !== 'AbortError') {
          setError(err as Error)
        }
      } finally {
        // Only stop loading if the request wasn't aborted.
        // If it was, a new request has likely started.
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Return a cleanup function that aborts the request.
    // This runs when the component unmounts or `location` changes.
    return () => {
      controller.abort()
    }
  }, [location]) // Re-run the effect when the location prop changes

  if (loading) {
    return <LoadingSpinner message={`Loading weather for ${location}...`} />
  }

  if (error) {
    return <ErrorMessage title="Failed to fetch weather" message={error.message} />
  }

  if (!current) {
    return (
      <Card>
        <p>Enter a location to see the weather.</p>
      </Card>
    )
  }

  return (
      <div className="space-y-8">
        <Card title={`Current Weather in ${location}`} subtitle={current.condition}>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Temperature:</strong> {current.temperature}°C
            </p>
            <p>
              <strong>Feels Like:</strong> {current.feelsLike}°C
            </p>
            <p>
              <strong>Humidity:</strong> {current.humidity}%
            </p>
            <p>
              <strong>Wind:</strong> {current.windSpeed} kph
            </p>
          </div>
        </Card>

        {forecast && forecast.length > 0 && (
          <Card title="3-Day Forecast">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {forecast.map(day => (
                <div key={day.date} className="rounded-lg border p-4">
                <p className='text-sm'>{day.date}</p>
                  <p className="font-bold">
                    {new Date(day.date + 'T00:00:00').toLocaleDateString(undefined, {
                      weekday: 'long',
                    })}
                  </p>
                  <img src={day.icon} alt={day.condition} className="mx-auto" />
                  <p className="text-center">{day.condition}</p>
                  <p>
                    <strong>Max:</strong> {day.maxTemp}°C
                  </p>
                  <p>
                    <strong>Min:</strong> {day.minTemp}°C
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {history && history.length > 0 && (
          <Card title="Past 3 Days">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {history.map(day => (
                <div key={day.date} className="rounded-lg border p-4">
                    <p className='text-sm'>{day.date}</p>
                    <p className="font-bold">
                        {new Date(day.date + 'T00:00:00').toLocaleDateString(undefined, {
                        weekday: 'long',
                        })}
                        
                    </p>
                    <img src={day.icon} alt={day.condition} className="mx-auto" />
                    <p className="text-center">{day.condition}</p>
                    <p>
                        <strong>Max:</strong> {day.maxTemp}°C
                    </p>
                    <p>
                        <strong>Min:</strong> {day.minTemp}°C
                    </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
  )
}

export default WeatherWidget
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { getCurrentWeather, getForecastWeather, getHistoricalWeather, filterHistoricalDataByLocalTime } from '../../services/weatherService'
import { getCurrentLocationString } from '../../services/locationService'
import { CurrentWeather, ForecastDay, HistoricalWeatherData } from '../../types'
import { Card } from '../Card'
import { LoadingSpinner } from '../LoadingSpinner'
import { ErrorMessage } from '../ErrorMessage'
import { CurrentWeatherDisplay } from './CurrentWeatherDisplay'
import { ForecastWeatherDisplay } from './ForecastWeatherDisplay'
import { Location } from './Location'
import { ForecastCarousel } from './ForecastCarousel'
import { formatDateDdMmYyyy } from '@/utils/date'

interface WeatherWidgetProps {
  initialLocation?: string
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ initialLocation = 'London' }) => {

  const [location, setLocation] = useState<string>(initialLocation)
  const [locationInitialized, setLocationInitialized] = useState<boolean>(false)
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null)
  const [history, setHistory] = useState<ForecastDay[] | null>(null)
  const [dateAtLocation, setDateAtLocation] = useState<string>(() => formatDateDdMmYyyy(new Date()))
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // Initialize location from geolocation on first mount
  useEffect(() => {
    if (locationInitialized) {
      return
    }

    const initializeLocation = async () => {
      const userLocation = await getCurrentLocationString()

      if (userLocation) {
        setLocation(userLocation)
      }
      // If userLocation is null, keep the default initialLocation
      setLocationInitialized(true)
    }

    initializeLocation()
  }, [locationInitialized])

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
          getHistoricalWeather(location, 5, signal),
        ])

        // Only update state if the request wasn't aborted and all data is available.
        if (!signal.aborted && currentData && forecastData && historyData) {
          
          // If all succeed, update the state at once. Batch updates.
          // historyData is guaranteed to have exactly 5 elements since we request 5 days
          const filteredHistory = filterHistoricalDataByLocalTime(
            historyData as HistoricalWeatherData,
            currentData.localTime
          )

          setCurrent(currentData)
          setForecast(forecastData)
          setHistory(filteredHistory)
          setDateAtLocation(formatDateDdMmYyyy(currentData.localTime))
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
  }, [location])

  // Handle day selection: if clicking today's date, revert to current weather
  const handleDaySelect = useCallback((day: ForecastDay) => {
    if (formatDateDdMmYyyy(day.date) === dateAtLocation) {
      setSelectedDay(null)
    } else {
      setSelectedDay(day)
    }
  }, [dateAtLocation])

  // if (loading) {
  //   return <LoadingSpinner message={`Loading weather for ${location}...`} />
  // }

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
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='col-span-1'>
            <div className="bg-white rounded-xl border-2 border-yellow-500 p-6">
              {selectedDay ? (
                <ForecastWeatherDisplay day={selectedDay} />
              ) : (
                <CurrentWeatherDisplay weather={current} />
              )}
            </div>
          </div>
          <div className='col-span-1'>
            <div className="p-5 md:p-15">
              <Location 
                weather={current} 
                onLocationChange={setLocation} 
              />
            </div>
          </div>
        </div>

        {history && forecast && (
          <Card title="Weather Timeline">
            <ForecastCarousel
              days={[...(history || []), ...(forecast || [])]}
              selectedDate={selectedDay?.date}
              dateAtLocation={dateAtLocation}
              onDaySelect={handleDaySelect}
            />
          </Card>
        )}
      </div>
  )
}

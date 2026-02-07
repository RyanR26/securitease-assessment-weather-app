import { useState, useEffect, useCallback } from 'react'
import { formatDateDdMmYyyy } from '@/utils/date'
import { getCurrentWeatherData, getForecastWeatherData, getHistoricalWeatherData } from '@/services/dataService'
import { filterHistoricalDataByLocalTime } from '@/services/weatherService'
import { getCurrentLocationString } from '@/services/locationService'
import { CurrentWeather, ForecastDay, HistoricalWeatherData } from '@/types'
import { Card } from '@components/Card'
import { LoadingSpinner } from '@components/LoadingSpinner'
import { ErrorMessage } from '@components/ErrorMessage'
import { CurrentWeatherDisplay } from '@/components/weatherWidget/CurrentWeatherDisplay'
import { ForecastWeatherDisplay } from '@/components/weatherWidget/ForecastWeatherDisplay'
import { LocationSearch } from '@/components/weatherWidget/LocationSearch'
import { WeatherTimeline } from '@/components/weatherWidget/WeatherTimeline'

interface WeatherWidgetProps {
  initialLocation?: string
}

export function WeatherWidget ({ initialLocation = 'London' }: WeatherWidgetProps) {

  const [location, setLocation] = useState<string>(initialLocation)
  const [locationInitialized, setLocationInitialized] = useState<boolean>(false)
  const [current, setCurrent] = useState<CurrentWeather | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null)
  const [history, setHistory] = useState<ForecastDay[] | null>(null)
  const [dateAtLocation, setDateAtLocation] = useState<string>(() => formatDateDdMmYyyy(new Date()))
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [hasInitialData, setHasInitialData] = useState<boolean>(false)
  const [fetchingNewData, setFetchingNewData] = useState<boolean>(false)

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

      setFetchingNewData(true)
      setError(null)

      try {
        // Run all requests in parallel and wait for them to complete.
        const [currentData, forecastData, historyData] = await Promise.all([
          getCurrentWeatherData(location, signal),
          getForecastWeatherData(location, 4, signal),
          getHistoricalWeatherData(location, 5, signal),
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
          setSelectedDay(null)

          // Only set loading to false on initial data load
          if (!hasInitialData) {
            setHasInitialData(true)
            setLoading(false)
          }
        }
      } catch (err) {
        // Ignore AbortError, as it's an expected part of the cleanup process.
        if ((err as Error).name !== 'AbortError') {
          setError(err as Error)
          // Set loading to false on error if it's the initial load
          if (!hasInitialData) {
            setHasInitialData(true)
            setLoading(false)
          }
        }
      } finally {
        setFetchingNewData(false)
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

  if (!current && error) {
    return <ErrorMessage title='Failed to fetch weather' message={error.message} />
  }

  if (loading || !locationInitialized) {
    return <LoadingSpinner message={`Loading weather for ${location}...`} />
  }

  return (
      <div className='space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='col-span-1 order-last md:order-first'>
            <div className='bg-white rounded-xl border-2 border-yellow-500 p-6'>
              {selectedDay ? (
                <ForecastWeatherDisplay day={selectedDay} />
              ) : (
                <CurrentWeatherDisplay weather={current!} />
              )}
            </div>
          </div>
          <div className='col-span-1'>
            <div className='p-5 md:p-15'>
              <LocationSearch
                weather={current!}
                onLocationChange={setLocation}
                fetchingNewData={fetchingNewData}
                fetchingDataError={!!error && hasInitialData}
              />
            </div>
          </div>
        </div>
        {history && forecast && (
          <Card title='Weather Timeline'>
            <WeatherTimeline
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

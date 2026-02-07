import { useState } from 'react'
import { CurrentWeather } from '@/types'
import { Button } from '@components/Button'
import { getCountryFlag } from '@/utils/countryFlag'

interface LocationSearchProps {
  weather: CurrentWeather
  onLocationChange: (location: string) => void
  fetchingNewData?: boolean
  fetchingDataError?: boolean
}

export function LocationSearch ({
  weather,
  onLocationChange,
  fetchingNewData,
  fetchingDataError
}: LocationSearchProps) {

  const [searchInput, setSearchInput] = useState<string>('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onLocationChange(searchInput.trim())
      setSearchInput('')
    }
  }

  return (
    <div>
      <div className='mb-6'>
        <h2 className='font-bold text-lg mb-4'>Location Search</h2>
        <form className='flex flex-col lg:flex-row w-full lg:w-auto items-center gap-2'>
          <input
            type='text'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Enter location...'
            className='flex-1 w-full lg:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <Button
            isLoading={fetchingNewData}
            variant='primary'
            size='md'
            onClick={handleSearch}>
            Search
          </Button>
        </form>
        {fetchingDataError && <p className='text-red-500 text-xs mt-2'>Failed to fetch weather data. Please try again.</p>}
      </div>
      <div className='space-y-3' key={weather.location}>
        <h3 className='font-bold text-md mb-3'>Current Location</h3>
        <div className='flex justify-between border-b border-gray-300 py-2'>
          <dt className='font-semibold'>Location:</dt>
          <dd className='animate-short-slide-right-fade-in'>{weather.location}</dd>
        </div>
        <div className='flex justify-between border-b border-gray-300 py-2'>
          <dt className='font-semibold'>Country:</dt>
          <dd className='flex items-center gap-2 animate-short-slide-right-fade-in'>
            <span>{getCountryFlag(weather.country)}</span>
            <span>{weather.country}</span>
          </dd>
        </div>
        <div className='flex justify-between border-b border-gray-300 py-2'>
          <dt className='font-semibold'>Latitude:</dt>
          <dd className='animate-short-slide-right-fade-in'>{weather.latitude.toFixed(4)}</dd>
        </div>
        <div className='flex justify-between border-b border-gray-300 py-2'>
          <dt className='font-semibold'>Longitude:</dt>
          <dd className='animate-short-slide-right-fade-in'>{weather.longitude.toFixed(4)}</dd>
        </div>
      </div>
    </div>
  )
}

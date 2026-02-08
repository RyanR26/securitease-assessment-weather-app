import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WeatherTimeline } from './WeatherTimeline'
import type { ForecastDay } from '@/types'

const mockDays: ForecastDay[] = [
  {
    date: '2024-01-15',
    maxTemp: 28,
    minTemp: 20,
    avgTemp: 24,
    maxTempF: 82,
    minTempF: 68,
    avgTempF: 75,
    condition: 'Sunny',
    icon: 'https://cdn.weatherapi.com/weather/128x128/day/113.png',
    precipitationChance: 10,
    precipitationAmount: 0,
    humidity: 60,
    windSpeed: 12,
    maxWindSpeed: 12,
    visibility: 10,
    uvIndex: 7,
  },
  {
    date: '2024-01-16',
    maxTemp: 25,
    minTemp: 18,
    avgTemp: 21,
    maxTempF: 77,
    minTempF: 64,
    avgTempF: 70,
    condition: 'Cloudy',
    icon: 'https://cdn.weatherapi.com/weather/128x128/day/122.png',
    precipitationChance: 30,
    precipitationAmount: 5,
    humidity: 70,
    windSpeed: 15,
    maxWindSpeed: 15,
    visibility: 8,
    uvIndex: 5,
  },
  {
    date: '2024-01-17',
    maxTemp: 22,
    minTemp: 15,
    avgTemp: 18,
    maxTempF: 72,
    minTempF: 59,
    avgTempF: 64,
    condition: 'Rainy',
    icon: 'https://cdn.weatherapi.com/weather/128x128/day/302.png',
    precipitationChance: 80,
    precipitationAmount: 15,
    humidity: 85,
    windSpeed: 20,
    maxWindSpeed: 25,
    visibility: 5,
    uvIndex: 2,
  },
]

describe('WeatherTimeline', () => {
  const mockOnDaySelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all days in the timeline', () => {
    render(
      <WeatherTimeline
        days={mockDays}
        dateAtLocation='15/01/2024'
        onDaySelect={mockOnDaySelect}
      />
    )

    expect(screen.getByText('15/01/2024')).toBeInTheDocument()
    expect(screen.getByText('16/01/2024')).toBeInTheDocument()
    expect(screen.getByText('17/01/2024')).toBeInTheDocument()
  })

  it('should display weather condition for each day', () => {
    render(
      <WeatherTimeline
        days={mockDays}
        dateAtLocation='15/01/2024'
        onDaySelect={mockOnDaySelect}
      />
    )

    expect(screen.getByText('Sunny')).toBeInTheDocument()
    expect(screen.getByText('Cloudy')).toBeInTheDocument()
    expect(screen.getByText('Rainy')).toBeInTheDocument()
  })

  it('should display temperature range for each day', () => {
    const { container } = render(
      <WeatherTimeline
        days={mockDays}
        dateAtLocation='15/01/2024'
        onDaySelect={mockOnDaySelect}
      />
    )

    const maxLabels = screen.getAllByText('Max:')
    const minLabels = screen.getAllByText('Min:')
    expect(maxLabels.length).toBe(mockDays.length)
    expect(minLabels.length).toBe(mockDays.length)
    // Verify temperature values are rendered in the DOM
    expect(container.textContent).toContain('28')
    expect(container.textContent).toContain('20')
  })

  it('should call onDaySelect when a day is clicked', () => {
    render(
      <WeatherTimeline
        days={mockDays}
        dateAtLocation='15/01/2024'
        onDaySelect={mockOnDaySelect}
      />
    )

    const dayElement = screen.getByText('16/01/2024').closest('div')
    fireEvent.click(dayElement!)

    expect(mockOnDaySelect).toHaveBeenCalledWith(mockDays[1])
  })

  it('should highlight the current location date with green background', () => {
    const { container } = render(
      <WeatherTimeline
        days={mockDays}
        dateAtLocation='15/01/2024'
        onDaySelect={mockOnDaySelect}
      />
    )

    const dayCards = container.querySelectorAll('[class*="bg-green-100"]')
    expect(dayCards.length).toBeGreaterThan(0)
  })

  it('should highlight selected date with blue border', () => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()

    const { container } = render(
      <WeatherTimeline
        days={mockDays}
        dateAtLocation='15/01/2024'
        selectedDate='2024-01-16'
        onDaySelect={mockOnDaySelect}
      />
    )

    const dayCards = container.querySelectorAll('[class*="border-blue-500"]')
    expect(dayCards.length).toBeGreaterThan(0)
  })

  it('should render weather icons for each day', () => {
    render(
      <WeatherTimeline
        days={mockDays}
        dateAtLocation='15/01/2024'
        onDaySelect={mockOnDaySelect}
      />
    )

    const images = screen.getAllByRole('img')
    expect(images.length).toBe(mockDays.length)
  })

  it('should handle empty days array', () => {
    const { container } = render(
      <WeatherTimeline
        days={[]}
        dateAtLocation='15/01/2024'
        onDaySelect={mockOnDaySelect}
      />
    )

    const dayCards = container.querySelectorAll('[class*="w-40"]')
    expect(dayCards.length).toBe(0)
  })
})


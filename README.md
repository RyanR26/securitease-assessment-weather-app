# Weather Forecast App

A modern, responsive weather forecast application built with React, TypeScript, and Tailwind CSS. Get real-time weather data, forecasts, and historical weather information for any location.

## Features

- **Current Weather Display** - Real-time temperature, conditions, humidity, wind speed, and more
- **Weather Forecast** - 3-day weather forecast with detailed daily information
- **Historical Weather Data** - View past 3 days of weather history
- **Location Search** - Search weather by city name or coordinates
- **Geolocation Support** - Automatically detect user's location
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations** - Fade-in and slide animations for polished UX
- **Caching** - Intelligent caching to reduce API calls
- **Error Handling** - Graceful error messages and fallbacks

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **Weather API**: WeatherAPI.com

## Getting Started

See [SETUP.md](./SETUP.md) for detailed setup and installation instructions.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env
# Edit .env with your WeatherAPI key

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm build
```

## Project Structure

```
src/
├── components/        # React components
│   └── weatherWidget/ # Main weather widget components
├── services/         # API and data services
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── tests/           # Test setup and configuration
└── index.css        # Global styles and animations
```

## API Configuration

This app uses [WeatherAPI.com](https://www.weatherapi.com/) for weather data. Get a free API key and add it to your `.env` file:

```
VITE_WEATHER_API_KEY=your_api_key_here
VITE_WEATHER_API_BASE_URL=http://api.weatherapi.com/v1
```

## Testing

Run the test suite:

```bash
npm test              # Run tests in watch mode
npm test -- --run    # Run tests once
npm run test:ui      # Run tests with UI
```

## License

MIT


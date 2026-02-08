# Setup Guide

## Prerequisites

- Node.js 16+ and npm 7+
- A free API key from [WeatherAPI.com](https://www.weatherapi.com/)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd securitease-weather-forecast-assessment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env
```

Edit `.env` and add your WeatherAPI credentials:

```
VITE_WEATHER_API_KEY=your_api_key_here
VITE_WEATHER_API_BASE_URL=http://api.weatherapi.com/v1
```

**Get your free API key:**
1. Visit [WeatherAPI.com](https://www.weatherapi.com/)
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Paste it into your `.env` file

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run tests in watch mode
- `npm test -- --run` - Run tests once
- `npm run test:ui` - Run tests with interactive UI

### Project Structure

```
src/
├── components/
│   ├── weatherWidget/     # Main weather display components
│   ├── Card.tsx          # Reusable card component
│   ├── Header.tsx        # App header
│   ├── Footer.tsx        # App footer
│   └── ...
├── services/
│   ├── weatherService.ts # Weather API calls
│   ├── dataService.ts    # Data fetching with caching
│   ├── locationService.ts # Geolocation and reverse geocoding
│   └── cacheService.ts   # Caching logic
├── utils/
│   ├── date.ts          # Date formatting utilities
│   └── countryFlag.ts   # Country flag utilities
├── types/
│   └── weather.ts       # TypeScript type definitions
└── tests/
    └── setup.ts         # Test configuration
```

## Testing

### Running Tests

```bash
# Watch mode (re-runs on file changes)
npm test

# Run once
npm test -- --run

# Interactive UI
npm run test:ui
```

### Test Files

- `src/services/*.test.ts` - Service layer tests
- `src/utils/*.test.ts` - Utility function tests
- `src/components/**/*.test.tsx` - Component tests

## Troubleshooting

### API Key Issues

- Ensure your `.env` file is in the project root
- Verify the API key is correct and active
- Check that `VITE_WEATHER_API_BASE_URL` is set correctly

### Port Already in Use

If port 5173 is already in use:

```bash
npm run dev -- --port 3000
```

### Build Errors

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Environment Variables for Production

Set the same environment variables in your production environment:
- `VITE_WEATHER_API_KEY`
- `VITE_WEATHER_API_BASE_URL`

## Support

For issues or questions, please refer to the [README.md](./README.md) or check the project's issue tracker.


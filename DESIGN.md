# Design Decisions and Trade-offs

## Architecture Overview

Forecasta is built as a client-side React SPA (Single Page Application) with a focus on simplicity, performance, and user experience. The application fetches weather data from an external API and renders it with smooth animations and responsive design. It makes use of client-side caching to reduce API calls and improve performance. It supports timezone-aware date and time display.

## Key Design Decisions

### 1. **API Provider: WeatherAPI.com**

**Decision**: Switched from WeatherStack to WeatherAPI.com

**Rationale**:
- **WeatherStack Limitations**: The free tier only provided current weather data with no forecast or historical data capabilities
- **WeatherAPI.com Benefits**: 
  - Offers 3-day forecast data on the free tier
  - Provides historical weather data (past 3 days)
  - Better documentation and more reliable uptime
  - Supports both city name and coordinate-based queries
  - Includes geolocation support

**Trade-off**: None - the free tier of WeatherAPI.com is sufficient for the needs of this application and better than the free tier of WeatherStack.

### 2. **Client-Side Caching**

**Decision**: Implement intelligent caching to reduce API calls

**Rationale**:
- Reduces API quota consumption
- Improves app responsiveness for repeated queries
- Provides offline-like experience for cached locations

**Trade-off**: Cached data may become stale, but as the data is only cached for 10 minutes, it is not a major concern.

### 3. **React + TypeScript**

**Decision**: Use React with TypeScript for the UI layer

**Rationale**:
- Type safety prevents runtime errors
- Component-based architecture enables reusability
- Large ecosystem and community support
- Excellent developer experience

**Trade-off**: Slightly larger bundle size compared to vanilla JavaScript, but worth it for maintainability.

### 4. **Tailwind CSS for Styling**

**Decision**: Use Tailwind CSS v4 with utility-first approach

**Rationale**:
- I am most familiar with Tailwind CSS
- Rapid UI development with pre-built utilities
- Consistent design system
- Small production bundle with PurgeCSS
- Easy responsive design implementation

**Trade-off**: Requires learning utility class names; HTML can become verbose.

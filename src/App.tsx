import { Layout } from './components'
import { WeatherWidget } from './components/weatherWidget/WeatherWidget'

function App() {
  return (
    <Layout>
      <div className="text-center">
        <header className='mb-10'>
          <h1 className="text-2xl font-bold text-gray-900">
             Welcome to Weather Forecast
          </h1>
          <p className="text-lg text-gray-600">
            Get accurate weather forecasts for any location
          </p>
        </header>
        <WeatherWidget initialLocation="London" />
      </div>
    </Layout>
  )
}

export default App


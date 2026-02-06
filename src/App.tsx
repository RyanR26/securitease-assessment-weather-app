import { Layout } from './components'
import { WeatherWidget } from './components/weatherWidget/WeatherWidget'

function App() {
  return (
    <Layout>
      <div className="text-center">
        {/* <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Weather Forecast
        </h1>
        <p className="text-lg text-gray-600">
          Get accurate weather forecasts for any location
        </p> */}
        <WeatherWidget initialLocation="New York" />
      </div>
    </Layout>
  )
}

export default App


import { Layout } from './components'
import WeatherWidget from './components/WeatherWidget'

function App() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Weather Forecast
        </h1>
        <p className="text-lg text-gray-600">
          Get accurate weather forecasts for any location
        </p>
        <WeatherWidget location="New York" />
      </div>
    </Layout>
  )
}

export default App


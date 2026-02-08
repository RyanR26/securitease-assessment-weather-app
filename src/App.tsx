import { Layout } from './components'
import { WeatherWidget } from './components/weatherWidget/WeatherWidget'

function App() {
  return (
    <Layout>
      <div className='text-center'>
        <div className='mb-10 lg:mb-15 animate-short-slide-up-fade-in'>
          <h1 className='text-2xl font-bold text-gray-900'>
             Welcome to Forecasta
          </h1>
          <p className='text-lg text-gray-600'>
            Get accurate weather conditions for any location
          </p>
        </div>
        <WeatherWidget initialLocation='London' />
      </div>
    </Layout>
  )
}

export default App
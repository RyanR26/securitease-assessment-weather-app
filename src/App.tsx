import { Button, Layout } from './components'

function App() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Weather Forecast
        </h1>
        <p className="text-lg text-gray-600">
          Get accurate weather forecasts for any location
        </p>
        <Button className="mt-4" variant="primary">
          Get Started
        </Button>
         <Button className="mt-4" variant="secondary">
          Get Started
        </Button>
         <Button className="mt-4" variant="danger">
          Get Started
        </Button>
      </div>
    </Layout>
  )
}

export default App


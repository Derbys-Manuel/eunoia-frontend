import './App.css'
import AppRouter from './router/Router'
import { FlashMessageProvider } from './context/FlashMessageProvider'
import { AuthProvider } from './context/AuthProvider'

function App() {
  return (
    <>
    <AuthProvider>
      <FlashMessageProvider>
        <AppRouter />
      </FlashMessageProvider>
    </AuthProvider>
    </>
  )
}

export default App

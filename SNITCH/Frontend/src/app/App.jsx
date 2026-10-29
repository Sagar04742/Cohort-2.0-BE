import './App.css'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { routes } from './app.routes.jsx'
import { useAuth } from '../features/auth/hook/useAuth'

function App() {
  const { handleGetMe } = useAuth()

  // restore the logged-in user after a refresh or the Google redirect
  useEffect(() => {
    handleGetMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    <RouterProvider router={routes} />
    </>
  )
}

export default App

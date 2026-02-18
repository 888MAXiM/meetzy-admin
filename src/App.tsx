import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import Store from './redux/store'
import { RouterProvider } from 'react-router-dom'
import { Router } from './routers'
import { useAppDispatch } from './redux/hooks'
import { setSidebarToggle } from './redux/reducers/layoutSlice'
import { useLanguageInitializer } from './hooks/useLanguageInitializer'

function AppContent() {
  const dispatch = useAppDispatch()
  const isLanguageReady = useLanguageInitializer()

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      dispatch(setSidebarToggle(width < 1184))
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [dispatch])

  // Don't render router until language is ready
  if (!isLanguageReady) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <>
      <RouterProvider router={Router} />
      <ToastContainer />
    </>
  )
}

function App() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={Store}>
        <AppContent />
      </Provider>
    </QueryClientProvider>
  )
}

export default App

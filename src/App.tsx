import HomePage from './pages/Home/HomePage'
import ConfigPage from './pages/Config/ConfigPage'
import {
    Outlet,
    ReactRouter,
    Route,
    RootRoute,
  } from '@tanstack/react-router'

import './App.scss'


const rootRoute = new RootRoute({
    component: App,
})

const indexRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
})

const configRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/config',
    component: ConfigPage,
})
  
const routeTree = rootRoute.addChildren([indexRoute, configRoute])

export const router = new ReactRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  
  
  return (
    <>
        <Outlet/>
    </>
    
  )
}

export default App

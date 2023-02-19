import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { router } from './App'
import { RouterProvider } from '@tanstack/react-router'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <RouterProvider router={router} />
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppProvider } from './context/AppContext.tsx'
import 'leaflet/dist/leaflet.css'
import { SocketProvider } from './context/SocketContext.tsx'

export const authService = "https://tazo-auth-2.onrender.com";
export const restaurantService = "https://tazo-restaurant.onrender.com";
export const utilsService = "https://tazo-utils.onrender.com";
export const realtimeService = "https://tazo-realtime.onrender.com";
export const riderService = "https://tazo-rider.onrender.com";
export const adminService = "https://tazo-admin.onrender.com";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='5644769388-kgba4acne1om34f4ceq17664mp2p3ftf.apps.googleusercontent.com'>
      <AppProvider>
        <SocketProvider>
        <App />

        </SocketProvider>
      </AppProvider>
      
      
    </GoogleOAuthProvider>
  </StrictMode>,
)

import {StrictMode} from 'react'
import {Container, createRoot} from 'react-dom/client'
import './index.css'
import App from './App'
import {AlertsProvider} from "@components/AlertsProvider";

createRoot(document.getElementById('root') as Container).render(
    <StrictMode>
        <AlertsProvider>
            <App/>
        </AlertsProvider>
    </StrictMode>,
)

import { createContext } from 'react';
import {AlertContextType} from "../interfaces/Alerts";

const defaultContextValue: AlertContextType = {
    alerts: [],
    setAlerts: () => {}, // No-op function for default value
};

const AlertContext = createContext<AlertContextType>(defaultContextValue);

export default AlertContext;
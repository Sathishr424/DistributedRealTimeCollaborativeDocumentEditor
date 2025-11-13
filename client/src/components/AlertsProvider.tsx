import React, {createContext, useState} from "react";
import Alert from "@components/Alert";
import AlertContext from "@components/AlertContext";
import {AlertContextType, AlertItem} from "../interfaces/Alerts";


export function AlertsProvider({children}: { children: React.ReactNode }) {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);
    const contextValue: AlertContextType = {alerts, setAlerts};
    return (
        <AlertContext.Provider value={contextValue}>
            <Alert alertsState={alerts} setAlertsState={setAlerts}/>
            {children}
        </AlertContext.Provider>
    );
}

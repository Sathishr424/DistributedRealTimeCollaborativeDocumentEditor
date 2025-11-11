import React, {createContext, useState} from "react";
import Alert from "./Alert.jsx";
import AlertContext from "./AlertContext.jsx";


export function AlertsProvider({children}) {
    const [alerts, setAlerts] = useState([]);
    return (
        <AlertContext.Provider value={{alerts, setAlerts}}>
            <Alert alertsState={alerts} setAlertsState={setAlerts}/>
            {children}
        </AlertContext.Provider>
    );
}

import React from "react";

export interface AlertItem {
    id: string,
    message: string
}

export interface AlertContextType {
    alerts: AlertItem[];
    setAlerts: React.Dispatch<React.SetStateAction<AlertItem[]>>;
}
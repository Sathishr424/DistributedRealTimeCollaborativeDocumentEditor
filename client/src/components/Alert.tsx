import { useEffect, useState } from "react"

export default function Alert({ alertsState, setAlertsState }) {
    const [onQueue, setOnQueue] = useState([]);

    const autoHide = (id) => {
        setAlertsState(prev => prev.filter(a => a.id !== id));
        setOnQueue(prev => prev.filter(a => a !== id));
    }

    useEffect(() => {
        alertsState.forEach(a => {
            if (!onQueue.includes(a.id)) {
                setOnQueue(prev => [...prev, a.id]);
                setTimeout(autoHide, 2000, a.id);
            }
        })    
    }, [alertsState])

    return alertsState.length > 0 ? <div className="fixed top-0 right-0">
        <div className="flex justify-center items-center mr-10 my-4">
            {
                alertsState.map((alert, key) => {
                    return <div key={key} className="py-4 px-3 bg-blue-300 m-2">
                        <p className="text-lg font-bold">{alert.message}</p>
                    </div>
                })
            }
        </div>
    </div> : <></>
}
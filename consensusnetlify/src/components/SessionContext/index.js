import React, { useContext, useState } from 'react';
const SessionContext = React.createContext();
export function useSessionContext() {
    return useContext(SessionContext);
}
export function SessionProvider({ children }) {
    const [session, setSession] = useState("");

    const value = {
        session,
        setSession
    }
    return(
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}
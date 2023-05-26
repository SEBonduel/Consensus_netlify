import React, { useContext, useState } from 'react';

const CurrentSessionContext = React.createContext();

export function useCurrentSession() {
    return useContext(CurrentSessionContext);
}

export function CurrentSessionProvider({ children }) {

    const [idCurrentSession, setIdCurrentSession] = useState(false);

    const value = {
        idCurrentSession,
        setIdCurrentSession
    }

    return(
        <CurrentSessionContext.Provider value={value}>
            {children}
        </CurrentSessionContext.Provider>
    )
}
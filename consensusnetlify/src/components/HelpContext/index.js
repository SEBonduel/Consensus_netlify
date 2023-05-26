import React, { useContext, useState } from 'react';

const HelpContext = React.createContext();

export function useHelp() {
    return useContext(HelpContext);
}

export function HelpProvider({ children }) {

    const [currentHelp, setCurrentHelp] = useState(null);

    const value = {
        currentHelp,
        setCurrentHelp
    }

    return(
        <HelpContext.Provider value={value}>
            {children}
        </HelpContext.Provider>
    )
}
import React, { useContext, useState } from 'react';

const PageContext = React.createContext();

export function usePage() {
    return useContext(PageContext);
}

export function PageProvider({ children }) {

    const [currentPage, setCurrentPage] = useState("global");

    const value = {
        currentPage,
        setCurrentPage
    }

    return(
        <PageContext.Provider value={value}>
            {children}
        </PageContext.Provider>
    )
}
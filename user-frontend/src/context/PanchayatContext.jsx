import React, { createContext, useContext, useState, useEffect } from 'react';

const PanchayatContext = createContext(null);

export const PanchayatProvider = ({ children }) => {
    const [selectedPanchayat, setSelectedPanchayat] = useState(() => {
        const stored = localStorage.getItem('selectedPanchayat');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (selectedPanchayat) {
            localStorage.setItem('selectedPanchayat', JSON.stringify(selectedPanchayat));
        } else {
            localStorage.removeItem('selectedPanchayat');
        }
    }, [selectedPanchayat]);

    return (
        <PanchayatContext.Provider value={{ selectedPanchayat, setSelectedPanchayat }}>
            {children}
        </PanchayatContext.Provider>
    );
};

export const usePanchayat = () => {
    const context = useContext(PanchayatContext);
    if (!context) {
        throw new Error('usePanchayat must be used within a PanchayatProvider');
    }
    return context;
};

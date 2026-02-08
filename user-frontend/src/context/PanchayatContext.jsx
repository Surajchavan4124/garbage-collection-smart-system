import { createContext, useState, useEffect, useContext } from 'react';

const PanchayatContext = createContext();

export const usePanchayat = () => useContext(PanchayatContext);

export const PanchayatProvider = ({ children }) => {
  const [selectedPanchayat, setSelectedPanchayat] = useState(null);
  const [isPanchayatModalOpen, setIsPanchayatModalOpen] = useState(false);

  useEffect(() => {
    // Check localStorage on load
    const savedPanchayat = localStorage.getItem('selectedPanchayat');
    if (savedPanchayat) {
      setSelectedPanchayat(JSON.parse(savedPanchayat));
    } else {
      setIsPanchayatModalOpen(true);
    }
  }, []);

  const selectPanchayat = (panchayat) => {
    setSelectedPanchayat(panchayat);
    localStorage.setItem('selectedPanchayat', JSON.stringify(panchayat));
    setIsPanchayatModalOpen(false);
  };

  const changePanchayat = () => {
    setIsPanchayatModalOpen(true);
  };

  return (
    <PanchayatContext.Provider
      value={{
        selectedPanchayat,
        isPanchayatModalOpen,
        selectPanchayat,
        changePanchayat,
        setIsPanchayatModalOpen // Exporting setter in case we need fine control
      }}
    >
      {children}
    </PanchayatContext.Provider>
  );
};

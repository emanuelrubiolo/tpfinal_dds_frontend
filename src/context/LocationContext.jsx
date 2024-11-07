
import { createContext, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);

  const addLocation = (location) => {
    setLocations((prevLocations) => [...prevLocations, location]);
  };

  return (
    <LocationContext.Provider value={{ locations, addLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

import React, { createContext, useContext, useState } from 'react';
import type { Doctor } from '../services/api';

interface AuthContextType {
  doctor: Doctor | null;
  setDoctor: (doctor: Doctor | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  doctor: null,
  setDoctor: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctor, setDoctorState] = useState<Doctor | null>(() => {
    try {
      const stored = localStorage.getItem('visumed_doctor');
      return stored ? (JSON.parse(stored) as Doctor) : null;
    } catch {
      return null;
    }
  });

  const setDoctor = (d: Doctor | null) => {
    setDoctorState(d);
    if (d) localStorage.setItem('visumed_doctor', JSON.stringify(d));
    else localStorage.removeItem('visumed_doctor');
  };

  const logout = () => setDoctor(null);

  return (
    <AuthContext.Provider value={{ doctor, setDoctor, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

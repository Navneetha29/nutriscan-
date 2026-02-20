import React, { createContext, useState, useContext } from 'react';

const RegistrationContext = createContext();

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};

export const RegistrationProvider = ({ children }) => {
  const [registrationData, setRegistrationData] = useState({
    // Screen 1: Signup Data
    full_name: '',
    email: '',
    phone: '',
    password: '',
    
    // Screen 2: Age & Gender
    age: null,
    gender: '',
    
    // Screen 3: Health Profile
    health_conditions: {
      diabetes: false,
      high_blood_pressure: false,
      nut_allergy: false,
      lactose_intolerance: false,
      celiac_disease: false,
      heart_disease: false,
    }
  });

  // Update specific data
  const updateRegistrationData = (newData) => {
    setRegistrationData(prev => ({
      ...prev,
      ...newData
    }));
  };

  // Update health conditions
  const updateHealthConditions = (conditions) => {
    setRegistrationData(prev => ({
      ...prev,
      health_conditions: {
        ...prev.health_conditions,
        ...conditions
      }
    }));
  };

  // Clear all data (for logout or restart)
  const clearRegistrationData = () => {
    setRegistrationData({
      full_name: '',
      email: '',
      phone: '',
      password: '',
      age: null,
      gender: '',
      health_conditions: {
        diabetes: false,
        high_blood_pressure: false,
        nut_allergy: false,
        lactose_intolerance: false,
        celiac_disease: false,
        heart_disease: false,
      }
    });
  };

  // Get all data for submission
  const getRegistrationData = () => {
    return registrationData;
  };

  const value = {
    registrationData,
    updateRegistrationData,
    updateHealthConditions,
    clearRegistrationData,
    getRegistrationData
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () =>{
    return useContext(AuthContext)
}

// AuthContext.jsx
export const AuthContextProvider = ({ children }) => { 
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null);

  
    return (
      <AuthContext.Provider value={{ authUser, setAuthUser }}>
        {children}
      </AuthContext.Provider>
    );
  };
  


// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Create AuthContext
// const AuthContext = createContext();

// // Create AuthContext Provider
// export const AuthContextProvider = ({ children }) => {  // <- Renamed to AuthContextProvider
//   const [authUser, setAuthUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Simulating authentication logic (replace with your auth logic)
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       setAuthUser(false); // Set to false or user object if authenticated
//       setLoading(false);
//     }, 1000);

//     return () => clearTimeout(timeoutId);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ authUser, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use the AuthContext
// export const useAuthContext = () => {
//   return useContext(AuthContext);
// };





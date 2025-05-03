'use client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect } from 'react';

interface GlobalContextType {
  // Define any global state or functions here
  // For example:
  user: null;
}

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined
);

const GlobalProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const router = useRouter();

  const loadData = () => {
    const token = sessionStorage.getItem('user');
    if (!token) {
      router.replace('/');
    } else {
      // handleGetAttendance();
      //   getAttendance();
      //   fetchDashboardDetails();
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const value: GlobalContextType = {
    // Initialize any global state or functions here
    user: null,
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext) as GlobalContextType;
};

export default GlobalProvider;

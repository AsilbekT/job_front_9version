import { createContext, useCallback, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';

// Define UserContext here before using it in UserProvider
const UserContext = createContext(null);

export const dispatchRefetchUserEvent = () => {
  document.dispatchEvent(new CustomEvent('refetch:user'));
};

export const UserProvider = ({ children }) => {
  const userFetch = useFetch();

  const fetchUser = useCallback(() => {
    userFetch.makeRequest('/user/').then(async (response) => {
      const [user] = response?.error ? [] : response || [];
      if (user?.is_employer) {
        const [company] =
          (await userFetch.makeRequest('/companies/', undefined, true)) || [];
        if (company) {
          userFetch.setData(
            (prev) => prev && [{ ...prev[0], companyData: company }]
          );
        }
      }
    });
  }, []);

  useEffect(() => {
    fetchUser();
    document.addEventListener('refetch:user', fetchUser);
    return () => {
      document.removeEventListener('refetch:user', fetchUser);
    };
  }, [fetchUser]);

  return (
    <UserContext.Provider value={userFetch.data?.[0] || null}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };

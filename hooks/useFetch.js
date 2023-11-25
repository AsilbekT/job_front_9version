import { useCallback, useState } from 'react';
import { fetchWithAuth } from '../utils/fetch.util';

export const useFetch = (initiallyLoading = true) => {
  const [loading, setLoading] = useState(initiallyLoading);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(
    async (reqInit, reqBody, noStateSave, noToken) => {
      try {
        setError(null);
        setLoading(true);

        const response = await (noToken
          ? fetch(`${process.env.NEXT_PUBLIC_API_URL}${reqInit}`, reqBody)
          : fetchWithAuth(reqInit, reqBody));

        const data = (await response.json()) || {};
        if (response.ok && !noStateSave) {
          setData(data);
        } else if (!response.ok) {
          console.log({ errorResponse: data });
          data['error'] = true;
        }

        return data;
      } catch (er) {
        console.log(er.response);
        setError(er);
        return er.response;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    makeRequest,
    loading,
    setLoading,
    error,
    setError,
    data,
    setData,
  };
};

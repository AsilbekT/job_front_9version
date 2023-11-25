import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchWithAuth = (reqInit, reqOptions) => {
  const authToken = Cookies.get('token');
  return fetch(`${API_URL}${reqInit}`, {
    ...(reqOptions || {}),
    headers: {
      ...(reqOptions?.headers || {}),
      Authorization: `Token ${authToken}`
    }
  });
};
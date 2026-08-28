const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


export const apiRequest = async (
  endpoint,
  options = {}
) => {

  const token =
    localStorage.getItem(
      "token"
    );


  const headers = {
    ...options.headers,
  };


  // JSON request
  if (
    options.body &&
    !(
      options.body
      instanceof FormData
    )
  ) {
    headers["Content-Type"] =
      "application/json";
  }


  // JWT
  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }


  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );


  let data;


  try {
    data =
      await response.json();

  } catch {
    data = {
      message:
        "Invalid server response",
    };
  }


  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong"
    );
  }


  return data;
};
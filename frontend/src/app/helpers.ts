// FIXME: Use OpenAPI library for typing requests?
export const makeAPIRequest = async (endpoint: string, data?: unknown) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  let response: Response;

  if (data) {
    // POST request when data is provided
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } else {
    // GET request when no data
    response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const result = await response.json();
  return result.responseObject;
};

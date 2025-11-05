// Just a simple API request abstraction as we only have GET and POST requests (for now)
// In the future we could use an OpenAPI library for typing requests?
export const makeAPIRequest = async (endpoint: string, data?: unknown) => {
  let response: Response;

  if (data) {
    // POST request when data is provided
    response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } else {
    // GET request when no data
    response = await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
    });
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const result = await response.json();
  return result;
};

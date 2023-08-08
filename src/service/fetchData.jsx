export const fetchData = async (method, url = '', data = {}) => {
  const response = await fetch(url, {
    method: method,
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) 
  });
  return response.json(); 
}
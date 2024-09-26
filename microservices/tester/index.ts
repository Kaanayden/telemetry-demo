
interface Endpoint {
    port: string | number | undefined;
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: object;
  }
  
  const endpoints: Endpoint[] = [
    {
        port: process.env.MEAL_RESTAURANT_PORT,
        path: '/update-delivery-status',
        method: 'PUT',
    },
    {
        port: process.env.MEAL_RESTAURANT_PORT,
        path: '/get-delivery-prices',
        method: 'GET',
    },
    {
        port: process.env.MEAL_ORDER_PORT,
        path: '/restaurants/comment/upload-picture',
        method: 'POST',
    },
    {
        port: process.env.MEAL_ORDER_PORT,
        path: '/orders/purchase',
        method: 'POST',
    },
    {
        port: process.env.MEAL_RESTAURANT_PORT,
        path: '/upload-menu/akdeniz-mutfak',
        method: 'POST',
    },

  ];

  async function callEndpoints(): Promise<void> {
    const fetchPromises = endpoints.map(async endpoint => {
      const { path, port, method, headers = {}, body } = endpoint;
  
      try {
        await fetch(`${process.env.SERVICE_URL}:${port}${path}`, {
            method: method,
            headers: headers,
            body: body ? JSON.stringify(body) : undefined,
        });
      } catch {

      }
    });
  
    await Promise.all(fetchPromises);
  }
  

  function startInterval(): void {
    callEndpoints(); // Call immediately on startup
    setInterval(callEndpoints, 3000); // Call every 5 minutes
  }
  
  startInterval();
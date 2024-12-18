export const SERVER_URL = (async () => {
    const res = await fetch('/config.json');
    const config = await res.json();
    return config.API_URL;
  })();
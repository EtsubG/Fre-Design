import { useCallback, useEffect, useState } from 'react';

/**
 * General-purpose async data fetcher with loading, error, and refetch support.
 * Resolves .data from the service layer convention used across this app.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result.data !== undefined ? result.data : result);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetcher()
      .then((result) => {
        if (active) {
          setData(result.data !== undefined ? result.data : result);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Something went wrong.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
}

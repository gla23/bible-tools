import fetchJsonp from "fetch-jsonp";
import { useState, useEffect } from "react";

export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!url) return setData(null);
    let current = true;
    fetchJsonp(url)
      .then((r) => r.json())
      .then((json) => current && setData(json as T))
      .catch((error) => {
        if (current) setData(null);
        console.log(error);
      });
    return () => {
      current = false;
    };
  }, [url]);

  return [data];
};

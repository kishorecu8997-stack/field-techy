import axios from "axios";
import React, { useCallback, useEffect, useMemo } from "react";

interface UseGetDataProps {
  url: string;
  isEnabled?: boolean;
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number>;
  signature?: string;  // if needed later
  deviceId?: string;   // if needed later
  urlType?: "prod" | "demo";
}

interface UseGetDataResult<T> {
  data: T | null;
  loading: boolean;
  error: any | null;
  success: boolean;
  refetch: () => void;
}

function formatUrl(
  url: string,
  pathParams: Record<string, string | number> = {},
  queryParams: Record<string, string | number> = {}
): string {
  const urlWithPath = Object.keys(pathParams).reduce((acc, key) => {
    return acc.replace(`:${key}`, encodeURIComponent(String(pathParams[key])));
  }, url);

  const queryString = new URLSearchParams(
    Object.fromEntries(
      Object.entries(queryParams).map(([key, val]) => [key, String(val)])
    )
  ).toString();

  return queryString ? `${urlWithPath}?${queryString}` : urlWithPath;
}

export const useGetData = <T,>({
  url,
  isEnabled = true,
  pathParams = {},
  queryParams = {},
  urlType = "prod",
}: UseGetDataProps): UseGetDataResult<T> => {
  
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);

  const token = "";

  const LOCAL_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /** Memoized URL formatting */
  const formattedUrl = useMemo(
    () => formatUrl(url, pathParams, queryParams),
    [url, pathParams, queryParams]
  );

  /** Memoized final API URL */
  const API_URL = useMemo(
    () =>
      urlType === "prod"
        ? `${import.meta.env.VITE_BASE_URL}${formattedUrl}`
        : `${LOCAL_BASE_URL}${formattedUrl}`,
    [formattedUrl, urlType]
  );

  /** Fetch function with AbortController */
  const fetchData = useCallback(async () => {
    if (!url) return;

    const controller = new AbortController();

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const response = await axios.get<T>(API_URL, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      setData(response.data);
      setSuccess(true);
    } catch (err: any) {
      if (axios.isCancel(err)) return;

      setError({
        message: err?.response?.data?.message ?? err.message,
        status: err?.response?.status,
        raw: err,
      });

      setSuccess(false);
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [API_URL, token, url]);

  /** Auto-fetch when enabled */
  useEffect(() => {
    if (isEnabled) {
      fetchData();
    }
  }, [isEnabled, fetchData]);

  /** Exposed refetch function */
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, success, refetch };
};

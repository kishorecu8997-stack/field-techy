import axios from "axios";
import React, { useCallback, useMemo, useState } from "react";

interface UsePostDataProps {
  url: string;
  urlType?: "prod" | "demo";
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number>;
}

interface PostResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}

interface UsePostDataResult<T> {
  data: T | null;
  loading: boolean;
  error: any | null;
  success: boolean;
  message: string | null;
  mutate: (body?: any) => Promise<void>;
  reset: () => void;
}

function formatUrl(
  url: string,
  pathParams: Record<string, string | number> = {},
  queryParams: Record<string, string | number> = {}
) {
  const withParams = Object.keys(pathParams).reduce((acc, key) => {
    return acc.replace(`:${key}`, encodeURIComponent(String(pathParams[key])));
  }, url);

  const queryString = new URLSearchParams(
    Object.fromEntries(
      Object.entries(queryParams).map(([k, v]) => [k, String(v)])
    )
  ).toString();

  return queryString ? `${withParams}?${queryString}` : withParams;
}

export const usePostData = <T,>({
  url,
  urlType = "prod",
  pathParams = {},
  queryParams = {},
}: UsePostDataProps): UsePostDataResult<T> => {
  
  const [data, setData] = useState<T | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const token = "";

  const LOCAL_BASE_URL = "http://3.110.252.163:3000";

  /** Memoize final URL */
  const formattedUrl = useMemo(
    () => formatUrl(url, pathParams, queryParams),
    [url, pathParams, queryParams]
  );

  const API_URL = useMemo(
    () =>
      urlType === "prod"
        ? `${import.meta.env.VITE_BASE_URL}${formattedUrl}`
        : `${LOCAL_BASE_URL}${formattedUrl}`,
    [formattedUrl, urlType]
  );

  /** Mutation function */
  const mutate = useCallback(
    async (body?: any): Promise<void> => {
      const controller = new AbortController();

      setLoading(true);
      setError(null);
      setSuccess(false);
      setMessage(null);

      /** Detect body type & set proper headers */
      const isFormData = body instanceof FormData;

      const headers: Record<string, string> = {
        Authorization: token ? `Bearer ${token}` : "",
      };

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      try {
        const response = await axios.post<PostResponse<T>>(API_URL, body, {
          headers,
          signal: controller.signal,
        });

        setData(response.data.data ?? null);
        setMessage(response.data.message ?? null);
        setSuccess(response.data.success);
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
    },
    [API_URL, token]
  );

  /** Reset state */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setMessage(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    success,
    message,
    mutate,
    reset,
  };
};

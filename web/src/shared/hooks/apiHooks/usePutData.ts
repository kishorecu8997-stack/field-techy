import axios from "axios";
import { useCallback, useMemo, useState } from "react";

interface UsePutDataProps {
  url: string;
  urlType?: "prod" | "demo";
  pathParams?: Record<string, string | number>;
  queryParams?: Record<string, string | number>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}

interface UsePutDataResult<T> {
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
  const p = Object.keys(pathParams).reduce((acc, key) => {
    return acc.replace(`:${key}`, encodeURIComponent(String(pathParams[key])));
  }, url);

  const q = new URLSearchParams(
    Object.fromEntries(Object.entries(queryParams).map(([k, v]) => [k, String(v)]))
  ).toString();

  return q ? `${p}?${q}` : p;
}

export const usePutData = <T,>({
  url,
  urlType = "prod",
  pathParams = {},
  queryParams = {},
}: UsePutDataProps): UsePutDataResult<T> => {

  const [data, setData] = useState<T | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const token = "";
  const LOCAL_BASE_URL = "http://3.110.252.163:3000";

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

  const mutate = useCallback(
    async (body?: any): Promise<void> => {
      const controller = new AbortController();

      setLoading(true);
      setError(null);
      setSuccess(false);
      setMessage(null);

      const isFormData = body instanceof FormData;

      const headers: Record<string, string> = {
        Authorization: token ? `Bearer ${token}` : "",
      };

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      try {
        const response = await axios.put<ApiResponse<T>>(API_URL, body, {
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
      } finally {
        setLoading(false);
      }
    },
    [API_URL, token]
  );

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

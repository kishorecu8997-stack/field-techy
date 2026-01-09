import { useEffect, useState } from "react";
import { assetsConfig } from "@/assets";

/**
 * useStreamedImage
 *
 * Hook to stream an image from the server and return a URL to it.
 * The hook takes in a fileKey and a downloadFn, which are used to
 * retrieve the image from the server. The downloadFn is an optional
 * parameter that can be provided to override the default behavior.
 *
 * @param {string | null} fileKey - The file key of the image to stream.
 * @param {(fileKey: string) => Promise<{ blob: Blob }>} downloadFn - The function to download the image from the server.
 * @returns {string} The URL of the streamed image.
 */
export function useStreamedImage(
  fileKey?: string | null,
  downloadFn?: (fileKey: string) => Promise<{ blob: Blob }>
) {
  const [url, setUrl] = useState<string>(assetsConfig.images.users.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileKey || !downloadFn) {
      setUrl(assetsConfig.images.users.user);
      return;
    }

    let blobUrl: string | null = null;
    let cancelled = false;

    const loadImage = async () => {
      setLoading(true);
      try {
        const res = await downloadFn(fileKey);
        if (!cancelled) {
          blobUrl = URL.createObjectURL(res.blob);
          setUrl(blobUrl);
        }
      } catch {
        setUrl(assetsConfig.images.users.user);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadImage();

    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [fileKey, downloadFn]);

  return { url, loading };
}

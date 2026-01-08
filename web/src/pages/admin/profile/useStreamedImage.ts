import { useEffect, useState } from "react";
import { assetsConfig } from "@/assets";

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

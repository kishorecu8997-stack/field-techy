import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import type { RenderTask } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min?url";

interface PDFPreviewProps {
  url: string;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const isMountedRef = useRef(true);
  const currentUrlRef = useRef<string>(url);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    }
  }, []);

  useEffect(() => {
    // Track current URL to prevent stale renders
    currentUrlRef.current = url;
    isMountedRef.current = true;

    // Cancel any ongoing render task immediately
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (e) {
        // Ignore errors from cancellation
      }
      renderTaskRef.current = null;
    }

    const renderPDF = async () => {
      // Double-check we're still mounted and URL hasn't changed
      if (!isMountedRef.current || currentUrlRef.current !== url) {
        return;
      }

      // Reset state only if still mounted
      if (isMountedRef.current) {
        setLoading(true);
        setError(false);
      }

      // Wait a bit to ensure any previous render is fully cancelled
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Check again after delay
      if (!isMountedRef.current || currentUrlRef.current !== url) {
        return;
      }

      // Clear the canvas before rendering
      const canvas = canvasRef.current;
      if (!canvas || !isMountedRef.current) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      // Clear the canvas completely
      context.clearRect(0, 0, canvas.width || 0, canvas.height || 0);

      // Reset canvas dimensions
      canvas.width = 0;
      canvas.height = 0;

      try {
        // Check again before loading PDF
        if (!isMountedRef.current || currentUrlRef.current !== url) {
          return;
        }

        // Load the PDF document
        const pdf = await pdfjsLib.getDocument({
          url,
          withCredentials: false,
          // Add stopAtErrors to prevent hanging on corrupted PDFs
          stopAtErrors: false,
        }).promise;

        // Check again after PDF loads
        if (!isMountedRef.current || currentUrlRef.current !== url) {
          return;
        }

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        // Final check before rendering
        if (
          !isMountedRef.current ||
          currentUrlRef.current !== url ||
          !canvasRef.current
        ) {
          return;
        }

        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Create render task and store reference immediately
        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });
        renderTaskRef.current = renderTask;

        // Wait for render to complete, but check if cancelled
        await renderTask.promise;

        // Only update state if still mounted and URL matches
        if (isMountedRef.current && currentUrlRef.current === url) {
          renderTaskRef.current = null;
          setLoading(false);
        }
      } catch (err: any) {
        // Check if error is due to cancellation or if component unmounted
        if (!isMountedRef.current || currentUrlRef.current !== url) {
          return;
        }

        // Check for cancellation errors
        if (
          err?.name === "RenderingCancelledException" ||
          err?.message?.includes("cancelled") ||
          err?.message?.includes("cancel")
        ) {
          // Silently ignore cancellation errors
          return;
        }

        console.error("PDF render error:", err);
        if (isMountedRef.current && currentUrlRef.current === url) {
          setError(true);
          setLoading(false);
        }
      }
    };

    renderPDF();

    // Cleanup function to cancel render task on unmount or URL change
    return () => {
      isMountedRef.current = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          // Ignore errors from cancellation
        }
        renderTaskRef.current = null;
      }
    };
  }, [url, retryCount]);

  return (
    <div className="relative w-full h-56 rounded-lg  bg-white">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600" />
        </div>
      )}
      {error ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
          <span>Failed to load PDF preview</span>
          <button
            onClick={() => {
              setError(false);
              setRetryCount((prev: number) => prev + 1);
            }}
            className="text-xs text-teal-600 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <canvas ref={canvasRef} className="w-full h-full rounded-lg border  " />
      )}
    </div>
  );
};

export default PDFPreview;

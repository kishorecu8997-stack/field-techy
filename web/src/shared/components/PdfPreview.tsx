import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

interface PDFPreviewProps {
  url: string;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const renderPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument({ url, withCredentials: false }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('PDF render error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    renderPDF();
  }, [url]);

  return (
    <div className="relative w-full h-56 rounded-lg  bg-white">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600" />
        </div>
      )}
      {error ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          Failed to load PDF preview
        </div>
      ) : (
        <canvas ref={canvasRef} className="w-full h-full rounded-lg border  " />
      )}
    </div>
  );
};

export default PDFPreview;
import React from "react";

interface VideoCardProps {
  title: string;
  description: string;
  videoUrl: string;
}
const ALLOWED_VIDEO_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "player.vimeo.com",
  "vimeo.com",
];
function isTrustedVideoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return ALLOWED_VIDEO_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

/**
 * VideoCard component displays a video with a title, description, and URL.
 * It renders an iframe for YouTube, Vimeo, and YouTube Shorts videos.
 * If the URL is not from a trusted host, it displays a message.
 */
const VideoCard: React.FC<VideoCardProps> = ({ title, description, videoUrl }) => {
  const isTrusted = isTrustedVideoUrl(videoUrl);
  const safeVideoUrl = isTrusted ? videoUrl : undefined;
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="aspect-video">
        {safeVideoUrl ? (
          <iframe
            src={safeVideoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full rounded"
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Video cannot be displayed because the URL is not from a supported provider.
          </div>
        )}
      </div>
      </div>
  );
}

export default VideoCard;

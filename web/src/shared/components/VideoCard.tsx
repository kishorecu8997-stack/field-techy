import React from "react";

interface VideoCardProps {
  title: string;
  description: string;
  videoUrl: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ title, description, videoUrl }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="aspect-video">
        <iframe
          src={videoUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoCard;

import MyJobsHeader from "@/shared/components/MyJobsHeader";
import { videoGuidanceData } from "@/dummy_data/videoGuidanceData";
import VideoCard from "@/shared/components/VideoCard";

/**
 * VideoGuidance page displaying a list of videos with titles, descriptions, and links.
 * Renders a header and content section via reusable components.
 */
const VideoGuidance = () => {
  return (
    <div className="min-h-[60rem] w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Video Guidance"
          onSortChange={() => {}}
          isShowSort={false}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoGuidanceData.map((video) => (
            <VideoCard
              key={video.videoUrl}
              title={video.title}
              description={video.description}
              videoUrl={video.videoUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoGuidance;

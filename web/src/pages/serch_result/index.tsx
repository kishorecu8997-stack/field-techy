import { useEffect, useState } from "react";
import MyJobsHeader from "../../shared/components/MyJobsHeader";
import FilterPanel from "./components/FilterPanel";
import JobCard from "./components/JobCard";
import Pagination from "./components/Pagination";
import { SORT_OPTIONS, type Filters, type Job, type SortOption } from "./types";

/**
 * Main application component for job search results
 *
 * @returns {JSX.Element} Rendered application component
 */
const SearchResult = () => {
  // Sample job data
  const sampleJobs: Job[] = [
    {
      id: 1,
      title: "Senior Product Designer",
      client: "TechNova Co",
      time: "8 Hours of Jobs",
      description:
        "Join our dynamic team as a Senior Product Designer where you will lead the design of innovative products. Your role will encompass everything from conceptualization to execution, ensuring a seamless user experience across all platforms.",
      location: "San Francisco, USA",
      salary: "$4000",
      postedTime: "30min ago",
      category: "Designing",
      rating: 4,
      experience: 5,
      budgetType: "fixed",
      skills: ["Figma", "Adobe XD", "UI/UX"],
    },
    {
      id: 2,
      title: "Looking for a talented graphic designer",
      client: "TechNova Co",
      time: "8 Hours of Jobs",
      description:
        "We are seeking a talented graphic designer with a flair for creativity and a keen eye for detail. This position will focus on reimagining our visual identity and elevating our brand through stunning graphics.",
      location: "San Francisco, USA",
      salary: "$4000",
      postedTime: "30min ago",
      category: "Designing",
      rating: 5,
      experience: 3,
      budgetType: "fixed",
      skills: ["PhotoShop", "Illustrator", "Motion Graphics"],
    },
    {
      id: 3,
      title: "Junior Web Designer",
      client: "TechNova Co",
      time: "8 Hours of Jobs",
      description:
        "We are looking for a Junior Web Designer who is passionate about creating engaging and user-friendly websites. You will work alongside our team to assist in developing web interfaces that captivate users and enhance their online experience.",
      location: "Austin, USA",
      salary: "$4000",
      postedTime: "30min ago",
      category: "IT",
      rating: 4,
      experience: 2,
      budgetType: "hourly",
      skills: ["HTML", "CSS", "JavaScript", "UI/UX"],
    },
    {
      id: 4,
      title: "Software Engineer",
      client: "Innovate Tech",
      time: "10 Hours of Jobs",
      description:
        "We're looking for a skilled Software Engineer to join our growing team. You'll be working on cutting-edge applications and collaborating with cross-functional teams to deliver high-quality software solutions.",
      location: "New York, USA",
      salary: "$5000",
      postedTime: "1h ago",
      category: "IT",
      rating: 5,
      experience: 4,
      budgetType: "fixed",
      skills: ["Python", "Java", "SQL", "AWS"],
    },
  ];

  // State management
  const [jobs] = useState<Job[]>(sampleJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(sampleJobs);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentSort, setCurrentSort] = useState<SortOption>(
    SORT_OPTIONS.NEWEST
  );
  const [filters, setFilters] = useState<Filters>({
    location: [],
    category: [],
    rating: [],
    experience: 0,
    budgetType: null,
    skills: [],
  });

  // Calculate total pages based on filtered jobs
  useEffect(() => {
    setTotalPages(Math.ceil(filteredJobs.length / 4));
  }, [filteredJobs]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...jobs];

    // Apply location filter
    if (filters.location.length > 0) {
      filtered = filtered.filter((job) =>
        filters.location.some((loc) => job.location.includes(loc))
      );
    }

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((job) =>
        filters.category.some((cat) => job.category.includes(cat))
      );
    }

    // Apply rating filter
    if (filters.rating.length > 0) {
      filtered = filtered.filter((job) => filters.rating.includes(job.rating));
    }

    // Apply experience filter
    if (filters.experience > 0) {
      filtered = filtered.filter((job) => job.experience >= filters.experience);
    }

    // Apply budget type filter
    if (filters.budgetType) {
      filtered = filtered.filter(
        (job) => job.budgetType === filters.budgetType
      );
    }

    // Apply skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter((job) =>
        filters.skills.some((skill) => job.skills.includes(skill))
      );
    }

    // Apply sorting
    switch (currentSort) {
      case SORT_OPTIONS.NEWEST:
        filtered.sort((a, b) => {
          // Simple sort by posted time (assuming format like "30min ago")
          const timeA = a.postedTime.includes("min")
            ? parseInt(a.postedTime)
            : a.postedTime.includes("h")
            ? parseInt(a.postedTime) * 60
            : 0;
          const timeB = b.postedTime.includes("min")
            ? parseInt(b.postedTime)
            : b.postedTime.includes("h")
            ? parseInt(b.postedTime) * 60
            : 0;
          return timeB - timeA;
        });
        break;
      case SORT_OPTIONS.OLDEST:
        filtered.sort((a, b) => {
          const timeA = a.postedTime.includes("min")
            ? parseInt(a.postedTime)
            : a.postedTime.includes("h")
            ? parseInt(a.postedTime) * 60
            : 0;
          const timeB = b.postedTime.includes("min")
            ? parseInt(b.postedTime)
            : b.postedTime.includes("h")
            ? parseInt(b.postedTime) * 60
            : 0;
          return timeA - timeB;
        });
        break;
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [jobs, filters, currentSort]);

  /**
   * Handle filter changes
   * @param {Filters} newFilters - New filter state
   */
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  /**
   * Clear all filters
   */
  const handleClearAllFilters = () => {
    setFilters({
      location: [],
      category: [],
      rating: [],
      experience: 0,
      budgetType: null,
      skills: [],
    });
  };

  /**
   * Handle page change
   * @param {number} page - New page number
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * Handle sort change
   * @param {SortOption} sort - New sort option
   */
  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort);
  };

  // Get jobs for current page
  const startIndex = (currentPage - 1) * 4;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + 4);

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6 md:px-6">
        <MyJobsHeader
          title="Search Result"
          currentSort="Newest"
          isShowBreadcrumb={false}
          description={`${filteredJobs.length} jobs found`}
          onSortChange={(sort) => handleSortChange(sort)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {currentJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          <div className="lg:col-span-1">
            <FilterPanel
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAllFilters}
              currentFilters={filters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;

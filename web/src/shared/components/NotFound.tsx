// pages/NotFound.tsx
import { urls } from "@/config/urls";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to={urls.home.root}
        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;

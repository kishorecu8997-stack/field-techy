import { useNavigate } from "react-router-dom";
import { Button } from "./commonUI/Buttons";

/**
 * 404 Not Found page with a link back to the home dashboard.
 */
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button
        onClick={handleGoToHome}
        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
      >
        Go Back
      </Button>
    </div>
  );
};

export default NotFound;

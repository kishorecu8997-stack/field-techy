import type { ServiceCategory } from "../type";

interface ServiceCategoryCardProps extends ServiceCategory {
  categoryId?: number;
}

/**
 * `ServiceCategoryCard` displays a card for a specific service category.
 * It shows the category name, an image, and a description of available engineers.
 * @param {ServiceCategoryCardProps} props The properties for the component.
 * @param {string} props.name The name of the service category.
 * @param {string} props.engineers A string describing the number of engineers (e.g., "50+ Engineers").
 * @param {string} [props.image] The URL for the category's background image (optional).
 * @param {number} [props.categoryId] Optional category ID for navigation tracking.
 */
const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({
  name,
  engineers,
  image,
}) => {
  // If no image is provided, show a simple colored card without image
  if (!image) {
    return (
      <div className="relative rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-br from-teal-600 to-teal-800 h-48 flex flex-col justify-center items-center p-4">
        <h3 className="text-white font-bold text-lg text-center">{name}</h3>
        {engineers && (
          <p className="text-green-300 text-sm mt-1">{engineers}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-105">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-white font-bold text-lg">{name}</h3>
        <p className="text-green-300 text-sm">{engineers}</p>
      </div>
    </div>
  );
};

export default ServiceCategoryCard;

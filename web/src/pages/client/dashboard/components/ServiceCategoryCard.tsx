import type { ServiceCategory } from "../type";


const ServiceCategoryCard: React.FC<ServiceCategory> = ({ name, engineers, image }) => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-md transition-transform duration-300 hover:scale-105">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-48 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h3 className="text-white font-bold text-lg">{name}</h3>
        <p className="text-green-300 text-sm">{engineers}</p>
      </div>
    </div>
  );
};

export default ServiceCategoryCard;
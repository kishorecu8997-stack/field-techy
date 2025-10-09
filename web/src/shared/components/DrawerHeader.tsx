import { IoCloseSharp } from "react-icons/io5";

const DrawerHeader = ({ onClose, title = 'title' }:{onClose:()=>void, title:string }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <IoCloseSharp className="h-6 w-6 cursor-pointer" />
      </button>
    </div>
  );
};

export default DrawerHeader;

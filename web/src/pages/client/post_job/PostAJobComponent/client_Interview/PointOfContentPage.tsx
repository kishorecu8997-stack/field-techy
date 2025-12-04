import { Button } from "@/shared/components/commonUI/Buttons";
import useDrawerStore from "@/shared/store/useDrawerStore";

const PointOfContentPage = () => {

    const  {setActiveKey,setISOpenSidebar} = useDrawerStore()

    const handleAddPointOfContent = () => {
        setISOpenSidebar(true);
        setActiveKey("addPointOfContent");
    };


  return (
    <section className="bg-teal-900 text-white rounded-2xl p-8 w-full max-w-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-2">Point of Contact</h2>
      <p className="text-sm opacity-90 mb-6">No Point of Contact added yet</p>

      <Button  className="rounded-full" onClick={handleAddPointOfContent}>
        Add Point of Contact
      </Button>
    </section>
  );
};

export default PointOfContentPage;

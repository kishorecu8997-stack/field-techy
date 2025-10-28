import { rectangle } from "leaflet";
import EngineerListPage from "./components/EngineerListPage";
import Header from "@/shared/components/client/Header";
import Filters from "@/shared/components/client/Filters";


const ExploreEngineer = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="sticky top-[80px] z-10 bg-gray-100 dark:bg-gray-900">
                            <Header currentPath="Explore Engineers" />
                        </div>
                        <div className="space-y-10">
                            <EngineerListPage />
                        </div>
                    </div>
                    <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Filters />
            </div>
          </div>
                </div>
            </div>
        </div>  
    );
}

export default ExploreEngineer;
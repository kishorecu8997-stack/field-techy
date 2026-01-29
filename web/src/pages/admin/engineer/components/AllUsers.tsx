import { manageEngineer } from "@/dummy_data/admin/manageEngineer";
import CustomTable from "@/shared/components/commonUI/custom_table";
import type { Column } from "@/shared/components/commonUI/custom_table";
import { FaUserCircle } from "react-icons/fa";
import { Button } from "@/shared/components/commonUI/Buttons";
import type { ManageEngineerProps } from "../types";
import Popup from "@/shared/components/Popup";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { SearchInput } from "@/shared/components/commonUI/custom_table/SearchInput";

/**
 * AllUsers Component
 *
 * Displays a searchable table of engineers with details such as ID, name, email,
 * location, registration date, KYC and employment status, average rating, and documents.
 * Provides a modal popup to view the documents of a selected engineer.
 *
 * Features:
 * - Search engineers by ID, name, email, or location.
 * - Open document popup for a selected engineer.
 * - Responsive and scrollable table.
 *
 * @component
 * @returns {JSX.Element} The rendered AllUsers component with search, table, and popup.
 */

export default function AllUsers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredData = manageEngineer.filter((e) => {
    const query = search.toLowerCase();

    return (
      e.engineerID.toLowerCase().includes(query) ||
      e.details.name.toLowerCase().includes(query) ||
      e.details.email.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query)
    );
  });

  const columns: Column<ManageEngineerProps>[] = [
    { key: "id", label: "Sr.No." },
    { key: "engineerID", label: "Engineer ID" },
    {
      key: "details",
      label: "Details",
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <FaUserCircle className="h-6 w-6 text-gray-500" />
          <div>
            <div className="font-semibold">{row.details.name}</div>
            <div className="text-sm text-gray-500">{row.details.phone}</div>
            <div className="text-sm text-gray-500">{row.details.email}</div>
          </div>
        </div>
      ),
    },
    { key: "location", label: "Location" },
    {
      key: "registrationDate",
      label: "Registration Date",
      dataCellAlign: "center",
    },
    { key: "kycStatus", label: "KYC Status", dataCellAlign: "center" },
    {
      key: "employmentStatus",
      label: "Employment Status",
      dataCellAlign: "center",
    },
    { key: "avgRating", label: "Avg Rating", dataCellAlign: "center" },
    {
      key: "documents",
      label: "Documents",
      dataCellAlign: "center",
      renderCell: (row) => (
        <Button
          className="bg-teal-700 text-white"
          onClick={() => {
            setIsModalOpen(true);
            setSelectedRowId(row.id);
          }}
        >
          {row.documents}
        </Button>
      ),
    },
  ];

  const selectedEngineer = filteredData.find((eng) => eng.id === selectedRowId);

  return (
    <div>
      <div className="px-2 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <div className="flex flex-wrap gap-4 items-center">
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <div className="w-full h-full overflow-auto">
          <CustomTable<ManageEngineerProps>
            columns={columns}
            data={filteredData}
            initialPageSize={10}
          />
        </div>
        {isModalOpen && selectedEngineer && (
          <Popup open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">
                  View File for {selectedEngineer.details.name}
                </span>
                <div
                  className="text-xl font-semibold cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close modal"
                >
                  <IoCloseSharp />
                </div>
              </div>
              <div className="border border-gray-400 h-36 my-6 flex items-center justify-center">
                {/* Replace with actual file/image if available */}
                <img src="https://via.placeholder.com/500" alt="file" />
              </div>
            </div>
          </Popup>
        )}
      </div>
    </div>
  );
}

import { absoluteUrls } from "@/config/urls";
import {
  SelectEngineer,
  type SelectEngineerProps,
} from "@/dummy_data/admin/manageGroups";
import { Button } from "@/shared/components/commonUI/Buttons";
import CustomTable, {
  type Column,
} from "@/shared/components/commonUI/custom_table";
import { InputField } from "@/shared/components/commonUI/inputs";
import { FormContainer } from "@/shared/components/commonUI/inputs/FormContainer";
import Popup from "@/shared/components/Popup";
import { usePopupStore } from "@/shared/store/popupStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import type { AddGroup } from "../type";
import { validateGroupName } from "@/utils/validate";
import { toast } from "react-toastify";

// Example dropdown options (replace with actual values from your system)
const tenancyOptions = ["Client A", "Client B", "Client C"];
const roleOptions = ["Junior Engineer", "Senior Engineer", "Lead Engineer"];
const levelOptions = ["Junior", "Mid", "Senior", "Lead"];
const skillsOptions = ["React", "Node.js", "Python", "DevOps"];

export default function AddGroup() {
  const methods = useForm({
    defaultValues: {
      groupName: "",
      groupDescription: "",
      selectedIds: [],
    },
  });

  const { showPopup } = usePopupStore();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  // Filters state
  const [filters, setFilters] = useState({
    tenancy: "",
    role: "",
    location: "",
    level: "",
    skills: "",
  });

  // Columns definition
  const columns: Column<SelectEngineerProps>[] = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          aria-label="Select all"
          checked={selectedIds.length === SelectEngineer.length}
          ref={(input) => {
            if (input) {
              input.indeterminate =
                selectedIds.length > 0 &&
                selectedIds.length < SelectEngineer.length;
            }
          }}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(SelectEngineer.map((item) => item.engineerID));
            } else {
              setSelectedIds([]);
            }
          }}
        />
      ),
      renderCell: (row: SelectEngineerProps) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.engineerID)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((prev) => [...prev, row.engineerID]);
            } else {
              setSelectedIds((prev) =>
                prev.filter((id) => id !== row.engineerID),
              );
            }
          }}
        />
      ),
    },
    { key: "id", label: "Sr.No." },
    { key: "engineerID", label: "Engineer ID" },
    {
      key: "details",
      label: "Details",
      renderCell: (row: SelectEngineerProps) => (
        <div className="text-sm flex items-center gap-2">
          <FaUserCircle className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
          <div>
            <div className="font-semibold">{row.details.name}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.details.phone}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {row.details.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "documents",
      label: "View Documents",
      align: "center",
      renderCell: (row: SelectEngineerProps) => {
        const name = row.documents || "N/A";
        return (
          <div className="mx-auto text-center">
            <Button
              className="w-fit bg-gradient-to-r p-4 bg-teal-900 text-white"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedRowId(row.id);
              }}
            >
              {name}
            </Button>
          </div>
        );
      },
    },
    { key: "tenancy", label: "Tenancy" },
    { key: "role", label: "Role" },
    { key: "location", label: "Location" },
    { key: "level", label: "Level" },
{
  key: "skills",
  label: "Skills",
  renderCell: (row: SelectEngineerProps) => (
    <div className="flex flex-wrap gap-1">
      {row.skills.map((skill) => (
        <span
          key={skill}
          className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs font-medium"
        >
          {skill}
        </span>
      ))}
    </div>
  ),
},
    { key: "registrationDate", label: "Registration Date" },
    { key: "walletBalance", label: "Wallet Balance" },
    { key: "kycStatus", label: "KYC Status" },
    { key: "employmentStatus", label: "Employment Status" },
    { key: "avgRating", label: "Avg Rating" },
  ];

  // Filtered engineers based on search/filter
  const filteredEngineers = SelectEngineer.filter((eng) => {
    return (
      (filters.tenancy
        ? eng.tenancy?.toLowerCase() === filters.tenancy.toLowerCase()
        : true) &&
      (filters.role
        ? eng.role?.toLowerCase() === filters.role.toLowerCase()
        : true) &&
      (filters.location
        ? eng.location?.toLowerCase().includes(filters.location.toLowerCase())
        : true) &&
      (filters.level
        ? eng.level?.toLowerCase() === filters.level.toLowerCase()
        : true) &&
      (filters.skills
        ? eng.skills?.some(
            (s: string) => s.toLowerCase() === filters.skills.toLowerCase()
          )
        : true)
    );
  });

  const handleSubmit = async (data: AddGroup) => {
    const payload = { data, selectedIds };

    if (!selectedIds.length) {
      toast.error("Please select at least one engineer.");
      return;
    }

    showPopup({
      title: "Create Group",
      body: "Are you sure you want to create this group?",
      actionButtons: [
        { label: "Cancel", value: null, variant: "outline" },
        {
          label: "Yes",
          value: "yes",
          variant: "primary",
          action: async (close) => {
            console.log("Group data submitted:", payload);
            toast.success("Group created successfully!");
            methods.reset();
            setSelectedIds([]);
            navigate(absoluteUrls.admin.home.manage_groups);
            close(true);
          },
        },
      ],
    });
  };

  return (
    <div className="w-full h-full flex flex-col p-3">
      <div className="flex justify-between mb-2 items-center">
        <h1 className="font-semibold text-xl">Add Group</h1>
        <Button variant="solid" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="p-3 h-full w-full flex flex-1 overflow-y-auto flex-col bg-neutral-100 dark:bg-gray-700 rounded-md gap-2">
        <FormContainer
          methods={methods}
          className="flex flex-col gap-2"
          onSubmit={handleSubmit}
        >
          {/* Group Name & Description */}
          <div className="grid md:flex gap-4">
            <InputField
              name="groupName"
              label="Group Name"
              required
              placeholder="Enter Group Name"
              rules={{ validate: (v: string) => validateGroupName(v) }}
            />
            <InputField
              name="groupDescription"
              label="Group Description"
              placeholder="Enter Group Description"
              rules={{
                maxLength: {
                  value: 200,
                  message: "Description must be at most 200 characters",
                },
              }}
            />
          </div>

          {/* Filters with Create Group button in same row */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-2 mb-2 items-end">
            {/* Tenancy dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Tenancy</label>
              <select
                value={filters.tenancy}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, tenancy: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Tenancy</option>
                {tenancyOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Role dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Role</label>
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Role</option>
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Location input */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Enter location"
                className="w-full border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Level dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Level</label>
              <select
                value={filters.level}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, level: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Level</option>
                {levelOptions.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Skills</label>
              <select
                value={filters.skills}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, skills: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md p-2 bg-white dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Skill</option>
                {skillsOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Create Group button */}
            <div className="flex flex-col justify-end">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r bg-teal-900 text-white"
              >
                Create Group
              </Button>
            </div>
          </div>

          {/* Selected count */}
          <div className="text-sm text-neutral-500 mb-1">
            {selectedIds.length} engineer(s) selected
          </div>

          {/* Engineers Table */}
          <div className="flex-1 overflow-y-auto">
            <CustomTable<SelectEngineerProps>
              columns={columns}
              data={filteredEngineers}
              initialPageSize={10}
            />
          </div>
        </FormContainer>
      </div>

      {/* Popup for Viewing Documents */}
      <Popup open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-bold">View File {selectedRowId}</span>
            <div
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              <IoCloseSharp />
            </div>
          </div>
          <div className="border border-gray-400 h-36 my-6 flex items-center justify-center">
            <img src="https://via.placeholder.com/500" alt="file" />
          </div>
        </div>
      </Popup>
    </div>
  );
}

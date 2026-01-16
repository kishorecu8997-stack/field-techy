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
import FilterField from "./FilterField";
/**
 * AddGroup
 *
 * Page component for creating a new engineer group in the admin panel.
 * Allows the user to enter group name/description and select engineers to add to the group.
 * Utilizes a form with validation and a table for selecting engineers.
 * @component
 * @returns {JSX.Element} The add group form page with engineer selection
 */

const tenancyOptions = ["Client A", "Client B", "Client C"];
const roleOptions = [
  "Software Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Frontend Engineer",
];
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

  const [filters, setFilters] = useState({
    tenancy: "",
    role: "",
    location: "",
    level: "",
    skills: "",
  });

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
          aria-label={`Select ${row.details.name}`}
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
              className="w-fit p-4 bg-teal-900 text-white"
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

  // Always include selected engineers even if they don't match filters
  const getFilteredEngineers = () => {
    const filtered = SelectEngineer.filter((eng) => {
      return (
        (filters.tenancy
          ? eng.tenancy.toLowerCase() === filters.tenancy.toLowerCase()
          : true) &&
        (filters.role
          ? eng.role.toLowerCase() === filters.role.toLowerCase()
          : true) &&
        (filters.location
          ? eng.location.toLowerCase().includes(filters.location.toLowerCase())
          : true) &&
        (filters.level
          ? eng.level.toLowerCase() === filters.level.toLowerCase()
          : true) &&
        (filters.skills
          ? eng.skills.some(
              (s) => s.toLowerCase() === filters.skills.toLowerCase(),
            )
          : true)
      );
    });

    // Include selected engineers that might have been filtered out
    const selectedEngineers = SelectEngineer.filter(
      (eng) => selectedIds.includes(eng.engineerID) && !filtered.includes(eng),
    );

    return [...selectedEngineers, ...filtered];
  };

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
            setFilters({
              tenancy: "",
              role: "",
              location: "",
              level: "",
              skills: "",
            });
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

          {/* Filters + Create Group */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-2 mb-2 items-end">
            <FilterField
              id="filter-tenancy"
              label="Tenancy"
              type="select"
              value={filters.tenancy}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, tenancy: value }))
              }
              placeholder="Select Tenancy"
              ariaLabel="Filter by Tenancy"
              options={tenancyOptions.map((t) => ({
                label: t,
                value: t,
              }))}
            />

            <FilterField
              id="filter-role"
              label="Role"
              type="select"
              value={filters.role}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, role: value }))
              }
              placeholder="Select Role"
              ariaLabel="Filter by Role"
              options={roleOptions.map((r) => ({
                label: r,
                value: r,
              }))}
            />

            <FilterField
              id="filter-location"
              label="Location"
              type="input"
              value={filters.location}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, location: value }))
              }
              placeholder="Enter location"
              ariaLabel="Filter by Location"
            />

            <FilterField
              id="filter-level"
              label="Level"
              type="select"
              value={filters.level}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, level: value }))
              }
              placeholder="Select Level"
              ariaLabel="Filter by Level"
              options={levelOptions.map((l) => ({
                label: l,
                value: l,
              }))}
            />

            <FilterField
              id="filter-skills"
              label="Skills"
              type="select"
              value={filters.skills}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, skills: value }))
              }
              placeholder="Select Skill"
              ariaLabel="Filter by Skills"
              options={skillsOptions.map((s) => ({
                label: s,
                value: s,
              }))}
            />
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
              data={getFilteredEngineers()}
              initialPageSize={10}
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              className="mr-0 w-fit bg-gradient-to-r bg-teal-900 text-white"
            >
              Save
            </Button>
          </div>
        </FormContainer>
      </div>

      {/* Popup for Documents */}
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

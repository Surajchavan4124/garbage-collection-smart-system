import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";

import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import AddEmployeeModal from "../components/AddEmployeeModal";
import ViewEmployeeModal from "../components/ViewEmployeeModal";
import EditEmployeeModal from "../components/EditEmployeeModal";
import DeactivateEmployeeModal from "../components/DeactivateEmployeeModal";
import ActivateEmployeeModal from "../components/ActivateEmployeeModal";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showActivate, setShowActivate] = useState(false);

  /* ================= LOAD EMPLOYEES ================= */
  const loadEmployees = async () => {
    try {
      setLoading(true);

      const res = await api.get("/employees");


      if (!Array.isArray(res.data)) {
        console.error("Employees API did not return array");
        setEmployees([]);
        return;
      }

      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
      emp.employeeCode?.toLowerCase().includes(searchEmployee.toLowerCase())
  );

  /* ================= ACTIONS ================= */

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleEditEmployee = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleEditFromTable = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const openDeactivateModal = async (employeeId) => {
    try {
      const { data } = await api.get(`/employees/${employeeId}`);
      setSelectedEmployee(data);
      setShowDeactivate(true);
    } catch {
      toast.error("Failed to load employee details");
    }
  };

  const handleConfirmDeactivate = async (employeeId) => {
    try {
      await api.put(`/employees/${employeeId}/deactivate`);
      toast.success("Employee deactivated");
      setShowDeactivate(false);
      loadEmployees();
    } catch {
      toast.error("Failed to deactivate employee");
    }
  };

  const handleActivateEmployee = async (employee) => {
    setSelectedEmployee(employee);
    setShowActivate(true);
  };

  const handleConfirmActivate = async (employeeId) => {
    try {
      await api.put(`/employees/${employeeId}/activate`);
      toast.success("Employee activated");
      setShowActivate(false);
      loadEmployees();
    } catch {
      toast.error("Failed to activate employee");
    }
  };

  const handleDeactivateFromView = () => {
    setIsViewModalOpen(false);
    setShowDeactivate(true);
  };

  /* ================= UI ================= */
  return (
    <div className="flex bg-[#e5e9f0] min-h-screen">
      <Sidebar />

      <div className="ml-64 w-full">
        <TopHeader />

        <div className="pt-20 px-8 pb-8">
          <p className="text-sm text-gray-600 mb-6 font-medium">
            Main &gt; Operational Management Dashboard &gt; Employee Management
          </p>

          <h2 className="text-lg font-bold uppercase mb-6">Employee List</h2>

          {/* SEARCH + ADD */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-4 py-3 border">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search Employee"
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-[#1f9e9a] text-white rounded-lg font-semibold"
            >
              <Plus size={18} />
              Add Employee
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1f9e9a] text-white">
                  <th className="px-6 py-3 text-left">Code</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Ward</th>
                  <th className="px-6 py-3 text-left">Contact</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-6 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-6 text-center">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp._id} className="border-b">
                      <td className="px-6 py-4">{emp.employeeCode}</td>
                      <td className="px-6 py-4">{emp.name}</td>
                      <td className="px-6 py-4">{emp.role}</td>
                      <td className="px-6 py-4">
                        {emp.wards && emp.wards.length > 0 ? emp.wards.join(", ") : emp.ward}
                      </td>
                      <td className="px-6 py-4">{emp.phone}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewEmployee(emp)}
                            className="px-3 py-1 border border-blue-500 text-blue-500 rounded text-xs"
                          >
                            view
                          </button>
                          <button
                            onClick={() => handleEditFromTable(emp)}
                            className="px-3 py-1 border border-orange-500 text-orange-500 rounded text-xs"
                          >
                            edit
                          </button>
                          {emp.status === "active" ? (
                            <button
                              onClick={() => openDeactivateModal(emp._id)}
                              className="px-3 py-1 border border-red-500 text-red-500 rounded text-xs"
                            >
                              deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateEmployee(emp)}
                              className="px-3 py-1 border border-green-500 text-green-500 rounded text-xs"
                            >
                              activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadEmployees}
      />

      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={selectedEmployee}
        onEdit={handleEditEmployee}
        onDeactivate={handleDeactivateFromView}
        onActivate={() => handleActivateEmployee(selectedEmployee)}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={selectedEmployee}
        onSuccess={loadEmployees}
      />

      <DeactivateEmployeeModal
        isOpen={showDeactivate}
        onClose={() => setShowDeactivate(false)}
        employee={selectedEmployee}
        onConfirm={handleConfirmDeactivate}
      />

      <ActivateEmployeeModal
        isOpen={showActivate}
        onClose={() => setShowActivate(false)}
        employee={selectedEmployee}
        onConfirm={handleConfirmActivate}
      />
    </div>
  );
}

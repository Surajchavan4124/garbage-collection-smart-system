import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import AddEmployeeModal from '../components/AddEmployeeModal'
import ViewEmployeeModal from '../components/ViewEmployeeModal'
import EditEmployeeModal from '../components/EditEmployeeModal'
import DeactivateEmployeeModal from '../components/DeactivateEmployeeModal'

export default function EmployeeManagement() {
  const [searchEmployee, setSearchEmployee] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const [assignRoleData, setAssignRoleData] = useState({
    employeeName: '',
    role: 'Driver',
    ward: '',
  })
  const [updateContactData, setUpdateContactData] = useState({
    employeeName: '',
    contactNumber: '',
  })

  const employees = [
    {
      id: 'E01',
      name: 'A. Sharma',
      role: 'Driver',
      area: 'Ward 1',
      contact: 'xxxxxxxxxx',
      status: 'Active',
      address: 'H. no 123, Behind navelim panchayat, Navelim Goa',
      joiningDate: '13 November 2024',
      ward: 'Ward 1',
      idProof: 'id.pdf',
      license: 'license.pdf',
    },
    {
      id: 'E02',
      name: 'S. Kumar',
      role: 'Collector',
      area: 'Ward 5',
      contact: 'xxxxxxxxxx',
      status: 'Active',
      address: '456 Main Street, Goa',
      joiningDate: '15 October 2024',
      ward: 'Ward 5',
      idProof: 'id.pdf',
      license: null,
    },
    {
      id: 'E03',
      name: 'R. Singh',
      role: 'Supervisor',
      area: 'Ward 3',
      contact: 'xxxxxxxxxx',
      status: 'Active',
      address: '789 Park Lane, Goa',
      joiningDate: '20 September 2024',
      ward: 'Ward 3',
      idProof: 'id.pdf',
      license: null,
    },
    {
      id: 'E04',
      name: 'H. Bheem',
      role: 'Sanitation Worker',
      area: 'Ward 2',
      contact: 'xxxxxxxxxx',
      status: 'Active',
      address: '321 Oak Avenue, Goa',
      joiningDate: '10 August 2024',
      ward: 'Ward 2',
      idProof: 'id.pdf',
      license: null,
    },
    {
      id: 'E05',
      name: 'M. Mukesh',
      role: 'Collector',
      area: 'Ward 6',
      contact: 'xxxxxxxxxx',
      status: 'Active',
      address: '654 Elm Street, Goa',
      joiningDate: '05 July 2024',
      ward: 'Ward 6',
      idProof: 'id.pdf',
      license: null,
    },
    {
      id: 'E06',
      name: 'T. Taari',
      role: 'Collector',
      area: 'Ward 4',
      contact: 'xxxxxxxxxx',
      status: 'Active',
      address: '987 Maple Drive, Goa',
      joiningDate: '12 June 2024',
      ward: 'Ward 4',
      idProof: 'id.pdf',
      license: null,
    },
    {
      id: 'E07',
      name: 'D. Dosta',
      role: 'Driver',
      area: 'Ward 8',
      contact: 'xxxxxxxxxx',
      status: 'Active',
      address: '111 Cedar Road, Goa',
      joiningDate: '25 May 2024',
      ward: 'Ward 8',
      idProof: 'id.pdf',
      license: 'license.pdf',
    },
    {
      id: 'E08',
      name: 'S. Nath',
      role: 'Sanitation Worker',
      area: 'Ward 7',
      contact: 'xxxxxxxxxx',
      status: 'Active',
      address: '222 Birch Street, Goa',
      joiningDate: '30 April 2024',
      ward: 'Ward 7',
      idProof: 'id.pdf',
      license: null,
    },
    {
      id: 'E09',
      name: 'N. Khan',
      role: 'Sanitation Worker',
      area: 'Ward 9',
      contact: 'xxxxxxxxxx',
      status: 'Active',
      address: '333 Pine Lane, Goa',
      joiningDate: '08 March 2024',
      ward: 'Ward 9',
      idProof: 'id.pdf',
      license: null,
    },
    {
      id: 'E10',
      name: 'P. Khan',
      role: 'Sanitation Worker',
      area: 'Ward 1',
      contact: 'xxxxxxxxxx',
      status: 'Active',
      address: '444 Spruce Avenue, Goa',
      joiningDate: '15 February 2024',
      ward: 'Ward 1',
      idProof: 'id.pdf',
      license: null,
    },
  ]

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchEmployee.toLowerCase())
  )

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee)
    setIsViewModalOpen(true)
  }

  const handleEditEmployee = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  const handleEditFromTable = (employee) => {
    setSelectedEmployee(employee)
    setIsEditModalOpen(true)
  }

  const handleDeactivateEmployee = () => {
    setIsViewModalOpen(false)
    setIsDeactivateModalOpen(true)
  }

  const handleDeleteFromTable = (employee) => {
    setSelectedEmployee(employee)
    setIsDeactivateModalOpen(true)
  }

  const handleConfirmDeactivate = () => {
    console.log('Employee deactivated:', selectedEmployee.id)
    // Handle deactivation logic here
  }

  const handleAssignRoleSubmit = (e) => {
    e.preventDefault()
    console.log('Assign Role:', assignRoleData)
    setAssignRoleData({ employeeName: '', role: 'Driver', ward: '' })
  }

  const handleUpdateContactSubmit = (e) => {
    e.preventDefault()
    console.log('Update Contact:', updateContactData)
    setUpdateContactData({ employeeName: '', contactNumber: '' })
  }

  return (
    <div className="flex bg-[#e5e9f0]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 w-full">
        {/* Top Header */}
        <TopHeader />

        {/* Content Area */}
        <div className="pt-20 px-8 pb-8">
          {/* Breadcrumb */}
          <p className="text-sm text-gray-600 mb-6 font-medium">Main {'>'} Operational Management Dashboard {'>'} Employee Management</p>

          {/* Employee List Section */}
          <div className="mb-12">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-6">Employee List</h2>

            {/* Search & Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-300">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Employee"
                  value={searchEmployee}
                  onChange={(e) => setSearchEmployee(e.target.value)}
                  className="flex-1 outline-none text-gray-700 text-sm"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Filter size={18} className="text-gray-600" />
                <span className="font-medium text-gray-700">Filter</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-[#1f9e9a] text-white rounded-lg hover:bg-[#198a87] transition font-semibold"
              >
                <Plus size={18} />
                <span>Add Employee</span>
              </button>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#1f9e9a] text-white">
                      <th className="px-6 py-3 text-left text-sm font-semibold">Employee ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Role/ Responsibility</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Assigned Area</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Contact</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, idx) => (
                      <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">{emp.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{emp.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{emp.role}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{emp.area}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{emp.contact}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewEmployee(emp)}
                              className="px-3 py-1 border-2 border-blue-500 text-blue-500 rounded font-semibold text-xs hover:bg-blue-50 transition"
                            >
                              view
                            </button>
                            <button
                              onClick={() => handleEditFromTable(emp)}
                              className="px-3 py-1 border-2 border-orange-500 text-orange-500 rounded font-semibold text-xs hover:bg-orange-50 transition"
                            >
                              edit
                            </button>
                            <button
                              onClick={() => handleDeleteFromTable(emp)}
                              className="px-3 py-1 border-2 border-red-500 text-red-500 rounded font-semibold text-xs hover:bg-red-50 transition"
                            >
                              delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Updates Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-6">Quick Updates</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Assign Roles Card */}
              <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-6">Assign Roles</h3>

                <form onSubmit={handleAssignRoleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employee Name</label>
                    <input
                      type="text"
                      placeholder="Search Employee Name"
                      value={assignRoleData.employeeName}
                      onChange={(e) => setAssignRoleData({ ...assignRoleData, employeeName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                    <select
                      value={assignRoleData.role}
                      onChange={(e) => setAssignRoleData({ ...assignRoleData, role: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm bg-white"
                    >
                      <option>Driver</option>
                      <option>Sanitation Worker</option>
                      <option>Collector</option>
                      <option>Supervisor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ward</label>
                    <input
                      type="text"
                      placeholder="Enter the ward"
                      value={assignRoleData.ward}
                      onChange={(e) => setAssignRoleData({ ...assignRoleData, ward: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm"
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1f9e9a] hover:bg-[#198a87] text-white font-bold py-2.5 rounded-lg transition"
                    >
                      Update Details & Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssignRoleData({ employeeName: '', role: 'Driver', ward: '' })}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              {/* Update Contact Number Card */}
              <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-6">Update Employee Contact Number</h3>

                <form onSubmit={handleUpdateContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employee Name</label>
                    <input
                      type="text"
                      placeholder="Search Employee Name"
                      value={updateContactData.employeeName}
                      onChange={(e) => setUpdateContactData({ ...updateContactData, employeeName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Update Number</label>
                    <input
                      type="text"
                      placeholder="Enter New Number"
                      value={updateContactData.contactNumber}
                      onChange={(e) => setUpdateContactData({ ...updateContactData, contactNumber: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm"
                    />
                  </div>

                  <div></div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-[#1f9e9a] hover:bg-[#198a87] text-white font-bold py-2.5 rounded-lg transition"
                    >
                      Update Details & Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpdateContactData({ employeeName: '', contactNumber: '' })}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* View Employee Modal */}
      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={selectedEmployee}
        onEdit={handleEditEmployee}
        onDeactivate={handleDeactivateEmployee}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={selectedEmployee}
      />

      {/* Deactivate Employee Modal */}
      <DeactivateEmployeeModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        employee={selectedEmployee}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  )
}

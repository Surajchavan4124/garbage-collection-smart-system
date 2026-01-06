import { useState } from 'react'
import { Search, Upload } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import ProfileSettingsModal from '../components/ProfileSettingsModal'
import ViewProfileModal from '../components/ViewProfileModal'
import EditProfileModal from '../components/EditProfileModal'
import DeactivateUserModal from '../components/DeactivateUserModal'

export default function UserManagementSettings() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([
    { id: 'U01', name: 'A. Singh', role: 'Admin (you)', email: 'a@gmail.com', contact: 'xxxxxxxxxx', status: 'Active' },
    { id: 'U02', name: 'S. Kumar', role: 'Manager', email: 's@gmail.com', contact: 'xxxxxxxxxx', status: 'Active' },
    { id: 'U03', name: 'R. Singh', role: 'Staff', email: 'r@gmail.com', contact: 'xxxxxxxxxx', status: 'Active' },
    { id: 'U04', name: 'P. Singh', role: 'Supervisor', email: 'p@gmail.com', contact: 'xxxxxxxxxx', status: 'Inactive' }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [viewUser, setViewUser] = useState(null)
    const [editUser, setEditUser] = useState(null)
    const [deleteUser, setDeleteUser] = useState(null)
    
    // Add handler function
    const handleViewUser = (user) => {
        setViewUser(user)
    }
    const handleEditUser = (user) => {
        setEditUser(user)
    }
    const handleDeleteUser = (user) => {
  setDeleteUser(user)
}

  const [newUser, setNewUser] = useState({
    fullName: '',
    contact: '',
    email: '',
    photo: null,
    role: 'select role',
    status: true,
    permissions: [],
    password: '',
    confirmPassword: ''
  })

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = (e) => {
    e.preventDefault()
    if (!newUser.fullName || !newUser.email || !newUser.contact) {
      alert('Please fill all required fields')
      return
    }
    if (newUser.role === 'select role') {
      alert('Please select a role')
      return
    }
    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    const user = {
      id: `U0${users.length + 1}`,
      name: newUser.fullName,
      role: newUser.role,
      email: newUser.email,
      contact: newUser.contact,
      status: newUser.status ? 'Active' : 'Inactive'
    }

    setUsers([...users, user])
    setNewUser({
      fullName: '',
      contact: '',
      email: '',
      photo: null,
      role: 'select role',
      status: true,
      permissions: [],
      password: '',
      confirmPassword: ''
    })
    alert('User added successfully!')
  }

  

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <TopHeader onProfileSettingsClick={() => setIsProfileModalOpen(true)} />
        
        <div className="mt-16 flex-1 overflow-y-auto p-6 bg-gray-100">
          
          <div className="mb-6 text-sm text-gray-600">
            <span>Analytics & Settings</span> &gt; <span className="font-semibold text-gray-800">User Management & Settings</span>
          </div>

          {/* 3 SECTION LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* SECTION 1: USER PROFILE */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="bg-gray-200 px-4 py-3 rounded mb-6">
                <h3 className="text-sm font-bold text-gray-800">USER PROFILE</h3>
              </div>

              <div className="space-y-4 text-center">
                <h4 className="text-sm font-bold text-gray-800">Your Profile</h4>
                <p className="text-xs text-gray-700">You are logged in as:</p>

                <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto flex items-center justify-center border-4 border-gray-400">
                  <span className="text-6xl">👤</span>
                </div>

                <div>
                  <h5 className="text-lg font-bold text-gray-800">Aakash Singh</h5>
                  <p className="text-xs text-gray-700">Admin</p>
                </div>

                <button
                  onClick={() => navigate('/profile-settings')}
                  className="w-full px-4 py-3 bg-teal-600 text-white rounded font-semibold text-xs hover:bg-teal-700 transition"
                >
                  Go To Your Profile Settings
                </button>
              </div>
            </div>

            {/* SECTION 2: ADD NEW USER */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="bg-gray-200 px-4 py-3 rounded mb-6">
                <h3 className="text-sm font-bold text-gray-800">ADD NEW USER</h3>
              </div>

              <form className="space-y-4" onSubmit={handleAddUser}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Full Name:</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Upload Photo:</label>
                    <button type="button" className="px-3 py-2 bg-gray-100 border border-gray-300 rounded text-xs flex items-center gap-1 hover:bg-gray-200 w-full justify-center">
                      📷 jpg/png
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Contact Number:</label>
                    <input
                      type="text"
                      placeholder="Enter contact"
                      value={newUser.contact}
                      onChange={(e) => setNewUser({...newUser, contact: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Email:</label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Role:</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    >
                      <option value="select role">select role</option>
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Staff</option>
                      <option>Supervisor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Status:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`relative w-12 h-6 rounded-full transition ${newUser.status ? 'bg-teal-500' : 'bg-gray-300'}`}>
                        <button
                          type="button"
                          onClick={() => setNewUser({...newUser, status: !newUser.status})}
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${newUser.status ? 'translate-x-6' : ''}`}
                        />
                      </div>
                      <span className="text-xs text-gray-700">{newUser.status ? 'active' : 'inactive'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">Permission:</label>
                  <div className="flex gap-4">
                    {['View', 'Edit', 'Delete'].map(perm => (
                      <label key={perm} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newUser.permissions.includes(perm)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewUser({...newUser, permissions: [...newUser.permissions, perm]})
                            } else {
                              setNewUser({...newUser, permissions: newUser.permissions.filter(p => p !== perm)})
                            }
                          }}
                          className="w-3 h-3 accent-teal-500"
                        />
                        <span className="text-xs text-gray-700">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Set Password:</label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Re-enter Password:</label>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded font-semibold text-xs hover:bg-teal-700 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUser({ fullName: '', contact: '', email: '', photo: null, role: 'select role', status: true, permissions: [], password: '', confirmPassword: '' })}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded font-semibold text-xs hover:bg-red-700 transition"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* SECTION 3: USER MANAGEMENT TABLE */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-gray-200 px-6 py-3">
              <h3 className="text-sm font-bold text-gray-800">USER MANAGEMENT</h3>
            </div>

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search User"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border-0 focus:outline-none text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-teal-500 text-white">
                    <th className="px-6 py-3 text-left text-xs font-bold">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{user.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{user.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{user.contact}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button 
                                  onClick={() => handleViewUser(user)}
                                  className="px-3 py-1 text-blue-600 border border-blue-600 rounded text-xs font-semibold hover:bg-blue-50 transition"
                              >
                                  view
                              </button>
                        <button 
  onClick={() => handleEditUser(user)}
  className="px-3 py-1 text-orange-600 border border-orange-600 rounded text-xs font-semibold hover:bg-orange-50 transition"
>
  edit
</button>
                        <button 
  onClick={() => handleDeleteUser(user)}
  className="px-3 py-1 text-red-600 border border-red-600 rounded text-xs font-semibold hover:bg-red-50 transition"
>
  Delete
</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <ViewProfileModal 
  isOpen={!!viewUser}
  onClose={() => setViewUser(null)}
  user={viewUser}
   onEdit={handleEditUser}
    onDelete={handleDeleteUser}
/>
<EditProfileModal
  isOpen={!!editUser}
  onClose={() => setEditUser(null)}
  user={editUser}
  onSave={(updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
  }}
/>
<DeactivateUserModal
  isOpen={!!deleteUser}
  onClose={() => setDeleteUser(null)}
  user={deleteUser}
  onDeactivate={(user) => {
    setUsers(users.filter(u => u.id !== user.id))
    alert('User deactivated successfully')
  }}
/>
    </div>
  )
}
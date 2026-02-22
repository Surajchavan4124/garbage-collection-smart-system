import { useState, useEffect } from 'react'
import { Search, Upload, User as UserIcon, Settings } from 'lucide-react'
import api from '../api/axios'
import { toast } from 'react-toastify'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import ProfileSettingsModal from '../components/ProfileSettingsModal'
import ViewProfileModal from '../components/ViewProfileModal'
import EditProfileModal from '../components/EditProfileModal'
import DeactivateUserModal from '../components/DeactivateUserModal'

export default function UserManagementSettings() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [errors, setErrors] = useState({})

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
  })

  const validateField = (name, value) => {
    let error = ""
    switch (name) {
      case 'fullName':
        if (!value.trim()) error = "Name is required"
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) error = "Email is required"
        else if (!emailRegex.test(value)) error = "Invalid email format"
        break
      case 'contact':
        const mobileRegex = /^\d{10}$/
        if (!value.trim()) error = "Contact is required"
        else if (!mobileRegex.test(value)) error = "Must be 10 digits"
        break
      case 'role':
        if (value === 'select role') error = "Please select a role"
        break
      default:
        break
    }
    setErrors(prev => ({ ...prev, [name]: error }))
    return error
  }

  useEffect(() => {
    fetchUsers()
    fetchProfile()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch (err) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile')
      setProfile(res.data)
    } catch (err) {
      console.error('Failed to fetch profile', err)
    }
  }

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u._id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = async (e) => {
    e.preventDefault()
    
    const e1 = validateField('fullName', newUser.fullName)
    const e2 = validateField('email', newUser.email)
    const e3 = validateField('contact', newUser.contact)
    const e4 = validateField('role', newUser.role)

    if (e1 || e2 || e3 || e4) {
      toast.error('Please fix the errors in the form')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', newUser.fullName)
      formData.append('mobile', newUser.contact)
      formData.append('email', newUser.email)
      formData.append('role', newUser.role.toUpperCase())
      formData.append('isActive', newUser.status)
      if (newUser.photo) {
        formData.append('photo', newUser.photo)
      }
      
      // Permissions as JSON string because backend expects Array or parses it
      newUser.permissions.forEach(p => formData.append('permissions[]', p))

      const res = await api.post('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUsers([...users, res.data])
      setNewUser({
        fullName: '',
        contact: '',
        email: '',
        photo: null,
        role: 'select role',
        status: true,
        permissions: [],
      })
      setErrors({})
      toast.success('User added successfully!')
    } catch (err) {
      if (err.response?.data?.message === "User already exists") {
        setErrors(prev => ({ ...prev, contact: "User already exists" }))
      }
      toast.error(err.response?.data?.message || 'Failed to add user')
    }
  }

  

  return (
    <div className="flex bg-mesh min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <TopHeader onProfileSettingsClick={() => setIsProfileModalOpen(true)} />
        <div className="pt-20 flex-1 overflow-y-auto px-6 pb-10 animate-fade-in-up">
          
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

                <div className="w-40 h-40 bg-teal-50 rounded-full mx-auto flex items-center justify-center border-4 border-teal-100 relative overflow-hidden">
                  {profile?.profilePhoto ? (
                    <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={80} className="text-teal-600" />
                  )}
                </div>

                <div>
                  <h5 className="text-lg font-bold text-gray-800">{profile?.name || 'Loading...'}</h5>
                  <p className="text-xs text-gray-500 font-medium">Administrator</p>
                </div>

                <button
                  onClick={() => navigate('/profile-settings')}
                  className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-bold text-xs hover:bg-teal-700 transition shadow-md shadow-teal-100 flex items-center justify-center gap-2"
                >
                  <Settings size={16} />
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
                      onChange={(e) => {
                        setNewUser({...newUser, fullName: e.target.value})
                        validateField('fullName', e.target.value)
                      }}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1">Upload Photo:</label>
                    <div 
                      onClick={() => document.getElementById('user-photo-upload').click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition min-h-[50px]"
                    >
                      {newUser.photo ? (
                        <div className="flex items-center gap-2">
                           <img src={URL.createObjectURL(newUser.photo)} alt="preview" className="w-8 h-8 rounded-full object-cover" />
                           <span className="text-[10px] text-gray-500 overflow-hidden text-ellipsis max-w-[80px]">{newUser.photo.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload size={16} className="text-gray-400 mb-1" />
                          <span className="text-[10px] text-gray-500">jpg/png</span>
                        </>
                      )}
                    </div>
                    <input 
                      id="user-photo-upload"
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          setNewUser({...newUser, photo: file})
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Contact Number:</label>
                    <input
                      type="text"
                      placeholder="Enter contact"
                      value={newUser.contact}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setNewUser({...newUser, contact: val})
                        validateField('contact', val)
                      }}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs ${errors.contact ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors.contact && <p className="text-[10px] text-red-500 mt-1">{errors.contact}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Email:</label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={newUser.email}
                      onChange={(e) => {
                        setNewUser({...newUser, email: e.target.value})
                        validateField('email', e.target.value)
                      }}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2">Role:</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => {
                        setNewUser({...newUser, role: e.target.value})
                        validateField('role', e.target.value)
                      }}
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs ${errors.role ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    >
                      <option value="select role">select role</option>
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Staff</option>
                      <option>Supervisor</option>
                      <option>Employee</option>
                    </select>
                    {errors.role && <p className="text-[10px] text-red-500 mt-1">{errors.role}</p>}
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


                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded font-semibold text-xs hover:bg-teal-700 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUser({ fullName: '', contact: '', email: '', photo: null, role: 'select role', status: true, permissions: [] })}
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
                      <th className="px-6 py-3 text-left text-xs font-bold">Photo</th>
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
                    <tr key={user._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        <img 
                          src={user.profilePhoto || 'https://via.placeholder.com/40'} 
                          alt="user" 
                          className="w-10 h-10 rounded-full object-cover border"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{user._id?.slice(-6).toUpperCase() || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 lowercase first-letter:uppercase">{user.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{user.mobile}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        {user.isMainAccount ? (
                          <span className="text-gray-400 text-xs italic">System Admin</span>
                        ) : (
                          <>
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
                          </>
                        )}
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
  onSave={async (updatedData) => {
    try {
      const formData = new FormData()
      formData.append('name', updatedData.name)
      formData.append('mobile', updatedData.mobile)
      formData.append('email', updatedData.email)
      formData.append('role', updatedData.role)
      formData.append('isActive', updatedData.isActive)
      
      if (updatedData.photo instanceof File) {
        formData.append('photo', updatedData.photo)
      }

      // Permissions
      if (updatedData.permissions) {
        updatedData.permissions.forEach(p => formData.append('permissions[]', p))
      }

      const res = await api.put(`/users/${updatedData._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      setUsers(users.map(u => u._id === res.data._id ? res.data : u))
      setEditUser(null)
      toast.success('User updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user')
    }
  }}
/>
<DeactivateUserModal
  isOpen={!!deleteUser}
  onClose={() => setDeleteUser(null)}
  user={deleteUser}
  onDeactivate={async (user) => {
    try {
      await api.delete(`/users/${user._id}`)
      setUsers(users.filter(u => u._id !== user._id))
      setDeleteUser(null)
      toast.success('User deleted successfully')
    } catch (err) {
      toast.error('Failed to delete user')
    }
  }}
/>
    </div>
  )
}
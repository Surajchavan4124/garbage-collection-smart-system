import { useEffect } from 'react'
import { X, User, Edit, ShieldCheck } from 'lucide-react'

export default function ViewProfileModal({ isOpen, onClose, user, onEdit, onDelete }) {
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen]);

  if (!isOpen) return null

  const isActive = user?.isActive

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-start justify-center z-50 p-4 pt-10">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-100 animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1f9e9a, #16847f)' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center font-black text-lg text-white">
                {user?.name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-medium uppercase tracking-wider">User Profile</p>
                <h2 className="text-white font-bold">{user?.name || 'N/A'}</h2>
                <p className="text-white/70 text-xs">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <button onClick={onClose} className="p-1.5 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors ml-1">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Profile info */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">User Information</p>
                {[
                  { label: 'Name', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Contact', value: user?.mobile },
                  { label: 'Role', value: user?.role },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value || '—'}</p>
                  </div>
                ))}
              </div>

              {/* Permissions */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={16} className="text-teal-500" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Permissions</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {user?.permissions?.length > 0
                    ? user.permissions.map(perm => (
                      <span key={perm} className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full border border-teal-100">
                        {perm}
                      </span>
                    ))
                    : <p className="text-sm text-gray-400">No permissions set</p>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex gap-3 flex-shrink-0 justify-end">
            <button onClick={() => onDelete(user)}
              className="px-4 py-2.5 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">
              Delete Profile
            </button>
            <button onClick={() => onEdit(user)}
              className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #1f9e9a, #16847f)' }}>
              <Edit size={14} /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

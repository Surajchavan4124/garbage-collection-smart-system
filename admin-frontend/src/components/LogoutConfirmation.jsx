export default function LogoutConfirmation({ 
  isOpen, 
  onClose, 
  onLogout, 
  userName = "Admin Singh" 
}) {
  if (!isOpen) return null

  const handleLogout = () => {
    // Clear localStorage/sessionStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.clear()
    
    // Call logout callback
    if (onLogout) onLogout()
    
    // Redirect to login
    window.location.href = '/login'
  }

  const handleStayLoggedIn = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-300 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-bold text-center">Log Out</h2>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">👋</span>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            LOG OUT
          </h3>
          
          <p className="text-sm text-gray-700 mb-8 leading-relaxed">
            Are you sure you want to log out? You can log in anytime using your credentials.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition-all shadow-lg"
            >
              Log Out
            </button>
            
            <button
              onClick={handleStayLoggedIn}
              className="px-8 py-3 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-all shadow-lg"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

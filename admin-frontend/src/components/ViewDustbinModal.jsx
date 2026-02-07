import { X, Download } from 'lucide-react'

export default function ViewDustbinModal({ isOpen, onClose, dustbin, onEdit, onDelete }) {
  if (!isOpen || !dustbin) return null

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${dustbin.id}`

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Dustbin_QR_${dustbin.binCode || dustbin.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      alert('Failed to download QR code');
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">BIN DETAILS</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {/* Bin ID */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Bin ID:
              </label>
              <input
                type="text"
                value={dustbin.binCode || dustbin.id}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>

            {/* QR Code Image */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Bin QR Code:
                </label>
                <button 
                  onClick={handleDownloadQR}
                  className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 text-xs font-semibold rounded-md border border-teal-200 hover:bg-teal-100 hover:border-teal-300 transition-all shadow-sm"
                >
                  <Download size={14} /> Download QR
                </button>
              </div>
              <div className="flex justify-center p-4 bg-gray-50 border border-gray-300 rounded relative group">
                <img
                  src={qrCodeUrl}
                  alt={`QR Code for ${dustbin.id}`}
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Location:
              </label>
              <textarea
                value={`${dustbin.location} (GPS: ${dustbin.gps.lat}, ${dustbin.gps.lng})`}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm resize-none h-16"
              />
            </div>

            {/* Map View */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Map:
              </label>
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded border border-gray-300 flex items-center justify-center">
                <svg viewBox="0 0 300 250" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="0" y1="100" x2="300" y2="100" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="0" y1="150" x2="300" y2="150" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="0" y1="200" x2="300" y2="200" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="75" y1="0" x2="75" y2="250" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="150" y1="0" x2="150" y2="250" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="225" y1="0" x2="225" y2="250" stroke="#d1d5db" strokeWidth="1" />

                  {/* Block shapes */}
                  <rect x="5" y="5" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="80" y="5" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="155" y="5" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="230" y="5" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />

                  <rect x="5" y="55" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="80" y="55" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="155" y="55" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="230" y="55" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />

                  {/* Center pin */}
                  <circle cx="150" cy="125" r="8" fill="#333" stroke="white" strokeWidth="2" />
                  <path d="M 150 133 L 145 145 L 155 145 Z" fill="#333" />
                </svg>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Type:
              </label>
              <input
                type="text"
                value={dustbin.type}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Status:
              </label>
              <input
                type="text"
                value={dustbin.status}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={onEdit}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg text-sm font-semibold hover:bg-teal-600 transition"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Remove Bin
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

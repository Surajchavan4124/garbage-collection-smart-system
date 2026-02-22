import { X, Trash2 } from "lucide-react";

export default function WardDustbinsModal({ isOpen, onClose, wardName, dustbins }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl relative max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold uppercase text-gray-800">
            Dustbins in {wardName}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {dustbins.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Bin Code</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {dustbins.map((bin) => (
                    <tr key={bin._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{bin.binCode}</td>
                      <td className="px-4 py-3 text-gray-600">{bin.locationText}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bin.type === 'Organic' ? 'bg-green-100 text-green-700' :
                          bin.type === 'Recyclable' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {bin.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bin.status === 'Good' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {bin.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed">
              <Trash2 className="mx-auto text-gray-300 mb-2" size={40} />
              <p className="text-gray-500 font-medium">No dustbins alloted to this ward yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#1f9e9a] text-white rounded font-semibold text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

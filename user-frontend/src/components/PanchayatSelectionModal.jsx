import { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import api from '../api/axios';
import { MapPin, Check, Building2, Search } from 'lucide-react';

export default function PanchayatSelectionModal() {
  const { isPanchayatModalOpen, selectPanchayat, selectedPanchayat } = usePanchayat();
  const [panchayats, setPanchayats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isPanchayatModalOpen) {
      document.body.style.overflow = 'hidden';
      fetchPanchayats();
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to ensure scroll is restored
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPanchayatModalOpen]);

  const fetchPanchayats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/panchayat?status=active');
      setPanchayats(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch panchayats", err);
      setError("Failed to load panchayats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPanchayats = panchayats.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isPanchayatModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-green-600 px-6 py-5 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Select Your Panchayat
          </h2>
          <p className="text-green-100 text-sm mt-1">
            Choose your local panchayat to see relevant news, waste data, and services.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p>Loading Panchayats...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
              <button 
                onClick={fetchPanchayats}
                className="mt-2 text-sm text-green-600 font-semibold hover:underline"
              >
                Retry
              </button>
            </div>
          ) : filteredPanchayats.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No panchayats found matching "{searchTerm}"</p>
            </div>
          ) : (
            filteredPanchayats.map((panchayat) => (
              <button
                key={panchayat._id}
                onClick={() => selectPanchayat(panchayat)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative
                  ${selectedPanchayat?._id === panchayat._id 
                    ? 'border-green-500 bg-green-50 ring-1 ring-green-500' 
                    : 'border-gray-100 hover:border-green-200 hover:shadow-md bg-white'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-bold text-lg ${selectedPanchayat?._id === panchayat._id ? 'text-green-700' : 'text-gray-800'}`}>
                      {panchayat.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{panchayat.address}</span>
                    </div>
                  </div>
                  {selectedPanchayat?._id === panchayat._id && (
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
          Cannot find your panchayat? Contact system administrator.
        </div>
      </div>
    </div>
  );
}

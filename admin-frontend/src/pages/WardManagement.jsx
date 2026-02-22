import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { Plus, Edit2, Trash2, Eye, MapPin, Search, X } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";
import WardDustbinsModal from "../components/WardDustbinsModal";

export default function WardManagement() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [wardDustbins, setWardDustbins] = useState([]);
  
  // Form states
  const [wardName, setWardName] = useState("");

  useEffect(() => {
    loadWards();
  }, []);

  const loadWards = async () => {
    try {
      setLoading(true);
      const res = await api.get("/wards");
      setWards(res.data);
    } catch (err) {
      toast.error("Failed to load wards");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWard = async (e) => {
    e.preventDefault();
    if (!wardName.trim()) return toast.warning("Please enter ward name");
    
    try {
      await api.post("/wards", { name: wardName });
      toast.success("Ward added successfully");
      setWardName("");
      setIsAddModalOpen(false);
      loadWards();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add ward");
    }
  };

  const handleEditWard = async (e) => {
    e.preventDefault();
    if (!wardName.trim()) return toast.warning("Please enter ward name");

    try {
      await api.put(`/wards/${selectedWard._id}`, { name: wardName });
      toast.success("Ward updated successfully");
      setWardName("");
      setSelectedWard(null);
      setIsEditModalOpen(false);
      loadWards();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update ward");
    }
  };

  const handleDeleteWard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ward?")) return;
    
    try {
      await api.delete(`/wards/${id}`);
      toast.success("Ward deleted successfully");
      loadWards();
    } catch (err) {
      toast.error("Failed to delete ward");
    }
  };

  const openViewModal = async (ward) => {
    try {
      setSelectedWard(ward);
      const res = await api.get(`/wards/${ward._id}/dustbins`);
      setWardDustbins(res.data);
      setIsViewModalOpen(true);
    } catch (err) {
      toast.error("Failed to load dustbin info");
    }
  };

  const filteredWards = wards.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#e5e9f0] min-h-screen">
      <Sidebar />
      <div className="ml-64 w-full">
        <TopHeader />
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Main {'>'} Operational Management {'>'} Ward Management</p>
              <h1 className="text-2xl font-bold uppercase tracking-tight">Ward Management</h1>
            </div>
            <button 
              onClick={() => {
                setWardName("");
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 bg-[#1f9e9a] text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-[#18807d] transition-all"
            >
              <Plus size={20} /> Add Ward
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header / Search */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-800 uppercase text-sm tracking-wider">Ward List</h2>
              <div className="relative w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search ward..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f9e9a]/20"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#1f9e9a] text-white text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Sr No.</th>
                    <th className="px-6 py-4">Ward Name</th>
                    <th className="px-6 py-4">Dustbins Allotted</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-500">Loading wards...</td>
                    </tr>
                  ) : filteredWards.length > 0 ? (
                    filteredWards.map((w, idx) => (
                      <tr key={w._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-400">{String(idx + 1).padStart(2, '0')}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="bg-teal-50 p-1.5 rounded text-[#1f9e9a]">
                                <MapPin size={14} />
                             </div>
                             <span className="font-bold text-gray-700">{w.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{w.dustbinCount} Bins</span>
                            <button 
                              onClick={() => openViewModal(w)}
                              className="text-[#1f9e9a] hover:underline flex items-center gap-1 font-bold text-xs"
                            >
                              <Eye size={14} /> View
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2 font-bold uppercase tracking-tighter">
                            <button 
                              onClick={() => {
                                setSelectedWard(w);
                                setWardName(w.name);
                                setIsEditModalOpen(true);
                              }}
                              className="px-3 py-1 border border-orange-500 text-orange-500 rounded text-xs hover:bg-orange-50"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteWard(w._id)}
                              className="px-3 py-1 border border-red-500 text-red-500 rounded text-xs hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-500 font-medium">No wards found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleAddWard} className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase">Add New Ward</h2>
              <button type="button" onClick={() => setIsAddModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Ward Name</label>
              <input 
                type="text"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                placeholder="Ex. Ward 1"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1f9e9a]/20 outline-none"
                autoFocus
              />
            </div>
            <button className="w-full bg-[#1f9e9a] text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all">
               SAVE WARD
            </button>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleEditWard} className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold uppercase">Rename Ward</h2>
              <button type="button" onClick={() => setIsEditModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Ward Name</label>
              <input 
                type="text"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#1f9e9a]/20 outline-none"
                autoFocus
              />
            </div>
            <button className="w-full bg-[#1f9e9a] text-white py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all">
               UPDATE WARD
            </button>
          </form>
        </div>
      )}

      {/* View Dustbins Modal */}
      <WardDustbinsModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        wardName={selectedWard?.name}
        dustbins={wardDustbins}
      />
    </div>
  );
}

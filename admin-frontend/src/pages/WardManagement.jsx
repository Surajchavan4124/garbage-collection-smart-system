import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import { Plus, Edit2, Trash2, Eye, MapPin, Search, X, Layers } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";
import WardDustbinsModal from "../components/WardDustbinsModal";

export default function WardManagement() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [wardDustbins, setWardDustbins] = useState([]);
  const [wardName, setWardName] = useState("");

  useEffect(() => { loadWards(); }, []);

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

  const totalBins = wards.reduce((acc, w) => acc + (w.dustbinCount || 0), 0);

  return (
    <div className="flex bg-mesh min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <TopHeader />
        <div className="pt-20 px-8 pb-10 animate-fade-in-up">

          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Main › Operational Management › Ward Management</p>
              <h1 className="text-xl font-black text-gray-800">Ward Management</h1>
            </div>
            <button
              onClick={() => { setWardName(""); setIsAddModalOpen(true); }}
              className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-semibold text-sm shadow-lg btn-lift"
              style={{ background: 'linear-gradient(135deg, #1f9e9a, #16a34a)', boxShadow: '0 4px 16px rgba(31,158,154,0.3)' }}
            >
              <Plus size={17} /> Add Ward
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            {[
              { label: 'Total Wards', value: wards.length, icon: Layers, color: 'from-[#1f9e9a] to-[#16847f]' },
              { label: 'Total Dustbins', value: totalBins, icon: MapPin, color: 'from-emerald-500 to-emerald-700' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <Icon size={19} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-2xl font-black text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Table card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Ward List</h2>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 w-60 border border-transparent focus-within:border-teal-300/50">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ward…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none text-xs bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #1f9e9a, #16847f)' }}>
                    {['#', 'Ward Name', 'Dustbins', 'Actions'].map(h => (
                      <th key={h} className={`px-6 py-3.5 text-white text-[10px] font-bold uppercase tracking-wider ${h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-sm">Loading wards…</td></tr>
                  ) : filteredWards.length > 0 ? (
                    filteredWards.map((w, idx) => (
                      <tr key={w._id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-teal-50/30`}>
                        <td className="px-6 py-3.5">
                          <span className="text-xs font-bold text-gray-400">{String(idx + 1).padStart(2, '0')}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(31,158,154,0.1)' }}>
                              <MapPin size={14} className="text-teal-600" />
                            </div>
                            <span className="font-semibold text-gray-800">{w.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{w.dustbinCount} Bins</span>
                            <button
                              onClick={() => openViewModal(w)}
                              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 hover:underline"
                            >
                              <Eye size={12} /> View
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => { setSelectedWard(w); setWardName(w.name); setIsEditModalOpen(true); }}
                              className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteWard(w._id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 text-sm">No wards found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Ward Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={isEditModalOpen ? handleEditWard : handleAddWard}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-5 border-b flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #1f9e9a, #16a34a)' }}>
              <h2 className="text-white font-bold text-base">{isEditModalOpen ? 'Rename Ward' : 'Add New Ward'}</h2>
              <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>
                <X size={20} className="text-white/80 hover:text-white" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Ward Name</label>
              <input
                type="text"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                placeholder="e.g. Aquem"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100 transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="w-full mt-5 py-3 rounded-xl text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #1f9e9a, #16a34a)' }}
              >
                {isEditModalOpen ? 'Update Ward' : 'Save Ward'}
              </button>
            </div>
          </form>
        </div>
      )}

      <WardDustbinsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        wardName={selectedWard?.name}
        dustbins={wardDustbins}
      />
    </div>
  );
}

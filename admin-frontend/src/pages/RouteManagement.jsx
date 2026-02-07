import { useEffect, useState } from "react";
import { Search, Plus, MapPin, Truck, User } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import AddRouteModal from "../components/AddRouteModal";
import EditRouteModal from "../components/EditRouteModal";
import DeleteRouteModal from "../components/DeleteRouteModal";

export default function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/routes");
      setRoutes(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleEdit = (route) => {
    setSelectedRoute(route);
    setIsEditModalOpen(true);
  }

  const handleDeleteClick = (route) => {
    setRouteToDelete(route);
    setIsDeleteModalOpen(true);
  }

  const confirmDelete = async () => {
    if (!routeToDelete) return;
    
    try {
      setDeleteLoading(true);
      await api.delete(`/routes/${routeToDelete._id}`);
      toast.success("Route deleted successfully");
      setIsDeleteModalOpen(false);
      setRouteToDelete(null);
      loadRoutes();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete route");
    } finally {
      setDeleteLoading(false);
    }
  }

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRoute(null);
  }

  const filteredRoutes = routes.filter(r => 
    r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.routeCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#e5e9f0] min-h-screen">
      <Sidebar />
      <div className="ml-64 w-full">
        <TopHeader />
        <div className="pt-20 px-8 pb-8">
          <p className="text-sm text-gray-600 mb-6 font-medium">
            Main &gt; Operational Management &gt; Route Management
          </p>

          <h2 className="text-lg font-bold uppercase mb-6">Route Management</h2>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-4 py-3 border">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search Routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-sm"
              />
            </div>
            <button
              onClick={() => { setSelectedRoute(null); setIsAddModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-3 bg-[#1f9e9a] text-white rounded-lg font-semibold"
            >
              <Plus size={18} />
              Add Route
            </button>
          </div>

          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : filteredRoutes.length === 0 ? (
              <p>No routes found.</p>
            ) : (
              filteredRoutes.map((route) => (
                <div key={route._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{route.routeName}</h3>
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {route.routeCode}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      route.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {route.status}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                       <MapPin size={16} className="text-teal-500 min-w-4" />
                       <span className="truncate">
                         {route.stops && route.stops.length > 0 
                           ? `${route.stops[0].stopName} ➝ ${route.stops[route.stops.length - 1].stopName}`
                           : 'No stops defined'}
                       </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <User size={16} className="text-blue-500 min-w-4" />
                       <span className="truncate">Driver: {route.assignedDriver?.name || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Truck size={16} className="text-orange-500 min-w-4" />
                       <span>Vehicle: {route.assignedVehicle || "N/A"}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2 justify-end">
                    <button 
                      onClick={() => handleEdit(route)}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(route)}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <AddRouteModal 
        isOpen={isAddModalOpen} 
        onClose={handleModalClose} 
        onSuccess={loadRoutes}
      />

      <EditRouteModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSuccess={loadRoutes}
        route={selectedRoute}
      />

      <DeleteRouteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        route={routeToDelete}
        onConfirmDelete={confirmDelete}
        loading={deleteLoading}
      />

    </div>
  );
}

import { useState, useEffect } from "react";
import { X, MapPin, Truck, User } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function EditRouteModal({ isOpen, onClose, onSuccess, route }) {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);

  const [formData, setFormData] = useState({
    routeName: "",
    stops: [{ stopName: "" }, { stopName: "" }],
    assignedDriver: "",
    assignedVehicle: "",
  });

  // Load drivers
  useEffect(() => {
    if (isOpen) {
      api.get("/employees?role=driver").then((res) => {
        setDrivers(res.data.filter(e => e.role?.toLowerCase().includes('driver') || e.role?.toLowerCase().includes('labour'))); 
      }).catch(err => console.error("Failed to load drivers", err));
    }
  }, [isOpen]);

  // Pre-fill form data when route changes or modal opens
  useEffect(() => {
    if (isOpen && route) {
      setFormData({
        routeName: route.routeName || "",
        stops: route.stops && route.stops.length > 0 ? route.stops : [{ stopName: "" }, { stopName: "" }],
        assignedDriver: route.assignedDriver?._id || route.assignedDriver || "",
        assignedVehicle: route.assignedVehicle || "",
      });
    }
  }, [isOpen, route]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStopChange = (index, value) => {
    const newStops = [...formData.stops];
    newStops[index].stopName = value;
    setFormData(prev => ({ ...prev, stops: newStops }));
  }

  const addStop = () => {
    setFormData(prev => ({ ...prev, stops: [...prev.stops, { stopName: "" }] }));
  }

  const removeStop = (index) => {
    setFormData(prev => ({ ...prev, stops: prev.stops.filter((_, i) => i !== index) }));
  }

  const handleSubmit = async () => {
    if (!formData.routeName) {
      toast.error("Please enter route name");
      return;
    }
    const validStops = formData.stops.filter(s => s.stopName.trim() !== "");
    if (validStops.length < 2) {
      toast.error("Please add at least 2 stops");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/routes/${route._id}`, { ...formData, stops: validStops });
      toast.success("Route updated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update route");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1f9e9a, #16847f)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <MapPin size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-medium uppercase tracking-wider">Edit Record</p>
                <h2 className="text-white font-bold text-sm">Edit Route</h2>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors">
              <X size={16} />
            </button>
          </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Route Name *</label>
               <input
                 type="text"
                 name="routeName"
                 value={formData.routeName}
                 onChange={handleChange}
                 placeholder="e.g. Ward 1 Morning"
                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Route Code</label>
               <input
                 type="text"
                 value={route?.routeCode || "N/A"}
                 disabled
                 className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 text-sm"
               />
             </div>
          </div>

          {/* Dynamic Stops */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route Stops *</label>
            {formData.stops.map((stop, index) => (
              <div key={index} className="flex gap-2 mb-2">
                 <div className="relative flex-1">
                   <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                   <input
                     type="text"
                     value={stop.stopName}
                     onChange={(e) => handleStopChange(index, e.target.value)}
                     placeholder={`Stop ${index + 1}`}
                     className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                   />
                 </div>
                 {formData.stops.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeStop(index)}
                     className="p-2 text-red-500 hover:bg-red-50 rounded"
                   >
                     <X size={18} />
                   </button>
                 )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStop}
              className="text-sm text-teal-600 font-semibold hover:underline mt-1"
            >
              + Add Stop
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Assign Driver</label>
               <div className="relative">
                 <User className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                 <select
                   name="assignedDriver"
                   value={formData.assignedDriver}
                   onChange={handleChange}
                   className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none appearance-none bg-white text-sm"
                 >
                   <option value="">Select Driver</option>
                   {drivers.map(driver => (
                     <option key={driver._id} value={driver._id}>{driver.name} ({driver.employeeCode})</option>
                   ))}
                 </select>
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
               <div className="relative">
                 <Truck className="absolute left-3 top-2.5 text-gray-400" size={16}/>
                 <input
                   type="text"
                   name="assignedVehicle"
                   value={formData.assignedVehicle}
                   onChange={handleChange}
                   placeholder="e.g. GA-01-AB-1234"
                   className="w-full pl-9 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                 />
               </div>
            </div>
          </div>

        </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 pb-6 pt-4 border-t border-gray-50 flex-shrink-0">
            <button onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="px-6 py-2.5 text-white font-bold rounded-xl text-sm disabled:opacity-50 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1f9e9a, #16847f)' }}>
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating...</> : 'Update Route'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

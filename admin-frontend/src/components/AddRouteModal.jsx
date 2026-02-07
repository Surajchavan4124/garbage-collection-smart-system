import { useState, useEffect } from "react";
import { X, MapPin, Truck, User } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function AddRouteModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);

  const [formData, setFormData] = useState({
    routeName: "",
    stops: [{ stopName: "" }, { stopName: "" }], // Initial 2 stops
    assignedDriver: "",
    assignedVehicle: "",
  });

  // Load active employees... (same as before)
  useEffect(() => {
    if (isOpen) {
      api.get("/employees?role=driver").then((res) => {
        setDrivers(res.data.filter(e => e.role?.toLowerCase().includes('driver') || e.role?.toLowerCase().includes('labour'))); 
      }).catch(err => console.error("Failed to load drivers", err));
    }
  }, [isOpen]);

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
    // Filter empty stops
    const validStops = formData.stops.filter(s => s.stopName.trim() !== "");
    if (validStops.length < 2) {
      toast.error("Please add at least 2 stops");
      return;
    }

    try {
      setLoading(true);
      await api.post("/routes", { ...formData, stops: validStops });
      toast.success("Route created successfully");
      if (onSuccess) onSuccess();
      onClose();
      setFormData({
        routeName: "",
        stops: [{ stopName: "" }, { stopName: "" }],
        assignedDriver: "",
        assignedVehicle: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Add New Route</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
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
                 value="Auto Generated"
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
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-[#1f9e9a] text-white font-medium rounded-lg hover:bg-[#178582] transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Route"}
          </button>
        </div>
      </div>
    </div>
  );
}

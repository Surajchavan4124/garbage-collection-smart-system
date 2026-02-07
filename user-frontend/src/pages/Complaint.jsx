import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

const Complaint = () => {
  const [loading, setLoading] = useState(false);
  const [panchayats, setPanchayats] = useState([]);
  
  const [formData, setFormData] = useState({
    panchayatId: "",
    reporterName: "",
    reporterMobile: "",
    type: "Missed Bin",
    description: "",
    ward: "",
    photo: null, 
  });

  useEffect(() => {
    const fetchPanchayats = async () => {
      try {
        const res = await api.get("/panchayat?status=active");
        setPanchayats(res.data);
      } catch (error) {
        toast.error("Failed to load Panchayats");
      }
    };
    fetchPanchayats();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.panchayatId) {
        toast.error("Please select a Panchayat");
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("panchayatId", formData.panchayatId);
      data.append("reporterName", formData.reporterName);
      data.append("reporterMobile", formData.reporterMobile);
      data.append("type", formData.type);
      data.append("description", formData.description);
      data.append("ward", formData.ward);
      if (formData.photo) {
        data.append("photo", formData.photo);
      }

      await api.post("/complaints", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Complaint submitted successfully! Ticket ID generated.");
      
      // Reset form
      setFormData({
        panchayatId: "",
        reporterName: "",
        reporterMobile: "",
        type: "Missed Bin",
        description: "",
        ward: "",
        photo: null,
      });
      // Allow file input to clear visually if needed (React controlled file input is tricky, assume simple reset works for state)
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Report an Issue</h1>
        
        <div className="bg-white shadow rounded-lg p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Panchayat / Region</label>
                <select
                  name="panchayatId"
                  value={formData.panchayatId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
                >
                  <option value="">-- Select --</option>
                  {panchayats.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Issue Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
                >
                  <option>Missed Bin</option>
                  <option>Not Segregated</option>
                  <option>Hazardous Waste</option>
                  <option>Civic Issue</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Your Name</label>
                <input
                  type="text"
                  name="reporterName"
                  value={formData.reporterName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  type="tel"
                  name="reporterMobile"
                  value={formData.reporterMobile}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Ward Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Ward Number/Name</label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                placeholder="e.g. Ward 10"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message / Complaint Details</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

             {/* Photo Upload */}
             <div>
                <label className="block text-sm font-medium text-gray-700">Upload Photo (Optional)</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Complaint;

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const RegisterHousehold = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [panchayats, setPanchayats] = useState([]);
  
  const [formData, setFormData] = useState({
    ownerName: "",
    mobile: "",
    houseNumber: "",
    address: "",
    ward: "",
    panchayatId: "", // Selected Panchayat ID
  });

  useEffect(() => {
    // Fetch active panchayats
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.panchayatId) {
        toast.error("Please select a Panchayat/Corporation");
        setLoading(false);
        return;
      }

      await api.post("/households", formData);
      toast.success("Registration submitted! Pending approval.");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Household
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join the smart collection network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Panchayat Selection */}
            <div>
              <label htmlFor="panchayatId" className="block text-sm font-medium text-gray-700">
                Select Panchayat / Corporation
              </label>
              <select
                id="panchayatId"
                name="panchayatId"
                required
                value={formData.panchayatId}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md border"
              >
                <option value="">-- Select --</option>
                {panchayats.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <div className="mt-1">
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <div className="mt-1">
                <input
                  id="mobile"
                  name="mobile"
                  type="text"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700">
                House Number
              </label>
              <div className="mt-1">
                <input
                  id="houseNumber"
                  name="houseNumber"
                  type="text"
                  required
                  value={formData.houseNumber}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address / Landmark
              </label>
              <div className="mt-1">
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700">
                Ward Number/Name
              </label>
              <div className="mt-1">
                <input
                  id="ward"
                  name="ward"
                  type="text"
                  required
                  value={formData.ward}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Register Household"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterHousehold;

import { useState } from "react";
import { X } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function AddPanchayatModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    panchayatName: "",
    location: "",
    inchargePerson: "",
    inchargeIdProof: null,
    registrationLetter: null,
    estHouseholds: "",
    estLabours: "",
    phoneNumber: "",
    emailAddress: "",
    website: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleAddSave = async () => {
    if (loading) return;
    if (
      !formData.panchayatName ||
      !formData.location ||
      !formData.inchargePerson ||
      !formData.phoneNumber
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append("name", formData.panchayatName);
      payload.append("address", formData.location);
      payload.append("inchargeName", formData.inchargePerson);
      payload.append("phone", formData.phoneNumber);
      payload.append("email", formData.emailAddress);
      payload.append("website", formData.website);
      payload.append("estHouseholds", formData.estHouseholds);
      payload.append("estLabours", formData.estLabours);

      if (formData.inchargeIdProof) {
        payload.append("inchargeIdProof", formData.inchargeIdProof);
      }
      if (formData.registrationLetter) {
        payload.append("registrationLetter", formData.registrationLetter);
      }

      await api.post("/company/panchayats", payload);

      toast.success("Panchayat submitted for approval");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add panchayat");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">ADD NEW PANCHAYAT</h2>
          <button onClick={handleCancel}>
            <X size={24} />
          </button>
        </div>
        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* General Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              General Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Panchayat Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Panchayat Name
                </label>
                <input
                  type="text"
                  name="panchayatName"
                  value={formData.panchayatName}
                  onChange={handleInputChange}
                  placeholder="eg. Navelim Panchayat"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Incharge Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incharge Person
                </label>
                <input
                  type="text"
                  name="inchargePerson"
                  value={formData.inchargePerson}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Location / Address - spans 2 columns */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location / Address
                </label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter Address"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Incharge Person ID Proof */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incharge Person ID Proof
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "inchargeIdProof")}
                    className="hidden"
                    id="idProofInput"
                  />
                  <label
                    htmlFor="idProofInput"
                    className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </label>
                </div>
                {formData.inchargeIdProof && (
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.inchargeIdProof.name}
                  </p>
                )}
              </div>

              {/* Panchayat Registration Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Panchayat Registration Letter
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "registrationLetter")}
                    className="hidden"
                    id="registrationInput"
                  />
                  <label
                    htmlFor="registrationInput"
                    className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </label>
                </div>
                {formData.registrationLetter && (
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.registrationLetter.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Capacity & Estimates Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Capacity & Estimates
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Est. Households */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Est. Households
                </label>
                <select
                  name="estHouseholds"
                  value={formData.estHouseholds}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Range</option>
                  <option value="0-100">0 - 100</option>
                  <option value="100-500">100 - 500</option>
                  <option value="500-1000">500 - 1000</option>
                  <option value="1000+">1000+</option>
                </select>
              </div>

              {/* Est. Collection Labours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Est. Collection Labours
                </label>
                <select
                  name="estLabours"
                  value={formData.estLabours}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Range</option>
                  <option value="1-5">1 - 5</option>
                  <option value="5-10">5 - 10</option>
                  <option value="10-20">10 - 20</option>
                  <option value="20+">20+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Contact Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+91"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder="name@gov.in"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Website (Optional) */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
          <button
            onClick={handleCancel}
            disabled={loading}
            className={`px-6 py-2 bg-red-500 text-white rounded-md ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            Cancel
          </button>

          <button
            onClick={handleAddSave}
            disabled={loading}
            className={`px-6 py-2 bg-teal-500 text-white rounded-md transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Add & Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";


export default function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    employeeCode: "",
    phone: "",
    address: "",
    role: "Collector",
    ward: "",
    joiningDate: "",
  });

  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const res = await api.get("/wards");
        setWards(res.data);
      } catch (err) {
        console.error("Failed to fetch wards", err);
      }
    };
    fetchWards();
  }, []);

  const [files, setFiles] = useState({
    photo: null,
    idProof: null,
    license: null,
  });

  /* ---------- PREFILL ---------- */
  useEffect(() => {
    if (!employee) return;

    setFormData({
      name: employee.name || "",
      employeeCode: employee.employeeCode || "",
      phone: employee.phone || "",
      address: employee.address || "",
      role: employee.role || "Collector",
      ward: employee.ward || "",
      joiningDate: employee.joiningDate
        ? employee.joiningDate.split("T")[0]
        : "",
    });

    setFiles({ photo: null, idProof: null, license: null });
  }, [employee]);

  if (!isOpen || !employee) return null;

  /* ---------- HANDLERS ---------- */
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles((p) => ({ ...p, [e.target.name]: file }));
  };

  const validate = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.employeeCode.trim()) return "Employee code is required";
    if (!formData.phone.trim()) return "Phone number is required";
    if (!formData.address.trim()) return "Address is required";
    if (!formData.ward.trim()) return "Ward is required";
    if (!formData.joiningDate) return "Joining date is required";
    return null;
  };

  /* ---------- UPDATE ---------- */
  const handleUpdate = async () => {
    const error = validate();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

      if (files.photo) fd.append("photo", files.photo);
      if (files.idProof) fd.append("idProof", files.idProof);
      if (files.license) fd.append("license", files.license);

      await api.put(`/employees/${employee._id}`, fd);

      toast.success("Employee updated successfully");
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
return (
  <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
    <div className="flex justify-center py-10 px-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold mb-6">Edit Employee</h2>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Employee Name">
            <Input name="name" value={formData.name} onChange={handleChange} />
          </Field>

          <Field label="Employee Code">
            <Input
              name="employeeCode"
              value={formData.employeeCode}
              onChange={handleChange}
            />
          </Field>

          <Field label="Phone Number">
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Field>

          <Field label="Ward">
            <Select
              name="ward"
              value={formData.ward}
              onChange={handleChange}
            >
              <option value="">Select Ward</option>
              {wards.map((w) => (
                <option key={w._id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Role" full>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option>Collector</option>
              <option>Driver</option>
              <option>Supervisor</option>
              <option>Helper</option>
            </Select>
          </Field>

          <Field label="Joining Date" full>
            <Input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
            />
          </Field>

          <Field label="Address" full>
            <Textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
            />
          </Field>
        </div>

        {/* DOCUMENTS */}
        <div className="mt-6 border-t pt-4 space-y-4">
          <Field label="Replace Photo (optional)" full>
            <FileInput name="photo" onChange={handleFileChange} />
          </Field>

          <Field label="Replace ID Proof (optional)" full>
            <FileInput name="idProof" onChange={handleFileChange} />
          </Field>

          {formData.role === "Driver" && (
            <Field label="Replace License (optional)" full>
              <FileInput name="license" onChange={handleFileChange} />
            </Field>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-[#1f9e9a] hover:bg-[#198a87]"
            }`}
          >
            {loading ? "Saving..." : "Update Employee"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

}

/* ---------- REUSABLE UI ---------- */

function Field({ label, children, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f9e9a]"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1f9e9a]"
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1f9e9a]"
    />
  );
}

function FileInput(props) {
  return (
    <input
      type="file"
      {...props}
      className="w-full text-sm border border-gray-300 rounded px-3 py-2 bg-white"
    />
  );
}

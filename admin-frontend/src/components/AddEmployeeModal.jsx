import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  

  const [form, setForm] = useState({
    name: "",
    employeeCode: "",
    phone: "",
    address: "",
    role: "Collector",
    ward: "",
    joiningDate: "", // DOB
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

  const [preview, setPreview] = useState({
    photo: null,
    idProof: null,
    license: null,
  });

  /* cleanup preview URLs */
  useEffect(() => {
    return () => {
      Object.values(preview).forEach((p) => {
        if (p?.url) URL.revokeObjectURL(p.url);
      });
    };
  }, [preview]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = e.target.name;

    setFiles((p) => ({ ...p, [name]: file }));
    setPreview((p) => ({
      ...p,
      [name]: {
        url: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
        key: Date.now(),
      },
    }));

    e.target.value = "";
  };

  const validate = () => {
    if (!form.name.trim()) return "Employee name is required";
    if (!form.employeeCode.trim()) return "Employee code is required";
    if (!form.phone.trim()) return "Phone number is required";
    if (!form.address.trim()) return "Address is required";
    if (!form.ward.trim()) return "Ward is required";
    if (!form.joiningDate) return "Date of birth is required";
    if (!files.photo) return "Photo is required";
    if (!files.idProof) return "ID proof is required";
    if (form.role === "Driver" && !files.license)
      return "Driving license is required";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);

    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("photo", files.photo);
      fd.append("idProof", files.idProof);
      if (files.license) fd.append("license", files.license);

      await api.post("/employees", fd);

      toast.success("Employee added successfully");
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Add employee failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold mb-6">Add Employee</h2>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Employee Name">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Employee Code">
            <input
              name="employeeCode"
              value={form.employeeCode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Phone Number">
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Ward">
            <select
              name="ward"
              value={form.ward}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
            >
              <option value="">Select Ward</option>
              {wards.map(w => (
                <option key={w._id} value={w.name}>{w.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Role" full>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
            >
              <option>Collector</option>
              <option>Driver</option>
              <option>Supervisor</option>
              <option>Helper</option>
            </select>
          </Field>

          <Field label="Date of Birth" full>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Address" full>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </Field>
        </div>

        {/* DOCUMENTS */}
        <div className="mt-6 space-y-4">
          <FileBlock label="Photo" name="photo" preview={preview.photo} onChange={handleFileChange} />
          <FileBlock label="ID Proof" name="idProof" preview={preview.idProof} onChange={handleFileChange} />
          {form.role === "Driver" && (
            <FileBlock label="Driving License" name="license" preview={preview.license} onChange={handleFileChange} />
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded text-white ${
              loading ? "bg-gray-400" : "bg-[#1f9e9a] hover:bg-[#198a87]"
            }`}
          >
            {loading ? "Saving..." : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- REUSABLE FIELD ---------- */
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

/* ---------- FILE PREVIEW ---------- */
function FileBlock({ label, name, preview, onChange }) {
  return (
    <div className="border border-gray-300 rounded p-3">
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <input type="file" name={name} onChange={onChange} />

      {preview && (
        <div className="mt-3">
          {preview.type.startsWith("image/") && (
            <img src={preview.url} alt="preview" className="h-28 rounded border" />
          )}

          {preview.type === "application/pdf" && (
            <iframe
              key={preview.key}
              src={preview.url}
              className="w-full h-40 border rounded"
            />
          )}

          {!preview.type.startsWith("image/") &&
            preview.type !== "application/pdf" && (
              <p className="text-xs text-gray-600">{preview.name}</p>
            )}
        </div>
      )}
    </div>
  );
}

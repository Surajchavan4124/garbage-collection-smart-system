import { useEffect, useState } from "react";
import { X, UserPlus, Camera, FileText, Car, Upload } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", employeeCode: "", phone: "", address: "",
    role: "Collector", wards: [], joiningDate: "",
  });
  const [wards, setWards] = useState([]);
  const [files, setFiles] = useState({ photo: null, idProof: null, license: null });
  const [preview, setPreview] = useState({ photo: null, idProof: null, license: null });

  useEffect(() => {
    api.get("/wards").then(res => setWards(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    return () => Object.values(preview).forEach(p => { if (p?.url) URL.revokeObjectURL(p.url); });
  }, [preview]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = e.target.name;
    setFiles(p => ({ ...p, [name]: file }));
    setPreview(p => ({ ...p, [name]: { url: URL.createObjectURL(file), type: file.type, name: file.name, key: Date.now() } }));
    e.target.value = "";
  };
  const toggleWard = (name) => setForm(p => ({
    ...p, wards: p.wards.includes(name) ? p.wards.filter(w => w !== name) : [...p.wards, name]
  }));

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("Employee name is required");
    if (!form.employeeCode.trim()) return toast.error("Employee code is required");
    if (!form.phone.trim()) return toast.error("Phone number is required");
    if (!form.address.trim()) return toast.error("Address is required");
    if (form.wards.length === 0) return toast.error("At least one ward is required");
    if (!form.joiningDate) return toast.error("Joining date is required");
    if (!files.photo) return toast.error("Photo is required");
    if (!files.idProof) return toast.error("ID proof is required");
    if (form.role === "Driver" && !files.license) return toast.error("Driving license is required");

    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'wards') v.forEach(w => fd.append("wards", w));
        else fd.append(k, v);
      });
      fd.append("photo", files.photo);
      fd.append("idProof", files.idProof);
      if (files.license) fd.append("license", files.license);
      await api.post("/employees", fd);
      toast.success("Employee added successfully");
      setForm({ name: "", employeeCode: "", phone: "", address: "", role: "Collector", wards: [], joiningDate: "" });
      setFiles({ photo: null, idProof: null, license: null });
      setPreview({ photo: null, idProof: null, license: null });
      onClose(); onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Add employee failed");
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 animate-fade-in-up overflow-hidden max-h-[92vh] flex flex-col">

          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1f9e9a, #22c55e)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <UserPlus size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-medium uppercase tracking-wider">New Record</p>
                <h2 className="text-white font-bold">Add Employee</h2>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">

            {/* Basic Info */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Basic Information</p>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Employee Name *">
                  <StyledInput name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
                </FormField>
                <FormField label="Employee Code *">
                  <StyledInput name="employeeCode" value={form.employeeCode} onChange={handleChange} placeholder="EMP-001" />
                </FormField>
                <FormField label="Phone Number *">
                  <StyledInput name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" />
                </FormField>
                <FormField label="Joining Date *">
                  <StyledInput type="date" name="joiningDate" value={form.joiningDate} onChange={handleChange} />
                </FormField>
                <FormField label="Role *" full>
                  <StyledSelect name="role" value={form.role} onChange={handleChange}>
                    <option>Collector</option>
                    <option>Driver</option>
                    <option>Supervisor</option>
                    <option>Helper</option>
                  </StyledSelect>
                </FormField>
                <FormField label="Address *" full>
                  <StyledTextarea name="address" rows={2} value={form.address} onChange={handleChange} placeholder="Full address" />
                </FormField>
              </div>
            </div>

            {/* Ward Selection */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Ward Assignment *</p>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl min-h-[52px]">
                {wards.map(w => {
                  const checked = form.wards.includes(w.name);
                  return (
                    <label key={w._id} onClick={() => toggleWard(w.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all text-sm font-medium select-none ${
                        checked ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-white border-gray-200 text-gray-700 hover:border-teal-200'
                      }`}>
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${checked ? 'bg-teal-500 border-teal-500' : 'border-gray-300'}`}>
                        {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      {w.name}
                    </label>
                  );
                })}
                {wards.length === 0 && <p className="text-gray-400 text-xs py-1">No wards found...</p>}
              </div>
            </div>

            {/* Documents */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Documents</p>
              <div className="grid grid-cols-1 gap-3">
                <UploadCard icon={<Camera size={14} />} label="Employee Photo *" name="photo" file={files.photo} preview={preview.photo} onChange={handleFileChange} />
                <UploadCard icon={<FileText size={14} />} label="ID Proof *" name="idProof" file={files.idProof} preview={preview.idProof} onChange={handleFileChange} />
                {form.role === "Driver" && (
                  <UploadCard icon={<Car size={14} />} label="Driving License *" name="license" file={files.license} preview={preview.license} onChange={handleFileChange} />
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex gap-3 flex-shrink-0">
            <button onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-bold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1f9e9a, #22c55e)' }}>
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : <><UserPlus size={14} /> Add Employee</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function FormField({ label, children, full }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}
function StyledInput(props) {
  return <input {...props} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 transition-all placeholder-gray-300" />;
}
function StyledTextarea(props) {
  return <textarea {...props} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 transition-all placeholder-gray-300" />;
}
function StyledSelect({ children, ...props }) {
  return <select {...props} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-400 transition-all">{children}</select>;
}
function UploadCard({ icon, label, name, file, preview, onChange }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <label className="flex items-center gap-3 p-3 bg-gray-50 cursor-pointer hover:border-teal-200 hover:bg-teal-50/30 transition-all group">
        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-teal-500 group-hover:border-teal-300 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-700">{label}</p>
          <p className="text-[10px] text-gray-400 truncate">{file ? file.name : 'Click to upload file'}</p>
        </div>
        <Upload size={14} className="text-gray-300 group-hover:text-teal-400 transition-colors flex-shrink-0" />
        <input type="file" name={name} onChange={onChange} className="hidden" />
      </label>
      {preview && (
        <div className="px-3 pb-3">
          {preview.type?.startsWith("image/") && (
            <img src={preview.url} alt="preview" className="h-24 rounded-lg border border-gray-100 object-cover mt-1" />
          )}
          {preview.type === "application/pdf" && (
            <iframe key={preview.key} src={preview.url} className="w-full h-32 border rounded-lg mt-1" />
          )}
        </div>
      )}
    </div>
  );
}

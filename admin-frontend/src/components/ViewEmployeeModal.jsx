import { X, Download, Image as ImageIcon } from "lucide-react";

/* ---------- FIXED BASE URL ---------- */
const RAW_API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://ecosyz-backend.onrender.com/api";
const STATIC_BASE = RAW_API_BASE.replace(/\/api$/, "");

const isImage = (path = "") =>
  /\.(jpg|jpeg|png|webp)$/i.test(path);

export default function ViewEmployeeModal({
  isOpen,
  onClose,
  employee,
  onEdit,
  onDeactivate,
  onActivate,
}) {
  if (!isOpen || !employee) return null;

  const {
    name,
    employeeCode,
    phone,
    address,
    role,
    ward,
    wards = [],
    joiningDate,
    documents = {},
  } = employee;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  const openFile = (path) => {
    if (!path) return;
    window.open(`${STATIC_BASE}/${path}`, "_blank");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-6 border-b sticky top-0 bg-white">
            <h2 className="text-xl font-bold uppercase">Employee Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 grid grid-cols-2 gap-8">
            {/* LEFT */}
            <div>
              <Section title="Basic Information">
                <Field label="Name" value={name} />
                <Field label="Employee Code" value={employeeCode} />
                <Field label="Contact Number" value={phone} />
                <Field label="Address" value={address} textarea />
                <Field label="Joining Date" value={formatDate(joiningDate)} />
              </Section>

              <Section title="Roles & Responsibilities">
                <Field label="Role" value={role} />
                <Field label="Wards" value={wards.length > 0 ? wards.join(", ") : ward} />
              </Section>
            </div>

            {/* RIGHT */}
            <div>
              <Section title="Photo & Documents">
                {/* PHOTO */}
                <div className="mb-6">
                  <label className="text-sm font-semibold mb-2 block">
                    Employee Photo
                  </label>
                  <div className="h-48 border-2 border-dashed rounded flex items-center justify-center bg-gray-100">
                    {documents.photo && isImage(documents.photo) ? (
                      <img
                        src={`${STATIC_BASE}/${documents.photo}`}
                        className="w-full h-full object-cover rounded"
                        alt="Employee"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <ImageIcon size={40} />
                        <span className="text-xs mt-2">No photo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ID PROOF */}
                <DocumentRow
                  label="ID Proof"
                  path={documents.idProof}
                  onOpen={openFile}
                />

                {/* LICENSE */}
                {role === "Driver" && (
                  <DocumentRow
                    label="Driving License"
                    path={documents.license}
                    onOpen={openFile}
                  />
                )}
              </Section>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 px-8 py-6 border-t">
            <button
              onClick={onEdit}
              className="px-6 py-3 bg-[#1f9e9a] text-white rounded font-bold"
            >
              Edit
            </button>
            {employee?.status === "active" ? (
              <button
                onClick={onDeactivate}
                className="px-6 py-3 bg-red-500 text-white rounded font-bold"
              >
                Deactivate
              </button>
            ) : (
              <button
                onClick={onActivate}
                className="px-6 py-3 bg-green-500 text-white rounded font-bold"
              >
                Activate
              </button>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h3 className="font-bold mb-6">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, textarea }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2">{label}</label>
      {textarea ? (
        <textarea
          readOnly
          value={value || "-"}
          rows={3}
          className="w-full border rounded px-3 py-2 bg-gray-50 text-sm"
        />
      ) : (
        <input
          readOnly
          value={value || "-"}
          className="w-full border rounded px-3 py-2 bg-gray-50 text-sm"
        />
      )}
    </div>
  );
}

function DocumentRow({ label, path, onOpen }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold mb-2">{label}</label>
      <div className="flex items-center gap-3 border rounded px-4 py-3 bg-gray-50">
        <span className="flex-1 text-sm truncate">
          {path ? path.split("/").pop() : "Not uploaded"}
        </span>
        {path && (
          <button
            onClick={() => onOpen(path)}
            className="text-[#1f9e9a]"
          >
            <Download size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

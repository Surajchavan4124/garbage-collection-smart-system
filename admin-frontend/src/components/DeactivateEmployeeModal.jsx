import { X, User } from "lucide-react";

const RAW_API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://ecosyz-backend.onrender.com/api";

const STATIC_BASE = RAW_API_BASE.replace(/\/api$/, "");

const isImage = (path = "") =>
  /\.(jpg|jpeg|png|webp)$/i.test(path);

export default function DeactivateEmployeeModal({
  isOpen,
  onClose,
  employee,
  onConfirm,
}) {
  if (!isOpen || !employee) return null;

  const handleDeactivate = () => {
    onConfirm(employee._id);
    onClose();
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
      <div className="flex justify-center py-10 px-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-sm font-bold uppercase">
              Deactivate Employee
            </h2>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="p-6 text-center">
            <p className="text-sm mb-6">
              Are you sure you want to deactivate this employee?
            </p>

            <div className="flex flex-col items-center gap-4 mb-6 p-5 bg-gray-50 rounded-lg">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                {employee.documents?.photo &&
                isImage(employee.documents.photo) ? (
                  <img
                    src={`${STATIC_BASE}/${employee.documents.photo}`}
                    className="w-full h-full object-cover"
                    alt="Employee"
                  />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>

              <div className="text-left w-full space-y-2">
                <p><b>Name:</b> {employee.name}</p>
                <p><b>Code:</b> {employee.employeeCode}</p>
                <p><b>Joining:</b> {formatDate(employee.joiningDate)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeactivate}
                className="flex-1 bg-red-500 text-white py-2 rounded"
              >
                Deactivate
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[#1f9e9a] text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-red-500 mt-4">
              This action cannot be undone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

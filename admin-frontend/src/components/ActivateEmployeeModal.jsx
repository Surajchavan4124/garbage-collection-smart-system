import { X, User, CheckCircle } from "lucide-react";

const RAW_API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:10000/api";

const STATIC_BASE = RAW_API_BASE.replace(/\/api$/, "");

const isImage = (path = "") =>
  /\.(jpg|jpeg|png|webp)$/i.test(path);

export default function ActivateEmployeeModal({
  isOpen,
  onClose,
  employee,
  onConfirm,
}) {
  if (!isOpen || !employee) return null;

  const handleActivate = () => {
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
            <h2 className="text-sm font-bold uppercase text-green-600">
              Activate Employee
            </h2>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="p-6 text-center">
            <div className="mb-4 flex justify-center">
               <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle size={32} className="text-green-600" />
               </div>
            </div>
            
            <p className="text-sm mb-6">
              Are you sure you want to reactivate this employee? They will be able to access the system again.
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

              <div className="text-left w-full space-y-2 text-sm">
                <p><b>Name:</b> {employee.name}</p>
                <p><b>Code:</b> {employee.employeeCode}</p>
                <p><b>Role:</b> {employee.role}</p>
                <p><b>Joining:</b> {formatDate(employee.joiningDate)}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleActivate}
                className="flex-1 bg-green-500 text-white py-2 rounded font-semibold"
              >
                Activate
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded font-semibold border"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

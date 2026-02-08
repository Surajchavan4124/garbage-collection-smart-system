import { X } from "lucide-react";

export default function ViewPanchayatModal({
  isOpen,
  onClose,
  data,
  onApprove,
  onReject,
}) {
  if (!isOpen || !data) return null;

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const renderDocument = (file) => {
    if (!file) return <p className="text-gray-500 text-sm">Not uploaded</p>;

    const url = `${baseURL}/uploads/${file}`;

    if (file.endsWith(".pdf")) {
      return (
        <iframe
          src={url}
          title="Document Preview"
          className="w-full h-64 border rounded"
        />
      );
    }

    return (
      <img
        src={url}
        alt="Document"
        className="w-full max-h-64 object-contain border rounded"
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Panchayat Details</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Name</span>
              <p className="font-medium">{data.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Incharge</span>
              <p className="font-medium">{data.inchargeName}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Address</span>
              <p className="font-medium">{data.address}</p>
            </div>
            <div>
              <span className="text-gray-500">Phone</span>
              <p className="font-medium">{data.contactPhone}</p>
            </div>
            <div>
              <span className="text-gray-500">Email</span>
              <p className="font-medium">{data.contactEmail || "—"}</p>
            </div>
            <div>
              <span className="text-gray-500">Households</span>
              <p className="font-medium">{data.estHouseholds || "—"}</p>
            </div>
            <div>
              <span className="text-gray-500">Labours</span>
              <p className="font-medium">{data.estLabours || "—"}</p>
            </div>
          </div>

          {/* Documents */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">
                Incharge ID Proof
              </h4>
              {renderDocument(data.documents?.inchargeIdProof)}
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                Registration Letter
              </h4>
              {renderDocument(data.documents?.registrationLetter)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Close
          </button>

          {data.status === "pending" && (
            <>
              <button
                onClick={() => onReject(data._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Reject
              </button>
              <button
                onClick={() => onApprove(data._id)}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Verify
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

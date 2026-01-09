import { X, Eye } from 'lucide-react';

export default function ViewRequestModal({ isOpen, onClose, requestData }) {
  if (!isOpen) return null;

  // Default data if none provided
  const data = requestData || {
    panchayatName: 'VARCA PANCHAYAT',
    submittedDate: 'Jan 02, 2026',
    inchargePerson: 'Mr. Suresh Kamat',
    location: 'Village Panchayat Varca, Fatrade, Varca, Goa 403721',
    estHouseholds: '10,200',
    estLabours: '50',
    phoneNumber: '9876543224',
    emailAddress: 'varca@gov.com',
    website: '-',
    documents: [
      {
        id: 1,
        name: 'Incharge Person ID Proof',
        type: 'pdf',
      },
      {
        id: 2,
        name: 'Panchayat Registration Letter',
        type: 'pdf',
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {data.panchayatName}
            </h2>
            <p className="text-gray-600 text-sm">
              Submitted on {data.submittedDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Two Column Layout */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="col-span-2 space-y-6">
              {/* Details Section */}
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Details
                </h3>

                <div className="space-y-4">
                  {/* Panchayat Name & Incharge Person */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Panchayat Name
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {data.panchayatName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Incharge Person
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {data.inchargePerson}
                      </p>
                    </div>
                  </div>

                  {/* Location / Address */}
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      Location / Address
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {data.location}
                    </p>
                  </div>

                  {/* Submitted Documents */}
                  <div>
                    <p className="text-gray-600 text-sm mb-3">
                      Submitted Documents
                    </p>
                    <div className="space-y-2">
                      {data.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 bg-gray-100 p-3 rounded-md"
                        >
                          <div className="bg-gray-400 p-2 rounded">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 00-2 2v4a1 1 0 001 1h12a1 1 0 001-1V6a2 2 0 00-2-2H4zm12 12H4a2 2 0 01-2-2v-4a1 1 0 00-1-1H1a1 1 0 001 1v4a4 4 0 004 4h12a4 4 0 004-4v-4a1 1 0 00-1-1h-1a1 1 0 001 1v4a2 2 0 01-2 2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 text-sm font-medium">
                              {doc.name}
                            </p>
                          </div>
                          <button className="text-teal-500 hover:text-teal-700 transition p-2">
                            <Eye size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacity & Estimates Section */}
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Capacity & Estimates
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      Est. Households
                    </p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {data.estHouseholds}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      Est. Collection Labours
                    </p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {data.estLabours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Contact Details
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Phone Number
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {data.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Email Address
                      </p>
                      <p className="text-gray-900 font-semibold">
                        {data.emailAddress}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      Website (Optional)
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {data.website}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Admin Decision */}
            <div className="bg-white">
              <div className="border border-gray-300 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                  Admin Decision
                </h3>

                <div className="flex flex-col gap-4">
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Reject
                  </button>

                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

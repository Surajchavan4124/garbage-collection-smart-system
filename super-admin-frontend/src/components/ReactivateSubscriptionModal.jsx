import { X } from "lucide-react";

export default function ReactivateSubscriptionModal({
  isOpen,
  onClose,
  plans,
  currentPlan,
  panchayatName,
  mode,
  onUpgrade,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
  {mode === "change"
    ? "Change Plan"
    : mode === "activate"
    ? "Activate Subscription"
    : "Reactivate Subscription"}
</h3>


          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Panchayat: <strong>{panchayatName}</strong>
        </p>

        {/* Plans */}
        <div className="space-y-4">
          {plans.map((plan) => {
            const isCurrent =
              plan.name.toUpperCase() === currentPlan?.toUpperCase();

            return (
              <div
                key={plan.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {plan.name.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {plan.price} {plan.period}
                  </p>
                </div>

                {isCurrent ? (
                  <button
                    disabled
                    className="px-4 py-2 text-xs font-semibold rounded bg-gray-300 text-gray-600 cursor-not-allowed"
                  >
                    Currently Active
                  </button>
                ) : (
                  <button
                    onClick={() => onUpgrade(plan.name)}
                    className="px-4 py-2 text-xs font-semibold rounded bg-purple-500 text-white hover:bg-purple-600"
                  >
                    {mode === "activate" ? "Activate" : "Upgrade"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

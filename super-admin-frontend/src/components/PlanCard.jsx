export default function PlanCard({ plan }) {
  const getPlanColor = (name) => {
    switch (name) {
      case 'Basic':
        return { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-100 text-teal-800' };
      case 'Standard':
        return { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' };
      case 'Premium':
        return { bg: 'bg-pink-50', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-800' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  const colors = getPlanColor(plan.name);

  return (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6 relative`}>
      {/* Popular Badge */}
      {plan.popular && (
        <div className={`${colors.badge} absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full`}>
          {plan.badge}
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
        <span className="text-gray-600 text-sm">{plan.period}</span>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-gray-700 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {plan.actions.map((action, index) => (
          <button
            key={index}
            className={`flex-1 py-2 rounded text-sm font-semibold transition ${
              action === 'Edit'
                ? 'bg-teal-500 hover:bg-teal-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

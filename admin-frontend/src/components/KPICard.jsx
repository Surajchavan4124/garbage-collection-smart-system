export default function KPICard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">{title}</h3>
      <p className="text-4xl font-bold text-[#1f9e9a] mb-2">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  )
}

// src/components/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-mesh">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1f9e9a] animate-spin" />
        </div>
        <p className="text-sm font-semibold text-gray-500">Loading...</p>
      </div>
    </div>
  )
}

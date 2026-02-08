import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

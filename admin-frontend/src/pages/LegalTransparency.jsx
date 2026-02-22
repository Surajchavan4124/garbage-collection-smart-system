// src/pages/LegalTransparency.jsx
import { useState, useEffect } from 'react'
import { Download, Eye, RefreshCw, Trash2 } from 'lucide-react'

const documents = [
  {
    id: 1,
    title: 'PRIVACY POLICY DOCUMENT',
    type: 'PDF',
    fileName: 'privacy-policy.pdf',
    size: '2.1 MB',
    updated: '2026-01-02'
  },
  {
    id: 2,
    title: 'TERMS OF USE',
    type: 'PDF',
    fileName: 'terms-of-use.pdf',
    size: '1.8 MB',
    updated: '2026-01-01'
  }
]

export default function LegalTransparency() {
  const handleView = (doc) => {
    window.open(`/docs/${doc.fileName}`, '_blank')
  }

  const handleReplace = (doc) => {
    alert(`Replace ${doc.title}`)
  }

  const handleDelete = (doc) => {
    if (confirm(`Delete ${doc.title}?`)) {
      alert('Document deleted')
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-0.5">Central Dashboard › Legal & Transparency</p>
        <h1 className="text-xl font-black text-gray-800">Legal & Transparency</h1>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-8">
            
            {/* Document Icon */}
            <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl mb-6 mx-auto">
              <div className="text-white text-2xl font-bold">PDF</div>
            </div>

            {/* Title */}
            <h3 className="text-center text-lg font-bold text-gray-800 mb-4 truncate">
              {doc.title}
            </h3>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <button
                onClick={() => handleView(doc)}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                <Eye size={14} />
                View
              </button>
              
              <button
                onClick={() => handleReplace(doc)}
                className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition"
              >
                <RefreshCw size={14} />
                Replace
              </button>
              
              <button
                onClick={() => handleDelete(doc)}
                className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>

            {/* Meta */}
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>{doc.size}</p>
              <p>Updated: {doc.updated}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

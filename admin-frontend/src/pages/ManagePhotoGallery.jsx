import { useState } from 'react'
import { Upload, Edit2, Trash2, Plus, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'

export default function ManagePhotoGallery() {
  const [images, setImages] = useState([
    { id: 1, src: 'https://via.placeholder.com/300x200?text=Gallery+1', caption: 'Image Caption' },
    { id: 2, src: 'https://via.placeholder.com/300x200?text=Gallery+2', caption: 'Image Caption' },
    { id: 3, src: 'https://via.placeholder.com/300x200?text=Gallery+3', caption: 'Image Caption' },
    { id: 4, src: 'https://via.placeholder.com/300x200?text=Gallery+4', caption: 'Image Caption' },
    { id: 5, src: 'https://via.placeholder.com/300x200?text=Gallery+5', caption: 'Image Caption' },
    { id: 6, src: 'https://via.placeholder.com/300x200?text=Gallery+6', caption: 'Image Caption' },
    { id: 7, src: 'https://via.placeholder.com/300x200?text=Gallery+7', caption: 'Image Caption' },
    { id: 8, src: 'https://via.placeholder.com/300x200?text=Gallery+8', caption: 'Image Caption' },
    { id: 9, src: 'https://via.placeholder.com/300x200?text=Gallery+9', caption: 'Image Caption' },
  ])

  const [editingId, setEditingId] = useState(null)
  const [editCaption, setEditCaption] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleDeleteImage = (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImages(images.filter(img => img.id !== id))
    }
  }

  const handleEditCaption = (id, currentCaption) => {
    setEditingId(id)
    setEditCaption(currentCaption)
  }

  const handleSaveCaption = (id) => {
    setImages(images.map(img =>
      img.id === id ? { ...img, caption: editCaption } : img
    ))
    setEditingId(null)
    setEditCaption('')
  }

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (files) {
      for (let file of files) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const newImage = {
            id: Math.max(...images.map(img => img.id), 0) + 1,
            src: event.target.result,
            caption: 'Image Caption'
          }
          setImages([...images, newImage])
        }
        reader.readAsDataURL(file)
      }
    }
    setIsUploadModalOpen(false)
  }

  const handleSaveDraft = () => {
    alert('Gallery saved as draft!')
  }

  const handlePublish = () => {
    alert('Gallery published successfully!')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Fixed */}
        <TopHeader />

        {/* Page Content - Scrollable below header */}
        <div className="mt-16 flex-1 overflow-y-auto p-6 bg-gray-100">
          
          {/* Breadcrumbs */}
          <div className="mb-6 text-sm text-gray-600">
            <span>Public Website CMS</span> &gt;{' '}
            <span className="font-semibold text-gray-800">Manage Photo Gallery</span>
          </div>

          {/* Main Container */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            
            {/* Header with buttons */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-800">PHOTO GALLERY MANAGEMENT</h1>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded font-semibold text-sm hover:bg-blue-700 transition"
                >
                  <Plus size={18} />
                  Upload New Photo
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded font-semibold text-sm hover:bg-gray-600 transition"
                >
                  Save Draft
                </button>
                <button
                  onClick={handlePublish}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition"
                >
                  Publish
                </button>
              </div>
            </div>

            {/* Photo Gallery Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">Photo Gallery</h2>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                  >
                    {/* Image Container */}
                    <div className="relative bg-gray-200 h-48 overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.caption}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition"></div>
                    </div>

                    {/* Caption Section */}
                    <div className="p-4 space-y-3">
                      {editingId === image.id ? (
                        <input
                          type="text"
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          className="w-full px-3 py-2 border border-teal-500 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="Enter caption"
                        />
                      ) : (
                        <p className="text-sm text-gray-700 font-medium text-center">
                          {image.caption}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {editingId === image.id ? (
                          <>
                            <button
                              onClick={() => handleSaveCaption(image.id)}
                              className="flex-1 px-3 py-2 bg-teal-500 text-white rounded font-semibold text-xs hover:bg-teal-600 transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="flex-1 px-3 py-2 bg-gray-400 text-white rounded font-semibold text-xs hover:bg-gray-500 transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditCaption(image.id, image.caption)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-teal-500 text-white rounded font-semibold text-xs hover:bg-teal-600 transition"
                            >
                              <Edit2 size={14} />
                              Edit Caption
                            </button>
                            <button
                              onClick={() => handleDeleteImage(image.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white rounded font-semibold text-xs hover:bg-red-600 transition"
                            >
                              <Trash2 size={14} />
                              Delete Image
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Upload New Photo</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 mb-4">
              <label className="cursor-pointer flex flex-col items-center gap-3">
                <Upload size={48} className="text-gray-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold text-sm hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  document.querySelector('input[type="file"]').click()
                }}
                className="flex-1 px-4 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition"
              >
                Browse Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

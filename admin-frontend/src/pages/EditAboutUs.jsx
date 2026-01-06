import { useState } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Link, Image, X, Upload } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'

export default function EditAboutUs() {
  const [content, setContent] = useState('Welcome to our Smart Waste Management System. We are dedicated to providing innovative solutions for waste management in urban areas...')
  const [bannerImage, setBannerImage] = useState(null)
  const [isSaved, setIsSaved] = useState(false)

  const handleContentChange = (e) => {
    setContent(e.target.value)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBannerImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setBannerImage(null)
  }

  const handlePreview = () => {
    alert('Preview:\n\n' + content)
  }

  const handleSaveDraft = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handlePublish = () => {
    alert('About Us page published successfully!')
    handleSaveDraft()
  }

  const insertFormatting = (before, after = '') => {
    const textarea = document.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newContent = 
      content.substring(0, start) + 
      before + 
      (selectedText || 'text') + 
      after + 
      content.substring(end)

    setContent(newContent)

    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selectedText || 'text').length
      )
    }, 0)
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
            <span className="font-semibold text-gray-800">Edit About Us</span>
          </div>

          {/* Main Container */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            
            {/* Header with buttons */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-800">ABOUT US CONTENT MANAGEMENT</h1>
              
              <div className="flex gap-2">
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-500 text-purple-600 rounded font-semibold text-sm hover:bg-purple-50 transition"
                >
                  <span>👁️</span>
                  Preview
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-400 text-gray-700 rounded font-semibold text-sm hover:bg-gray-50 transition"
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

            {/* Saved notification */}
            {isSaved && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                <span>✓</span>
                Changes saved successfully!
              </div>
            )}

            {/* About Us Editor Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">About Us Editor</h2>
              
              {/* Banner Image Section */}
              <div className="space-y-3 border-b border-gray-200 pb-6">
                <label className="block text-sm font-semibold text-gray-700">Banner Image</label>
                
                {bannerImage ? (
                  <div className="relative w-full">
                    <img
                      src={bannerImage}
                      alt="Banner"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                      <div className="text-4xl mb-3">🖼️</div>
                      <label className="cursor-pointer">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded font-semibold text-sm hover:bg-orange-600 transition">
                        <Upload size={16} />
                        Upload/Replace
                      </button>
                      <button className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded font-semibold text-sm hover:bg-yellow-600 transition">
                        Adjust
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Editor */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-800">About Us Editor</h3>

                {/* Toolbar */}
                <div className="bg-gray-50 border border-gray-300 rounded-t-lg p-3 flex flex-wrap gap-2 items-center">
                  {/* Text Formatting Buttons */}
                  <button
                    onClick={() => insertFormatting('**', '**')}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Bold"
                  >
                    <Bold size={18} className="text-gray-700" />
                  </button>
                  
                  <button
                    onClick={() => insertFormatting('*', '*')}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Italic"
                  >
                    <Italic size={18} className="text-gray-700" />
                  </button>
                  
                  <button
                    onClick={() => insertFormatting('<u>', '</u>')}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Underline"
                  >
                    <Underline size={18} className="text-gray-700" />
                  </button>

                  <div className="h-6 border-l border-gray-300"></div>

                  {/* Bullet & Numbered Lists */}
                  <button
                    onClick={() => insertFormatting('• ')}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Bullets"
                  >
                    <List size={18} className="text-gray-700" />
                  </button>
                  
                  <button
                    onClick={() => insertFormatting('1. ')}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Numbered"
                  >
                    <ListOrdered size={18} className="text-gray-700" />
                  </button>

                  <div className="h-6 border-l border-gray-300"></div>

                  {/* Headings */}
                  <button
                    onClick={() => insertFormatting('# ')}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Heading 1"
                  >
                    <Heading1 size={18} className="text-gray-700" />
                  </button>
                  
                  <button
                    onClick={() => insertFormatting('## ')}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Heading 2"
                  >
                    <Heading2 size={18} className="text-gray-700" />
                  </button>

                  <div className="h-6 border-l border-gray-300"></div>

                  {/* Link & Image */}
                  <button
                    onClick={() => insertFormatting('[link text]', '(https://example.com)')}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Link"
                  >
                    <Link size={18} className="text-gray-700" />
                  </button>
                  
                  <button
                    onClick={() => insertFormatting('![alt text]', '(image-url)')}
                    className="p-2 hover:bg-gray-200 rounded transition"
                    title="Image"
                  >
                    <Image size={18} className="text-gray-700" />
                  </button>
                </div>

                {/* Text Area */}
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  rows="16"
                  placeholder="Enter your about us content here..."
                />
              </div>

              {/* Word Count */}
              <div className="text-right text-xs text-gray-500 font-medium">
                {content.length} characters | {content.split(/\s+/).filter(w => w.length > 0).length} words
              </div>
            </div>

            {/* Action Buttons - Bottom */}
            <div className="border-t border-gray-200 pt-6 flex justify-end gap-3">
              <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded font-semibold text-sm hover:bg-gray-400 transition">
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

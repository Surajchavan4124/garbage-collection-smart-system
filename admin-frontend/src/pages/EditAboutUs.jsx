import { useState, useEffect } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Link, Image, X, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import api from '../api/axios'

// Helper to construct full URL for images if needed
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("data:")) return path;
  if (path.startsWith("http")) return path;
  return `http://localhost:5000/${path}`;
};

export default function EditAboutUs() {
  const [content, setContent] = useState('')
  const [bannerImage, setBannerImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  /* ================= FETCH CONTENT ================= */
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/content?type=about-us')
        if (res.data) {
          setContent(res.data.body || '')
          // Check for banner in media
          const banner = res.data.media?.find(m => m.caption === 'Banner')
          if (banner) setBannerImage(banner.url)
        }
      } catch (err) {
        console.error("Fetch Error:", err)
        toast.error("Failed to load content")
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  /* ================= HANDLE SAVE / PUBLISH ================= */
  const handleSave = async (status) => {
    try {
      setSaving(true)
      
      const media = []
      if (bannerImage && !bannerImage.startsWith('data:')) {
         // If it's already a URL, keep it
         media.push({ url: bannerImage, type: 'image', caption: 'Banner' })
      }

      // Note: If bannerImage is data-url, it means it's a new upload not yet sent to server or
      // we need to upload it separately. 
      // Current flow: Upload immediately on selection, then save URL.
      
      await api.post('/content', {
        type: 'about-us',
        title: 'About Us',
        body: content,
        status,
        media 
      })

      if (status === 'draft') toast.success("Draft saved successfully")
      if (status === 'published') toast.success("About Us page published successfully!")

    } catch (err) {
      console.error(err)
      toast.error("Failed to save content")
    } finally {
      setSaving(false)
    }
  }

  /* ================= IMAGE UPLOAD ================= */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post('/content/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const uploadedUrl = res.data.url
      setBannerImage(uploadedUrl) 
      toast.success("Image uploaded")
    } catch (err) {
      console.error(err)
      toast.error("Image upload failed")
    }
  }

  const handleRemoveImage = () => {
    setBannerImage(null)
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <div className="mt-16 flex-1 overflow-y-auto p-6 bg-gray-100">
          
          <div className="mb-6 text-sm text-gray-600">
            <span>Public Website CMS</span> &gt;{' '}
            <span className="font-semibold text-gray-800">Edit About Us</span>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-800">ABOUT US CONTENT MANAGEMENT</h1>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-400 text-gray-700 rounded font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Draft"}
                </button>
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition disabled:opacity-50"
                >
                  {saving ? "Publishing..." : "Publish"}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800">About Us Editor</h2>
              
              <div className="space-y-3 border-b border-gray-200 pb-6">
                <label className="block text-sm font-semibold text-gray-700">Banner Image</label>
                
                {bannerImage ? (
                  <div className="relative w-full">
                    <img
                      src={getImageUrl(bannerImage)}
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
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-800">Content Editor</h3>
                <div className="bg-gray-50 border border-gray-300 rounded-t-lg p-3 flex flex-wrap gap-2 items-center">
                  <button onClick={() => insertFormatting('**', '**')} className="p-2 hover:bg-gray-200 rounded transition" title="Bold">
                    <Bold size={18} className="text-gray-700" />
                  </button>
                  <button onClick={() => insertFormatting('*', '*')} className="p-2 hover:bg-gray-200 rounded transition" title="Italic">
                    <Italic size={18} className="text-gray-700" />
                  </button>
                  <button onClick={() => insertFormatting('<u>', '</u>')} className="p-2 hover:bg-gray-200 rounded transition" title="Underline">
                    <Underline size={18} className="text-gray-700" />
                  </button>
                  <div className="h-6 border-l border-gray-300"></div>
                  <button onClick={() => insertFormatting('• ')} className="p-2 hover:bg-gray-200 rounded transition" title="Bullets">
                    <List size={18} className="text-gray-700" />
                  </button>
                  <button onClick={() => insertFormatting('1. ')} className="p-2 hover:bg-gray-200 rounded transition" title="Numbered">
                    <ListOrdered size={18} className="text-gray-700" />
                  </button>
                  <div className="h-6 border-l border-gray-300"></div>
                  <button onClick={() => insertFormatting('# ')} className="p-2 hover:bg-gray-200 rounded transition" title="Heading 1">
                    <Heading1 size={18} className="text-gray-700" />
                  </button>
                  <button onClick={() => insertFormatting('## ')} className="p-2 hover:bg-gray-200 rounded transition" title="Heading 2">
                    <Heading2 size={18} className="text-gray-700" />
                  </button>
                  <div className="h-6 border-l border-gray-300"></div>
                  <button onClick={() => insertFormatting('[link text]', '(https://example.com)')} className="p-2 hover:bg-gray-200 rounded transition" title="Link">
                    <Link size={18} className="text-gray-700" />
                  </button>
                  <button onClick={() => insertFormatting('![alt text]', '(image-url)')} className="p-2 hover:bg-gray-200 rounded transition" title="Image">
                    <Image size={18} className="text-gray-700" />
                  </button>
                </div>

                <textarea
                  value={content}
                  onChange={handleContentChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-96"
                  placeholder="Enter your about us content here..."
                />
              </div>

              <div className="text-right text-xs text-gray-500 font-medium">
                {content.length} characters | {content.split(/\s+/).filter(w => w.length > 0).length} words
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 flex justify-end gap-3">
              <button 
                onClick={() => setContent('')} // Or reset to original
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded font-semibold text-sm hover:bg-gray-400 transition"
              >
                Clear
              </button>
              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="px-6 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition disabled:opacity-50"
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

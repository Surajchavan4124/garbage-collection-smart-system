import { useState, useEffect } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Link, Image, X, Upload } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'
import api from '../api/axios'

// Helper to construct full URL for images if needed
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("data:")) return path;
  if (path.startsWith("http")) return path;
  return `http://localhost:10000/${path}`;
};

export default function EditAboutUs() {
  const [content, setContent] = useState('')
  const [bannerImage, setBannerImage] = useState(null)
  const [cards, setCards] = useState([
    { title: "Our Mission", content: "", icon: "01" },
    { title: "The Problem", content: "", icon: "02" },
    { title: "The Solution", content: "", icon: "03" }
  ])
  const [activeTab, setActiveTab] = useState('write')
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
          
          // Populate cards if they exist, otherwise keep default structure
          if (res.data.cards && res.data.cards.length > 0) {
              setCards(res.data.cards)
          }
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
        media,
        cards
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

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards]
    newCards[index][field] = value
    setCards(newCards)
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
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-0.5">Public Website CMS › Edit About Us</p>
        <h1 className="text-xl font-black text-gray-800">Edit About Us</h1>
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
                <div className="flex justify-between items-end">
                    <h3 className="text-sm font-bold text-gray-800">Content Editor (Main Description)</h3>
                    <div className="flex bg-gray-200 rounded p-1 gap-1">
                        <button 
                            onClick={() => setActiveTab('write')}
                            className={`px-3 py-1 text-xs font-medium rounded transition ${activeTab === 'write' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                            Write
                        </button>
                        <button 
                            onClick={() => setActiveTab('preview')}
                            className={`px-3 py-1 text-xs font-medium rounded transition ${activeTab === 'preview' ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                            Preview
                        </button>
                    </div>
                </div>

                {activeTab === 'write' ? (
                    <>
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
                        <button onClick={() => insertFormatting('- ', '')} className="p-2 hover:bg-gray-200 rounded transition" title="Bullets">
                            <List size={18} className="text-gray-700" />
                        </button>
                        <button onClick={() => insertFormatting('1. ', '')} className="p-2 hover:bg-gray-200 rounded transition" title="Numbered">
                            <ListOrdered size={18} className="text-gray-700" />
                        </button>
                        <div className="h-6 border-l border-gray-300"></div>
                        <button onClick={() => insertFormatting('# ', '')} className="p-2 hover:bg-gray-200 rounded transition" title="Heading 1">
                            <Heading1 size={18} className="text-gray-700" />
                        </button>
                        <button onClick={() => insertFormatting('## ', '')} className="p-2 hover:bg-gray-200 rounded transition" title="Heading 2">
                            <Heading2 size={18} className="text-gray-700" />
                        </button>
                        <div className="h-6 border-l border-gray-300"></div>
                        <button onClick={() => insertFormatting('[', '](https://example.com)')} className="p-2 hover:bg-gray-200 rounded transition" title="Link">
                            <Link size={18} className="text-gray-700" />
                        </button>
                        <button onClick={() => insertFormatting('![', '](image-url)')} className="p-2 hover:bg-gray-200 rounded transition" title="Image">
                            <Image size={18} className="text-gray-700" />
                        </button>
                        </div>

                        <textarea
                        value={content}
                        onChange={handleContentChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-64 font-mono text-sm"
                        placeholder="Enter your about us content here... (Markdown supported)"
                        />
                    </>
                ) : (
                    <div className="w-full px-6 py-6 border border-gray-300 rounded-lg h-64 overflow-y-auto prose prose-sm bg-white">
                         <ReactMarkdown 
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                                p: ({node, ...props}) => <p className="mb-2" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                            }}
                        >
                            {content || '*No content to preview*'}
                         </ReactMarkdown>
                    </div>
                )}
              </div>

               {/* CARDS EDITOR */}
               <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Infographic Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {cards.map((card, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Card {index + 1}</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">Icon: {card.icon}</span>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => handleCardChange(index, "title", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Content</label>
                        <textarea
                          value={card.content}
                          onChange={(e) => handleCardChange(index, "content", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 h-24 text-sm resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
  )
}

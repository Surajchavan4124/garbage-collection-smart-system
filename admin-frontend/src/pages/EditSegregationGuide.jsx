import { useState, useEffect } from 'react'
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Link, Image, X, Upload, Play, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import api from '../api/axios'

// Helper to construct full URL for images if needed
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("data:")) return path;
  if (path.startsWith("http")) return path;
  return `http://localhost:10000/${path}`;
};

export default function EditSegregationGuide() {
  const [content, setContent] = useState('')
  const [tutorialVideo, setTutorialVideo] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [activeTab, setActiveTab] = useState('write')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  /* ================= FETCH CONTENT ================= */
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/content?type=segregation-guide')
        if (res.data) {
          setContent(res.data.body || '')
          
          if (res.data.media) {
            const video = res.data.media.find(m => m.type === 'video')
            if (video) setTutorialVideo({ name: 'Tutorial Video', url: video.url })
            
            const pdf = res.data.media.find(m => m.caption === 'PDF Guide')
            if (pdf) setPdfFile({ name: 'Guide PDF', url: pdf.url })
          }
        } else {
             // Init default if empty
             setContent('Do\'s And Don\'ts\n\n✓ DO: Separate wet waste from dry waste\n✓ DO: Use separate bins for organic waste...')
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
      if (tutorialVideo) {
         media.push({ url: tutorialVideo.url, type: 'video', caption: 'Tutorial Video' })
      }
      if (pdfFile) {
         media.push({ url: pdfFile.url, type: 'file', caption: 'PDF Guide' })
      }

      await api.post('/content', {
        type: 'segregation-guide',
        title: 'Segregation Guide',
        body: content,
        status,
        media 
      })

      if (status === 'draft') toast.success("Draft saved successfully")
      if (status === 'published') toast.success("Segregation Guide published successfully!")

    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to save content")
    } finally {
      setSaving(false)
    }
  }

  const handleContentChange = (e) => {
    setContent(e.target.value)
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post('/content/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setTutorialVideo({
          name: file.name,
          url: res.data.url
      })
      toast.success("Video uploaded")
    } catch (err) {
      console.error(err)
      toast.error("Video upload failed")
    }
  }

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post('/content/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setPdfFile({
          name: file.name,
          url: res.data.url
      })
      toast.success("PDF uploaded")
    } catch (err) {
      console.error(err)
      toast.error("PDF upload failed")
    }
  }

  const handleRemoveVideo = () => {
    setTutorialVideo(null)
  }

  const handleRemovePdf = () => {
    setPdfFile(null)
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
            <span className="font-semibold text-gray-800">Edit Segregation Guide</span>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-bold text-gray-800">SEGREGATION GUIDE CONTENT MANAGEMENT</h1>
              
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

            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800">Segregation Guide Editor</h2>
              
              <div className="space-y-3 border-b border-gray-200 pb-6">
                <label className="block text-sm font-semibold text-gray-700">Tutorial Video</label>
                
                {tutorialVideo ? (
                  <div className="relative w-full">
                    <div className="bg-gray-900 rounded-lg p-8 flex items-center justify-center h-48 relative">
                      <div className="absolute inset-0 bg-gray-900 rounded-lg flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                            <Play size={32} className="text-white ml-1" />
                          </div>
                          <p className="text-white text-sm font-semibold">{tutorialVideo.name}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveVideo}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                      <div className="text-4xl mb-3">🎬</div>
                      <label className="cursor-pointer">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Click to upload tutorial video or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">MP4, WebM, OGG up to 100MB</p>
                        <input
                          type="file"
                          onChange={handleVideoUpload}
                          accept="video/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <h3 className="text-sm font-bold text-gray-800">Text</h3>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-mono text-sm"
                        rows="10"
                        placeholder="Enter segregation guide content here... (Markdown supported)"
                        />
                    </>
                ) : (
                  <div className="w-full px-6 py-6 border border-gray-300 rounded-lg h-96 overflow-y-auto prose prose-sm bg-white">
                         <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                                p: ({node, ...props}) => <p className="mb-2" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                                em: ({node, ...props}) => <em className="italic" {...props} />,
                                a: ({node, ...props}) => <a className="text-teal-600 hover:underline" {...props} />,
                            }}
                        >
                            {content || '*No content to preview*'}
                         </ReactMarkdown>
                    </div>
                )}
              </div>

              <div className="text-right text-xs text-gray-500 font-medium">
                {content.length} characters | {content.split(/\s+/).filter(w => w.length > 0).length} words
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-bold text-gray-800">Segregation Guide PDF</h3>
                
                {pdfFile ? (
                  <div className="border border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-5xl mb-3">📄</div>
                    <p className="text-sm font-semibold text-gray-800 mb-4">{pdfFile.name}</p>
                    <div className="flex gap-2 justify-center">
                      <button className="px-4 py-2 bg-yellow-500 text-white rounded font-semibold text-sm hover:bg-yellow-600 transition">
                        View
                      </button>
                      <button
                        onClick={handleRemovePdf}
                        className="px-4 py-2 bg-red-500 text-white rounded font-semibold text-sm hover:bg-red-600 transition flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                      <div className="text-4xl mb-3">📥</div>
                      <label className="cursor-pointer">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Click to upload PDF or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF up to 50MB</p>
                        <input
                          type="file"
                          onChange={handlePdfUpload}
                          accept=".pdf"
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded font-semibold text-sm hover:bg-yellow-600 transition">
                        <Upload size={16} />
                        Upload
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 flex justify-end gap-3">
              <button 
                onClick={() => setContent('')}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded font-semibold text-sm hover:bg-gray-400 transition"
              >
                Cancel
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

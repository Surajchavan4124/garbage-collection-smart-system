import { useState, useEffect } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import api from '../api/axios';
import ReactMarkdown from 'react-markdown';
import { FileText, Play, Download, AlertCircle } from 'lucide-react';

const SegregationGuide = () => {
  const { selectedPanchayat } = usePanchayat();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to construct full URL for images/videos if needed
  const getMediaUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("data:")) return path;
    if (path.startsWith("http")) return path;
    return `http://localhost:10000/${path}`;
  };

  useEffect(() => {
    const fetchContent = async () => {
      setContent(null);
      if (!selectedPanchayat?._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/content/public/${selectedPanchayat._id}?type=segregation-guide`);
        setContent(res.data);
      } catch (err) {
        console.error("Failed to fetch segregation content", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [selectedPanchayat]);

  // Extract media
  const tutorialVideo = content?.media?.find(m => m.type === 'video');
  const pdfGuide = content?.media?.find(m => m.caption === 'PDF Guide');

  if (loading) {
     return <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
     </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      {/* Header */}
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Waste Segregation Guide</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Learn how to segregate waste correctly to help keep {selectedPanchayat?.name || 'your community'} clean and green.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-5xl">
        
        {/* If no content found */}
        {!content && !loading && (
             <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800">No Guide Available Yet</h3>
                <p className="text-gray-500 mt-2">The segregation guide for this panchayat hasn't been published yet.</p>
            </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="md:col-span-2 space-y-8">
                
                {/* Tutorial Video Section */}
                {tutorialVideo && (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-full text-red-600">
                                <Play size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">Video Tutorial</h2>
                        </div>
                        <div className="aspect-video bg-black">
                            <video 
                                src={getMediaUrl(tutorialVideo.url)} 
                                controls 
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                )}

                {/* Text Content */}
                {content && content.body && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 prose prose-lg w-full max-w-none prose-headings:text-green-800 prose-a:text-green-600">
                         <ReactMarkdown 
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-3 text-gray-800" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800" {...props} />,
                                p: ({node, ...props}) => <p className="mb-4 text-gray-600 leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                                li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-green-500 pl-4 italic my-4 bg-green-50 py-2 pr-2 rounded-r" {...props} />,
                            }}
                        >
                            {content.body}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6 sticky top-24 h-fit">
                {/* Download PDF Card */}
                {pdfGuide && (
                     <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Download Guide</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Get the complete segregation guidelines in a printable PDF format.
                        </p>
                        <a 
                            href={getMediaUrl(pdfGuide.url)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <Download size={18} />
                            Download PDF
                        </a>
                    </div>
                )}

                {/* Quick Tips or Default Info (Static) */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
                    <h3 className="font-bold text-lg mb-4">Quick Tips</h3>
                    <ul className="space-y-3 text-sm opacity-90">
                        <li className="flex gap-2">
                            <span>✅</span> Wash plastic containers before disposal.
                        </li>
                        <li className="flex gap-2">
                             <span>✅</span> Keep hazardous waste separate.
                        </li>
                        <li className="flex gap-2">
                             <span>✅</span> Compost wet waste if possible.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SegregationGuide;

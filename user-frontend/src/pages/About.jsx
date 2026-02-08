import { useEffect, useState } from "react";
import { usePanchayat } from "../context/PanchayatContext";
import api from "../api/axios";
import ReactMarkdown from 'react-markdown';

const About = () => {
  const { selectedPanchayat } = usePanchayat();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setContent(null); // Reset content to avoid showing stale data from previous panchayat
      if (!selectedPanchayat?._id) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/content/public/${selectedPanchayat._id}?type=about-us`);
        setContent(res.data);
      } catch (err) {
        console.error("Failed to fetch about us content", err);
        // Content remains null (showing default) if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [selectedPanchayat]);

  // Default static content if no dynamic content is found
  const defaultCards = [
    { title: "Our Mission", content: "To maintain clean and hygienic surroundings in Panchayats and Corporations by implementing a digital, accountable system for garbage collection.", icon: "01" },
    { title: "The Problem", content: "Traditional methods suffer from manual attendance fraud, lack of proof of collection, and unaddressed citizen complaints.", icon: "02" },
    { title: "The Solution", content: "A QR-code based monitoring system with GPS validation, real-time dashboards for admins, and a transparent mobile app for citizens.", icon: "03" }
  ];

  const displayCards = (content?.cards && content.cards.length > 0) ? content.cards : defaultCards;
  const displayBody = content?.body || "Transforming waste management through transparency, technology, and community participation.";

  // Helper for banner image if needed
  const getBannerUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:5000';
    return `${baseUrl}/${url}`;
  };

  const bannerUrl = content?.media?.find(m => m.caption === 'Banner')?.url;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      
      {bannerUrl && (
        <div className="mb-12 w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg relative">
            <img 
                src={getBannerUrl(bannerUrl)} 
                alt="About Us Banner" 
                className="w-full h-full object-cover"
            />
             <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl drop-shadow-md">
                   About {selectedPanchayat?.panchayatName || "SmartWaste"}
                </h1>
            </div>
        </div>
      )}

      {!bannerUrl && (
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About {selectedPanchayat?.panchayatName || "SmartWaste"}
            </h1>
        </div>
      )}

      <div className="max-w-3xl mx-auto text-xl text-gray-500 mb-16">
         <ReactMarkdown 
            components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
            }}
         >
            {displayBody}
         </ReactMarkdown>
      </div>

      <div className="mt-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayCards.map((card, index) => (
                <div key={index} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                        <span className="text-white text-xl font-bold">{card.icon || `0${index+1}`}</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{card.title}</h3>
                    <p className="mt-5 text-base text-gray-500">
                        {card.content}
                    </p>
                    </div>
                </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default About;

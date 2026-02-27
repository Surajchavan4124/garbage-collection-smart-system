import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, ExternalLink, FileText, Video, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import Breadcrumb from './shared/Breadcrumb';
import Footer from './shared/Footer';

const guides = [
    {
        icon: '🗑️',
        title: 'Waste Segregation Guide',
        description: 'Learn how to properly separate dry, wet, and hazardous waste for efficient collection and recycling.',
        type: 'PDF Guide',
        color: 'bg-amber-50 border-amber-200',
        iconColor: 'bg-amber-100 text-amber-600',
        tag: 'badge-yellow',
        steps: ['Use Green bin for organic/wet waste', 'Use Blue bin for dry/recyclable waste', 'Use Red bin for hazardous items', 'Never mix sanitary waste with recyclables'],
    },
    {
        icon: '🌿',
        title: 'Home Composting Basics',
        description: 'Turn your kitchen and garden waste into rich compost. A step-by-step guide for households.',
        type: 'Video Guide',
        color: 'bg-green-50 border-green-200',
        iconColor: 'bg-green-100 text-green-600',
        tag: 'badge-green',
        steps: ['Start with a compost bin or pit', 'Add kitchen scraps and dry leaves alternately', 'Turn the pile every 2 weeks', 'Ready compost in 4–6 weeks'],
    },
    {
        icon: '📋',
        title: 'How to File a Complaint',
        description: 'A quick guide on using the EcoSyz complaint system to report missed collections or civic issues.',
        type: 'Article',
        color: 'bg-blue-50 border-blue-200',
        iconColor: 'bg-blue-100 text-blue-600',
        tag: 'badge-blue',
        steps: ['Login with your mobile number', 'Go to Dashboard → Submit Complaint', 'Choose a complaint type and describe the issue', 'Track status from your dashboard'],
    },
    {
        icon: '♻️',
        title: 'Recyclable Materials List',
        description: 'Know what can and cannot be recycled. This helps ensure cleaner segregation and better recovery rates.',
        type: 'PDF Guide',
        color: 'bg-purple-50 border-purple-200',
        iconColor: 'bg-purple-100 text-purple-600',
        tag: 'badge-blue',
        steps: ['Paper, cardboard, newspapers — YES', 'Glass bottles and jars — YES', 'Plastic bags and film — NO', 'Styrofoam / thermocol — NO'],
    },
    {
        icon: '🏠',
        title: 'Household Registration Guide',
        description: 'New to EcoSyz? Follow these steps to get your household registered under your Panchayat.',
        type: 'Article',
        color: 'bg-rose-50 border-rose-200',
        iconColor: 'bg-rose-100 text-rose-600',
        tag: 'badge-red',
        steps: ['Contact your Panchayat incharge', 'Provide your address and mobile number', 'You will receive an OTP to activate your account', 'Login via EcoSyz and select your Panchayat'],
    },
];

const typeIcon = (type) => {
    if (type === 'PDF Guide') return <FileText className="w-3.5 h-3.5" />;
    if (type === 'Video Guide') return <Video className="w-3.5 h-3.5" />;
    return <BookOpen className="w-3.5 h-3.5" />;
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } })
};

const GuidesResourcesPage = ({ navigate }) => (
    <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}>
        <div className="max-w-5xl mx-auto px-4 py-10">
            <Breadcrumb path={[{ label: 'Guides & Resources', view: null }]} navigate={navigate} />

            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-10">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-7 h-7 text-amber-600" />
                </div>
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                    Guides & <span className="gradient-text">Resources</span>
                </h1>
                <p className="text-gray-500">Everything you need to manage waste the right way.</p>
            </motion.div>

            <div className="space-y-5">
                {guides.map((guide, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className={`card border ${guide.color} overflow-hidden`}
                    >
                        <div className="p-6">
                            <div className="flex gap-4 items-start">
                                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${guide.iconColor} border`}
                                    style={{ width: 52, height: 52 }}>
                                    {guide.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-display font-bold text-gray-900">{guide.title}</h3>
                                        <span className={`badge ${guide.tag} flex items-center gap-1`}>
                                            {typeIcon(guide.type)} {guide.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">{guide.description}</p>

                                    {/* Steps */}
                                    <ul className="space-y-1.5">
                                        {guide.steps.map((step, j) => (
                                            <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                                <ChevronRight className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-5 flex gap-3">
                            <button
                                onClick={() => toast.info('Download will be available soon.')}
                                className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                            >
                                <Download className="w-3.5 h-3.5" /> Download
                            </button>
                            <button
                                onClick={() => toast.info('Online viewer coming soon.')}
                                className="btn-outline text-xs px-4 py-2 flex items-center gap-1.5"
                            >
                                <ExternalLink className="w-3.5 h-3.5" /> View Online
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
        <Footer navigate={navigate} />
    </div>
);

export default GuidesResourcesPage;

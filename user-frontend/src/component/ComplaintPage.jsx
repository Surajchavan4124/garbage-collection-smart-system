import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X, Leaf, ImagePlus } from 'lucide-react';
import { toast } from 'react-toastify';
import Breadcrumb from './shared/Breadcrumb';
import Footer from './shared/Footer';
import { usePanchayat } from '../context/PanchayatContext';
import api from '../api/axios';

const complaintTypes = ['Missed Bin', 'Not Segregated', 'Hazardous Waste', 'Civic Issue', 'Other'];

const ComplaintPage = ({ navigate }) => {
    const { selectedPanchayat } = usePanchayat();
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        mobile: user?.mobile || '',
        type: '',
        description: '',
        photo: null,
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.type || !formData.description) {
            toast.error('Please fill in Name, Type and Description.');
            return;
        }
        if (!selectedPanchayat) {
            toast.error('Please select a Panchayat from the header first.');
            return;
        }
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('panchayatId', selectedPanchayat._id);
            formDataToSend.append('reporterName', formData.name);
            formDataToSend.append('reporterMobile', formData.mobile || user?.mobile || 'Unknown');
            formDataToSend.append('type', formData.type);
            formDataToSend.append('description', formData.description);
            if (formData.photo) {
                formDataToSend.append('photo', formData.photo);
            }

            await api.post('/complaints', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Complaint submitted successfully!');
            setSubmitted(true);
            setTimeout(() => navigate(user ? 'household-dashboard' : 'home'), 3500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}>
            <div className="max-w-3xl mx-auto px-4 py-10">
                <Breadcrumb
                    path={[{ label: 'Home', view: 'home' }, { label: 'Submit Complaint', view: null }]}
                    navigate={navigate}
                />

                <AnimatePresence mode="wait">
                    {submitted ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-10 card p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Complaint Submitted!</h2>
                            <p className="text-gray-500 mb-2">Your complaint has been logged and will be reviewed shortly.</p>
                            <p className="text-sm text-green-600 font-medium">Redirecting you…</p>
                            <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 3.5 }}
                                    className="h-1 bg-gradient-to-r from-green-400 to-emerald-500"
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8"
                        >
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
                                    <AlertCircle className="w-7 h-7 text-red-500" />
                                </div>
                                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Submit a Complaint</h1>
                                <p className="text-gray-500">
                                    {selectedPanchayat ? `Filing for ${selectedPanchayat.name}` : 'Help us maintain a cleaner community.'}
                                </p>
                            </div>

                            <div className="card p-8">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                                            <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="input-field" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number</label>
                                            <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="input-field" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Complaint Type *</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {complaintTypes.map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setFormData((p) => ({ ...p, type: t }))}
                                                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                                                        formData.type === t
                                                            ? 'border-green-500 bg-green-50 text-green-700'
                                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                                    }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Describe the issue in detail..."
                                            className="input-field resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Upload Photo (Optional)</label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                                    {formData.photo ? (
                                                        <>
                                                            <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
                                                            <p className="text-sm text-gray-700 font-medium truncate max-w-xs">{formData.photo.name}</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ImagePlus className="w-8 h-8 mb-3 text-gray-400" />
                                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={loading}
                                        className="btn-primary w-full py-3.5 text-base disabled:opacity-60"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </span>
                                        ) : 'Submit Complaint'}
                                    </motion.button>
                                </form>
                            </div>

                            <div className="mt-6 text-center flex items-center justify-center gap-2 text-sm text-gray-400">
                                <Leaf className="w-4 h-4 text-green-400" />
                                Building a cleaner community together
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <Footer navigate={navigate} />
        </div>
    );
};

export default ComplaintPage;
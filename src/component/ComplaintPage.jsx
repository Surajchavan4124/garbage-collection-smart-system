import React, { useState } from 'react';
import { AlertCircle, Leaf } from 'lucide-react';
import Breadcrumb from './shared/Breadcrumb';
import Button from './shared/Button';

const ComplaintPage = ({ navigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: '',
        description: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.type || !formData.description) {
            setError('Please fill in all fields.');
            return;
        }

        setError('');
        console.log("Complaint Submitted:", formData);

        // Simulate submission success
        setSubmitted(true);

        // Reset form
        setFormData({
            name: '',
            email: '',
            type: '',
            description: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100">
            <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">

                <Breadcrumb
                    path={[
                        { label: 'Home', view: 'home' },
                        { label: 'Submit Complaint', view: null }
                    ]}
                    navigate={navigate}
                />

                <div className="max-w-3xl mx-auto mt-12 bg-white rounded-2xl p-10 border border-green-300 shadow-lg">

                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-green-700" />
                    </div>

                    <h1 className="text-3xl font-bold text-center text-green-900 mb-8">
                        Submit a Complaint
                    </h1>

                    {submitted ? (
                        <div className="text-center text-green-700 font-semibold">
                            ✅ Your complaint has been submitted successfully!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {error && (
                                <div className="text-red-600 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                            />

                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                            >
                                <option value="">Select Complaint Type</option>
                                <option value="Missed Collection">Missed Collection</option>
                                <option value="Overflowing Bin">Overflowing Bin</option>
                                <option value="Illegal Dumping">Illegal Dumping</option>
                            </select>

                            <textarea
                                name="description"
                                placeholder="Describe your complaint"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                            />

                            <div className="text-center">
                                <Button
                                    type="submit"
                                    primary={true}
                                    className="px-8 py-3 text-lg"
                                >
                                    Submit Complaint
                                </Button>
                            </div>

                        </form>
                    )}

                </div>

                <div className="text-center mt-10 text-gray-500 flex justify-center items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span>Building a cleaner & greener community together</span>
                </div>

            </div>
        </div>
    );
};

export default ComplaintPage;
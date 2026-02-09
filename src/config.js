// frontend/src/config.js
export const PRIMARY_COLOR = 'green';
export const PRIMARY_DARK = 'green-800';
export const PRIMARY_MEDIUM = 'green-700';
export const PRIMARY_LIGHT = 'green-100';
export const ACCENT_COLOR = 'emerald-600';

export const quickLinks = [
    { name: 'How it works', view: 'howItWorks' },
    { name: 'Submit Complaint', view: 'submitComplaint' },
    { name: 'Statistics', view: 'statisticsReports' },
    { name: 'View Schedule', view: 'viewSchedule' },
    { name: 'Guides / Resources', view: 'guidesResources' },
    { name: 'Events & Workshops', view: 'eventsWorkshops' },
    { name: 'News & Updates', view: 'newsUpdates' },
    { name: 'FAQ’s & Feedback', view: 'faqsFeedback' },
];

export const committeeMembers = [
    { name: 'Dr. Sarah Cole', designation: 'Chairperson', contact: '9999999999' },
    { name: 'Mr. John Davis', designation: 'Vice Chair', contact: '9999999999' },
    { name: 'Ms. Emily Zhao', designation: 'Secretary', contact: '9999999999' },
    { name: 'Mr. Alex Singh', designation: 'Treasurer', contact: '9999999999' },
];

export const contactMembers = [
    { name: 'Asha Verma', designation: 'Chairperson', phone: '+91 99999 99999', email: 'ashaverma@gmail.com' },
    { name: 'Mera Das', designation: 'Secretary', phone: '+91 99999 99999', email: 'meradas@gmail.com' },
    { name: 'Ravi Kumar', designation: 'Manager', phone: '+91 99999 99999', email: 'ravikumar@gmail.com' },
    { name: 'Sanjay Rao', designation: 'Garbage Committee Head', phone: '+91 99999 99999', email: 'sanjayrao@gmail.com' },
];

export const eventsData = new Array(9).fill(0).map((_, i) => ({
    id: i,
    title: i % 3 === 0 ? 'Plantation Drive' : i % 3 === 1 ? 'Community Clean-up' : 'Recycling Workshop',
    description: "The Foundation organized a plantation drive at Mobor, this green initiative witnessed participation from over 50 volunteers.",
    date: '2025-09-13',
    time: '10:00 AM',
    location: 'Mobor Beach',
    participants: '30+',
}));
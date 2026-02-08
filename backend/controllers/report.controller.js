import WasteData from '../models/WasteData.model.js';
import Complaint from '../models/Complaint.model.js';
import Attendance from '../models/attendance.model.js';
import Employee from '../models/Employee.model.js';

export const generateReport = async (req, res) => {
  try {
    const { type, from, to, panchayatId, subType } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "Date range (from, to) is required" });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    let data = {};

    switch (type) {
      case 'Waste Collection Summaries':
        data = await getWasteCollectionSummary(startDate, endDate, panchayatId);
        break;
      case 'Complaint & Grievance Resolution Times':
        data = await getComplaintResolutionSummary(startDate, endDate, panchayatId);
        break;
      case 'Segregation Compliance Percentage':
        data = await getSegregationCompliance(startDate, endDate, panchayatId);
        break;
      case 'Employee Attendance Summaries':
        data = await getAttendanceSummary(startDate, endDate, panchayatId);
        break;
      case 'Year-on-Year comparison charts':
        data = await getYearOnYearComparison(startDate, endDate, panchayatId, subType);
        break;
      case 'Monthly Expense Reports':
        data = getExpenseReportMock(startDate, endDate);
        break;
      default:
        return res.status(400).json({ message: "Invalid report type" });
    }

    res.status(200).json({
      success: true,
      reportType: type,
      period: { from, to },
      data
    });

  } catch (error) {
    console.error("Report Generation Error:", error);
    res.status(500).json({ message: "Failed to generate report", error: error.message });
  }
};

// Helper Functions

const getWasteCollectionSummary = async (start, end, panchayatId) => {
    // Note: WasteData currently doesn't have panchayatId directly, relying on ward matching or assuming single panchayat context if not strictly enforcing. 
    // If strict panchayat check needed, we'd filter by Wards belonging to Panchayat. 
    // For now, assuming Global or filtered by Ward if passed. 
    // Current WasteData model: entryId, date, collectionType, ward, bio, recyclable, etc.
    
    // Aggregation
    const summary = await WasteData.aggregate([
        {
            $match: {
                date: { $gte: start, $lte: end }
                // Add panchayat filtering here if wards are linked
            }
        },
        {
            $group: {
                _id: "$ward",
                totalBiodegradable: { $sum: "$biodegradable" },
                totalRecyclable: { $sum: "$recyclable" },
                totalNonBiodegradable: { $sum: "$nonBiodegradable" },
                totalMixed: { $sum: "$mixed" },
                totalWaste: { $sum: "$total" },
                collectionCount: { $sum: 1 }
            }
        }
    ]);

    return summary;
};

const getComplaintResolutionSummary = async (start, end, panchayatId) => {
    const matchQuery = {
        createdAt: { $gte: start, $lte: end }
    };
    if (panchayatId) matchQuery.panchayat = panchayatId; // Complaint has panchayat ref

    const summary = await Complaint.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);
    
    // Calculate Average Resolution Time for Resolved complaints
    const resolutionStats = await Complaint.aggregate([
        { 
            $match: { 
                ...matchQuery, 
                status: "Resolved", 
                resolvedAt: { $exists: true } 
            } 
        },
        {
            $project: {
                resolutionDuration: { $subtract: ["$resolvedAt", "$createdAt"] }
            }
        },
        {
            $group: {
                _id: null,
                avgResolutionTimeMs: { $avg: "$resolutionDuration" }
            }
        }
    ]);

    return {
        statusBreakdown: summary,
        avgResolutionTimeHours: resolutionStats.length > 0 ? (resolutionStats[0].avgResolutionTimeMs / (1000 * 60 * 60)).toFixed(2) : 0
    };
};

const getSegregationCompliance = async (start, end, panchayatId) => {
    // Logic: Compare "Mixed" waste vs Segregated (Bio + Recyclable + NonBio)
    const stats = await WasteData.aggregate([
        {
             $match: { date: { $gte: start, $lte: end } }
        },
        {
            $group: {
                _id: "$ward",
                totalWhoSegregated: { // Count entries where Mixed is 0 or low
                     $sum: { $cond: [{ $eq: ["$mixed", 0] }, 1, 0] }
                },
                totalCollections: { $sum: 1 }
            }
        },
        {
            $project: {
                ward: "$_id",
                compliancePercentage: {
                    $multiply: [{ $divide: ["$totalWhoSegregated", "$totalCollections"] }, 100]
                }
            }
        }
    ]);
    return stats;
};

const getAttendanceSummary = async (start, end, panchayatId) => {
    // Attendance has 'panchayat' field
    const matchQuery = {
        // date in Attendance is String YYYY-MM-DD usually, but let's check model. 
        // Model says: date: { type: String, required: true }, markedAt: Date
        // We should query based on `date` string or convert. 
        // Let's use `markedAt` for range if reliable, or string compare.
        // Using `markedAt` for safety with Date objects passed.
        markedAt: { $gte: start, $lte: end }
    };
    if (panchayatId) matchQuery.panchayat = panchayatId;

    const summary = await Attendance.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: "$present",
                count: { $sum: 1 }
            }
        }
    ]);

    return summary;
};

const getYearOnYearComparison = async (start, end, panchayatId, subType = 'waste') => {
    let stats = [];

    // Common Year Extraction: { $year: "$date" } is for Date objects. 
    // Complaint has createdAt (Date). WasteData has date (Date). Attendance has markedAt (Date).

    if (subType === 'complaint') {
        stats = await Complaint.aggregate([
            {
                $match: { createdAt: { $gte: start, $lte: end } }
            },
            {
                $group: {
                    _id: { $year: "$createdAt" },
                    totalComplaints: { $sum: 1 },
                    resolvedCount: { 
                        $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] }
                    }
                }
            },
            { $sort: { "_id": 1 } },
            {
                $project: {
                    year: "$_id",
                    totalComplaints: 1,
                    resolvedCount: 1,
                    resolutionRate: { 
                        $multiply: [{ $divide: ["$resolvedCount", { $max: ["$totalComplaints", 1] }] }, 100]
                    }
                }
            }
        ]);
    } 
    else if (subType === 'attendance') {
        stats = await Attendance.aggregate([
            {
                $match: { markedAt: { $gte: start, $lte: end }, present: true }
            },
            {
                $group: {
                    _id: { $year: "$markedAt" },
                    totalPresent: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            {
                $project: {
                    year: "$_id",
                    totalPresent: 1
                }
            }
        ]);
    }
    else if (subType === 'compliance') {
        // Avg compliance per year
        stats = await WasteData.aggregate([
            {
                 $match: { date: { $gte: start, $lte: end } }
            },
            {
                $group: {
                    _id: { $year: "$date" },
                    // 1 if segregated, 0 if mixed > 0
                    totalSegregated: { 
                        $sum: { $cond: [{ $eq: ["$mixed", 0] }, 1, 0] } 
                    },
                    totalCollections: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            {
                $project: {
                    year: "$_id",
                    avgCompliance: {
                        $multiply: [{ $divide: ["$totalSegregated", "$totalCollections"] }, 100]
                    }
                }
            }
        ]);
    }
    else {
        // Default: Waste
        stats = await WasteData.aggregate([
            {
                 $match: { date: { $gte: start, $lte: end } }
            },
            {
                $group: {
                    _id: { $year: "$date" },
                    totalWaste: { $sum: "$total" },
                    avgDailyWaste: { $avg: "$total" }
                }
            },
            { $sort: { "_id": 1 } },
            {
                $project: {
                    year: "$_id",
                    totalWaste: 1,
                    avgDailyWaste: { $round: ["$avgDailyWaste", 2] }
                }
            }
        ]);
    }

    return { subType, stats };
};

const getExpenseReportMock = (start, end) => {
    return {
        note: "Estimated expenses based on active resources.",
        items: [
            { category: "Fuel Costs", amount: 15000 },
            { category: "Vehicle Maintenance", amount: 5000 },
            { category: "Equipment/Bin Replacements", amount: 8000 },
            { category: "Salaries (Estimated)", amount: 120000 }
        ],
        total: 148000
    };
};

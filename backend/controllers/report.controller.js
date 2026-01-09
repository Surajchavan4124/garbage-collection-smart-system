import Dustbin from "../models/Dustbin.model.js";
import Collection from "../models/Collection.model.js";

export const missedCollectionsReport = async (req, res) => {
  const { date } = req.query; // YYYY-MM-DD

  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(targetDate);
  nextDay.setDate(targetDate.getDate() + 1);

  // 1️⃣ All active dustbins
  const dustbins = await Dustbin.find({
    panchayatId: req.user.panchayatId,
    status: "active",
  });

  // 2️⃣ All collections for that day
  const collections = await Collection.find({
    panchayatId: req.user.panchayatId,
    createdAt: { $gte: targetDate, $lt: nextDay },
  }).select("dustbinId");

  const collectedIds = collections.map(c =>
    c.dustbinId.toString()
  );

  // 3️⃣ Missed = dustbins not in collected list
  const missed = dustbins.filter(
    d => !collectedIds.includes(d._id.toString())
  );

  res.json({
    date: targetDate.toISOString().slice(0, 10),
    totalDustbins: dustbins.length,
    collected: collectedIds.length,
    missedCount: missed.length,
    missedDustbins: missed,
  });
};

export const gpsInvalidReport = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const records = await Collection.find({
    panchayatId: req.user.panchayatId,
    gpsValid: false,
    createdAt: { $gte: today },
  })
    .populate("labourId", "name mobile")
    .populate("dustbinId", "code");

  res.json({
    count: records.length,
    records,
  });
};

export const selfieRequiredReport = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const records = await Collection.find({
    panchayatId: req.user.panchayatId,
    selfieRequired: true,
    createdAt: { $gte: today },
  })
    .populate("labourId", "name mobile")
    .populate("dustbinId", "code");

  res.json({
    count: records.length,
    records,
  });
};

export const dailyDashboardSummary = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalScans = await Collection.countDocuments({
    panchayatId: req.user.panchayatId,
    createdAt: { $gte: today },
  });

  const gpsIssues = await Collection.countDocuments({
    panchayatId: req.user.panchayatId,
    gpsValid: false,
    createdAt: { $gte: today },
  });

  const selfieIssues = await Collection.countDocuments({
    panchayatId: req.user.panchayatId,
    selfieRequired: true,
    createdAt: { $gte: today },
  });

  const attendanceCount = await Collection.countDocuments({
    panchayatId: req.user.panchayatId,
    attendanceMarked: true,
    createdAt: { $gte: today },
  });

  res.json({
    totalScans,
    attendanceCount,
    gpsIssues,
    selfieIssues,
  });
};

import Dustbin from "../models/Dustbin.model.js";

export const createDustbin = async (req, res) => {
  const { code, latitude, longitude } = req.body;

  if (!code || latitude == null || longitude == null) {
    return res.status(400).json({ message: "All fields required" });
  }

  const dustbin = await Dustbin.create({
    panchayatId: req.user.panchayatId,
    code,
    latitude,
    longitude,
  });

  res.status(201).json(dustbin);
};

export const listDustbins = async (req, res) => {
  const bins = await Dustbin.find({
    panchayatId: req.user.panchayatId,
    status: "active",
  });

  res.json(bins);
};

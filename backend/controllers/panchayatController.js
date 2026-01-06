import Panchayat from "../models/Panchayat.model.js";

export const registerPanchayat = async (req, res) => {
  const { name, address, contactEmail, contactPhone } = req.body;

  if (!name || !contactPhone) {
    return res.status(400).json({ message: "Name and phone required" });
  }

  const panchayat = await Panchayat.create({
    name,
    address,
    contactEmail,
    contactPhone,
    status: "pending",
  });

  res.status(201).json({
    message: "Registration submitted. Awaiting approval.",
    panchayatId: panchayat._id,
  });
};

export const approvePanchayat = async (req, res) => {
  const { id } = req.params;

  const panchayat = await Panchayat.findById(id);
  if (!panchayat) {
    return res.status(404).json({ message: "Panchayat not found" });
  }

  panchayat.status = "active";
  await panchayat.save();

  res.json({ message: "Panchayat approved" });
};

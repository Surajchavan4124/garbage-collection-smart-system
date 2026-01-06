import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

// @desc    Get all employees (Drivers, Collectors, Supervisors)
// @route   GET /api/users/employees
// @access  Private (Panchayat Admin)
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      panchayatId: req.user.panchayatId,
      role: { $in: ["DRIVER", "COLLECTOR", "SUPERVISOR", "LABOUR"] },
    }).select("-password"); // Exclude password from result

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new employee
// @route   POST /api/users/add-employee
// @access  Private (Panchayat Admin)
export const addEmployee = async (req, res) => {
  try {
    const { name, email, mobile, password, role, ward } = req.body;

    const userExists = await User.findOne({ mobile });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this mobile" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email, // Optional if your model allows
      mobile,
      password: hashedPassword,
      role,
      panchayatId: req.user.panchayatId,
      ward, // Ensure your User model has this field or add it
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      role: user.role,
      mobile: user.mobile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employee (assign ward, update contact)
// @route   PUT /api/users/employees/:id
// @access  Private
export const updateEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.panchayatId.toString() !== req.user.panchayatId.toString()) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Only allow updating specific fields
    user.name = req.body.name || user.name;
    user.mobile = req.body.mobile || user.mobile;
    user.ward = req.body.ward || user.ward; // Update ward assignment
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Deactivate employee
// @route   PUT /api/users/employees/:id/deactivate
// @access  Private
export const deactivateEmployee = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = false;
    await user.save();
    res.json({ message: "Employee deactivated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
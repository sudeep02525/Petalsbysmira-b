import User from "../models/User.js";
import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";
import { sendOtpEmail } from "../utils/emailService.js";

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, phone, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/auth/profile
const getProfile = async (req, res) => {
  res.json(req.user);
};

// @route POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/forgot-password
const forgotPasswordAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required to send OTP." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    admin.resetOtp = otp;
    admin.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await admin.save();
    await sendOtpEmail(admin.email, otp);

    res.json({ message: "OTP sent to your email address." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/admin/reset-password
const resetPasswordAdmin = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(404).json({ message: "Admin account not found." });
    }
    
    if (!admin.resetOtp || admin.resetOtp !== otp || admin.resetOtpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    admin.password = newPassword; // Pre-save hook will hash it
    admin.resetOtp = undefined;
    admin.resetOtpExpiry = undefined;

    await admin.save();

    res.json({ message: "Password reset successful. You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/admin/profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/profile
const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    
    const updatedAdmin = await admin.save();
    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/admin/profile/password
const updateAdminPassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const { currentPassword, newPassword } = req.body;
    
    if (!(await admin.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    admin.password = newPassword; // Pre-save hook will hash it
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser, getProfile, loginAdmin, forgotPasswordAdmin, resetPasswordAdmin, getAdminProfile, updateAdminProfile, updateAdminPassword };

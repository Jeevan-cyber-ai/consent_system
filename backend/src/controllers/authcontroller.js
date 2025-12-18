const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  const { name, email, password, role, linkedin, bio, additionalDetails,
    domain, collegeName, course, description } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  // Capture file info from multer and store a consistent relative path (uploads/<filename>)
  const profileImage = req.files && req.files['image'] ? `uploads/${req.files['image'][0].filename}` : null;
  const resume = req.files && req.files['resume'] ? `uploads/${req.files['resume'][0].filename}` : null;

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "owner",
    linkedin,
    bio,
    profileImage,
    resume,
    additionalDetails,
    domain,
    collegeName,
    course,
    description
  });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  const safeUser = user.toObject();
  delete safeUser.password;

  // make uploaded file paths accessible via full URL (normalize backslashes)
  const host = req.get('host');
  const protocol = req.protocol;
  if (safeUser.profileImage && !safeUser.profileImage.startsWith('http')) {
    const p = safeUser.profileImage.replace(/\\\\/g, '/');
    const clean = p.replace(/^\/+/, '');
    safeUser.profileImage = `${protocol}://${host}/${clean}`;
  }
  if (safeUser.resume && !safeUser.resume.startsWith('http')) {
    const r = safeUser.resume.replace(/\\\\/g, '/');
    const cleanr = r.replace(/^\/+/, '');
    safeUser.resume = `${protocol}://${host}/${cleanr}`;
  }

  res.status(201).json({ message: "Account created with profile vault", token, user: safeUser });
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token
  });
};

exports.getUsers = async (req, res) => {
  const users = await User.find().select("_id name email");
  res.json(users);
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  const host = req.get('host');
  const protocol = req.protocol;
  if (user.profileImage && !user.profileImage.startsWith('http')) {
    user.profileImage = `${protocol}://${host}/${user.profileImage}`;
  }
  if (user.resume && !user.resume.startsWith('http')) {
    user.resume = `${protocol}://${host}/${user.resume}`;
  }
  res.json(user);
};

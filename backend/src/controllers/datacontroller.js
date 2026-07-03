const DataRecord = require("../models/dataRecordModel");
const User = require("../models/userModel");
const auditService = require("../services/auditservice");


exports.getData = async (req, res) => {
  const { ownerId, type } = req.params;

  try {
    // 1. If the requested type is profile, fetch from User collection
    if (type === "profile") {
      const user = await User.findById(ownerId).select("-password"); // Hide password
      if (!user) return res.status(404).json({ message: "User not found" });
      
      return res.json({
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage,
        collegeName: user.collegeName,
        course: user.course,
        dataType: "profile" // Helpful for frontend logic
      });
    }

    // 2. Otherwise, fetch from DataRecord (location, etc.)
    const record = await DataRecord.findOne({
      owner: ownerId,
      dataType: type
    }).sort({ createdAt: -1 });

    if (!record) return res.status(404).json({ message: "No record found" });

    res.json(record.data);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
exports.createData = async (req, res) => {
  const record = await DataRecord.create({
    owner: req.user.id,
    dataType: req.body.dataType,
    data: req.body.data
  });

  res.status(201).json(record);
};
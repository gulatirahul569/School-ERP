const Announcement = require("../models/Announcement");

// ➜ CREATE ANNOUNCEMENT
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, classId } = req.body;

    let type = "global";

    if (classId) type = "class";

    const announcement = await Announcement.create({
      title,
      message,
      classId: classId || null,
      type,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➜ GET ALL ANNOUNCEMENTS (STUDENT VIEW)
exports.getAnnouncements = async (req, res) => {
  try {
    const user = req.user;

    let filter = {
      $or: [
        { type: "global" },
        { classId: user.classId },
      ],
    };

    const announcements = await Announcement.find(filter)
      .populate("createdBy", "name role")
      .populate("classId", "name section")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ➜ DELETE ANNOUNCEMENT (ADMIN ONLY)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    await Announcement.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Announcement deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
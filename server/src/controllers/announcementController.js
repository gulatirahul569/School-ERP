const mongoose = require("mongoose");
const Announcement = require("../models/Announcement");


// =======================
// CREATE ANNOUNCEMENT
// =======================
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, classId } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    let finalClassId = null;
    let type = "global";

    // ✅ SAFE ObjectId conversion
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      finalClassId = new mongoose.Types.ObjectId(classId);
      type = "class";
    }

    const announcement = await Announcement.create({
      title,
      message,
      classId: finalClassId,
      type,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      data: announcement,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================
// GET ALL ANNOUNCEMENTS
// (ADMIN / TEACHER / STUDENT)
// =======================
exports.getAnnouncements = async (req, res) => {
  try {
    const user = req.user;

    let filter = {
      $or: [{ type: "global" }],
    };

    // STUDENT ONLY
    if (user.role === "student" && user.classId) {
      filter.$or.push({
        classId: new mongoose.Types.ObjectId(user.classId),
      });
    }

    // ADMIN / TEACHER SEE EVERYTHING
    if (user.role === "admin" || user.role === "teacher") {
      filter = {}; // show all announcements
    }

    const announcements = await Announcement.find(filter)
      .populate("createdBy", "name role")
      .populate("classId", "name section")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: announcements,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================
// DELETE ANNOUNCEMENT
// =======================
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement id",
      });
    }

    await Announcement.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Announcement deleted",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
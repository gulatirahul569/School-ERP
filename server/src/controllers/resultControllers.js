const Result = require("../models/Result");
const Class = require("../models/Class");

/**
 * Mark or Update Result
 * One document per classId + subject + examType - saving again updates it.
 */
exports.markResult = async (req, res) => {
  try {
    const { classId, subject, examType, maxMarks, records } = req.body;

    if (!classId || !subject || !examType || !records) {
      return res.status(400).json({
        message: "classId, subject, examType and records are required",
      });
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      return res.status(404).json({
        message: "Class not found",
      });
    }

    const existingResult = await Result.findOne({
      classId,
      subject,
      examType,
    });

    if (existingResult) {
      existingResult.maxMarks = maxMarks || existingResult.maxMarks;
      existingResult.records = records;
      existingResult.markedBy = req.user._id;

      await existingResult.save();

      return res.status(200).json({
        success: true,
        message: "Result updated successfully",
        result: existingResult,
      });
    }

    const result = await Result.create({
      classId,
      subject,
      examType,
      maxMarks: maxMarks || 100,
      records,
      markedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Result saved successfully",
      result,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A result for this class, subject and exam already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Result Sheet By Class + Subject + Exam
 * (used by the teacher to load existing marks for editing)
 */
exports.getResultBySheet = async (req, res) => {
  try {
    const { classId, subject, examType } = req.query;

    if (!classId || !subject || !examType) {
      return res.status(400).json({
        message: "classId, subject and examType are required",
      });
    }

    const result = await Result.findOne({
      classId,
      subject,
      examType,
    }).populate("records.student", "name email");

    if (!result) {
      return res.status(200).json({
        success: true,
        records: [],
      });
    }

    return res.status(200).json({
      success: true,
      result,
      records: result.records,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Complete Result History Of A Class
 */
exports.getClassResults = async (req, res) => {
  try {
    const { classId } = req.params;

    const results = await Result.find({ classId })
      .populate("records.student", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Results For Logged In Student
 */
exports.getStudentResults = async (req, res) => {
  try {
    const studentId = req.user._id;

    const results = await Result.find({
      "records.student": studentId,
    })
      .populate("classId", "name section")
      .sort({ createdAt: -1 });

    const formatted = results
      .map((doc) => {
        const record = doc.records.find(
          (r) => r.student.toString() === studentId.toString()
        );

        if (!record) return null;

        return {
          subject: doc.subject,
          examType: doc.examType,
          marksObtained: record.marksObtained,
          maxMarks: doc.maxMarks,
          percentage: Math.round(
            (record.marksObtained / doc.maxMarks) * 100
          ),
          remarks: record.remarks,
          className: doc.classId?.name,
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      results: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
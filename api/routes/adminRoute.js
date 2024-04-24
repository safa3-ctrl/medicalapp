const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Notification = require("../models/notificationModel");

const authMiddleware = require("../middlewares/authMiddleware");
const { connect } = require("mongoose");

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).send({
      message: "Doctors fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post(
  "/change-doctor-account-status",
  authMiddleware,
  async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await Doctor.findByIdAndUpdate(doctorId, {
        status,
      });

      const user = await User.findOne({ _id: doctor.userId });
      const unseenNotifications = user.unseenNotifications;
      unseenNotifications.push({
        type: "new-doctor-request-changed",
        message: `Your doctor account has been ${status}`,
        onClickPath: "/notifications",
      });
      // user.isDoctor = status === "approved" ? true : false;
      await user.save();

      res.status(200).send({
        message: "Doctor status updated successfully",
        success: true,
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  }
);

router.post("/delete-doctor", authMiddleware, async (req, res) => {
  const { doctorId } = req.body;
  const doctor = await Doctor.findByIdAndUpdate(doctorId);
  doctor.delete();
});

router.post("/accept-doctor", authMiddleware, async (req, res) => {
  const { notificationId, doctorId, accept } = req.body;

  const user = await User.findByIdAndUpdate(doctorId, {
    isDoctor: accept ? "accepted" : "declined",
  });
  const doctor = await Doctor.findOne({ doctorId });
  const notification = await Notification.findByIdAndDelete(notificationId);

  if (accept !== true) {
    res.status(200).send({
      message: "Doctor declined",
      success: true,
      data: doctor,
    });
    if (doctor) {
      doctor.delete();
    }else{
      res.status(500).send({
        message: "there is an error",
        success: true,
        data: doctor,
      }); 
    }
  } else {
    res.status(200).send({
      message: "Doctor accepted",
      success: true,
      data: doctor,
    });
  }
});

module.exports = router;

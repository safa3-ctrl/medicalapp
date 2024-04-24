const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");
const hashPassword = require("../utils/hashPassword");
const Notification = require("../models/notificationModel");

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    req.body.password = await hashPassword(req.body.password);

    if (req.body.userType === "isDoctor") {
      const newUser = new User({ ...req.body, isDoctor: true, isAdmin: false });
      await newUser.save();
    } else if (req.body.userType === "isAdmin") {
      const newUser = new User({ ...req.body, isDoctor: false, isAdmin: true });
      await newUser.save();
    } else {
      const newUser = new User({
        ...req.body,
        isDoctor: false,
        isAdmin: false,
      });
      await newUser.save();
    }

    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .send({ message: "Login successful", success: true, data: token });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error logging in", success: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
});

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
  try {
    let datetime = new Date();
    const newDoctor = new Doctor({
      ...req.body,
      feePerCunsultation: 10,
      status: "pending",
    });
    await newDoctor.save();

    const user = User.find({
      _id: req.body.userId,
    });
    await user.updateOne({
      isDoctor: true,
    });
    // admin get notifications
    const admin = await User.findOne({
      name: "admin",
    });
    const newNotification = new Notification({
      userId: admin._id,
      title: "new doctor created",
      content: `${newDoctor.firstName} become a doctor`,
      date: datetime.toString(),
      status: "unseen",
    });
    await newNotification.save();

    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
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
  "/mark-all-notifications-as-seen",
  authMiddleware,
  async (req, res) => {
    try {
      const notification = Notification.find({
        userId: req.body.userId,
      });
      const updateNotification = await notification.updateMany({
        status: "seen",
      });
      res.status(200).send({
        success: true,
        message: "All notifications marked as seen",
        data: updateNotification,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error update notifications",
        success: false,
        error,
      });
    }
  }
);

router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
  try {
    const notification = Notification.find({
      userId: req.body.userId,
    });
    const notificationUpdate = await notification.deleteMany();
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: notificationUpdate,
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

router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
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

router.post("/book-appointment", authMiddleware, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    const doctor = await Doctor.findById(req.body.doctorId);
    if (!doctor) {
      return res
        .status(404)
        .send({ message: "Médecin introuvable", success: false });
    }

    const user = await User.findById(req.body.userId);

    const notfication = new Notification({
      title: "New Appointment",
      userId: doctor.userId,
      content: `Une nouvelle demande de rendez-vous a été faite par ${user.name}`,
      date: `${req.body.date} ${req.body.time}`,
      status: "Unseen",
    });

    await notfication.save();

    res.status(200).send({
      message: "Rendez-vous réservé avec succès",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Erreur lors de la réservation du rendez-vous",
      success: false,
      error: error.message || "Une erreur inconnue s'est produite", // Provide a more user-friendly error message
    });
  }
});

router.post("/check-booking-avilability", authMiddleware, async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Appointments available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error,
    });
  }
});

router.post("/get-appointments-by-user-id", async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    res.status(200).send({
      message: "Appointments fetched successfully",
      success: true,
      data: [appointments],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error,
    });
  }
});

router.post("/get-doctor-info-by-user-id", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ _id: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor info fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error getting doctor info", success: false, error });
  }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      message: "Users fetched successfully",
      success: true,
      data: users,
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

router.get("/get-all-doctors", async (req, res) => {
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

router.post("/get-notifications-by-user", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.body.userId });
    res.status(200).send({
      message: "Notifications fetched successfully",
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error fetching notifications",
      success: false,
      error,
    });
  }
});

module.exports = router;

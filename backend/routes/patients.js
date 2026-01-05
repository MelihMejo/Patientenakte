import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


router.get("/", async (req, res, next) => {
  try {
    const listedParam = req.query.listed;
    const filter = {};
    if (listedParam === undefined) {
      filter.isListed = true;
    } else if (listedParam === "true") {
      filter.isListed = true;
    } else if (listedParam === "false") {
      filter.isListed = false;
    }

    const patients = await Patient.find(filter).sort({ updatedAt: -1 }).limit(200);
    res.json(patients);
  } catch (err) {
    next(err);
  }
});


router.get("/search", async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const listed = req.query.listed;

    if (!q) return res.json([]);

    const regex = new RegExp(escapeRegex(q), "i");
    const filter = {
      $or: [{ patientId: regex }, { firstName: regex }, { lastName: regex }],
    };

    if (listed === "true") filter.isListed = true;
    if (listed === "false") filter.isListed = false;

    const results = await Patient.find(filter).sort({ updatedAt: -1 }).limit(50);
    res.json(results);
  } catch (err) {
    next(err);
  }
});


router.post("/", async (req, res, next) => {
  try {
    const { patientId, firstName, lastName } = req.body;

    if (!patientId || !firstName || !lastName) {
      res.status(400);
      throw new Error("patientId, firstName, lastName are required");
    }

    const existing = await Patient.findOne({ patientId: patientId.trim() });
    if (existing) {
      res.status(409);
      throw new Error("patientId already exists");
    }

    const patient = await Patient.create({
      patientId: patientId.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      isListed: false,
    });

    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
});


router.get("/by-patient-id/:patientId", async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    next(err);
  }
});


router.patch("/by-patient-id/:patientId", async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;

    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    if (firstName !== undefined) patient.firstName = String(firstName).trim();
    if (lastName !== undefined) patient.lastName = String(lastName).trim();

    await patient.save();
    res.json(patient);
  } catch (err) {
    next(err);
  }
});


router.patch("/by-patient-id/:patientId/listed", async (req, res, next) => {
  try {
    const { isListed } = req.body;

    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.patientId },
      { isListed: !!isListed },
      { new: true }
    );

    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    next(err);
  }
});

export default router;

import express from "express";
import Patient from "../models/Patient.js";
import Entry from "../models/Entry.js";

const router = express.Router();


router.get("/patients/:patientId/entries", async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const entries = await Entry.find({ patient: patient._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    next(err);
  }
});


router.post("/patients/:patientId/entries", async (req, res, next) => {
  try {
    const { title, description, type } = req.body;
    if (!title || !description) {
      res.status(400);
      throw new Error("title and description are required");
    }

    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const entry = await Entry.create({
      patient: patient._id,
      title: String(title).trim(),
      description: String(description),
      type: type ? String(type).trim() : "note",
    });

    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

router.put("/entries/:entryId", async (req, res, next) => {
  try {
    const { title, description, type } = req.body;

    const entry = await Entry.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    if (title !== undefined) entry.title = String(title).trim();
    if (description !== undefined) entry.description = String(description);
    if (type !== undefined) entry.type = String(type).trim();

    await entry.save();
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

router.delete("/entries/:entryId", async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    await entry.deleteOne();
    res.json({ message: "Entry deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;

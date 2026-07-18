import mongoose from "mongoose";

const FindingSchema = new mongoose.Schema({
  type: String,
  severity: String, // CRITICAL | HIGH | MEDIUM | LOW
  detail: String,
  fixHint: String,
}, { _id: false });

const ScanSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },
  modules: {
    github: { findings: [FindingSchema], score: Number },
  },
  overallScore: Number,
  previousScore: Number,
});

export default mongoose.models.Scan || mongoose.model("Scan", ScanSchema);
import mongoose from "mongoose";

const FindingSchema = new mongoose.Schema({
  type: String,
  severity: String,
  detail: String,
  fixHint: String,
}, { _id: false });

const DepFindingSchema = new mongoose.Schema({
  type: String,
  package: String,
  version: String,
  vulnId: String,
  severity: String,
  summary: String,
}, { _id: false });

const ScanSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },
  modules: {
    github: { findings: [FindingSchema], score: Number, failed: Boolean },
    deps: { findings: [DepFindingSchema], score: Number, failed: Boolean },
  },
  overallScore: Number,
  previousScore: Number,
});

export default mongoose.models.Scan || mongoose.model("Scan", ScanSchema);
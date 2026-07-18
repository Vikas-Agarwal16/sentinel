import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  githubId: String,
  githubToken: String, // encrypt before save
  lastScanId: mongoose.Schema.Types.ObjectId,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
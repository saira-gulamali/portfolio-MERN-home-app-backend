const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    like: { type: Boolean, default: true },
    notes: { type: [String] },
    archive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favourite", FavouriteSchema);

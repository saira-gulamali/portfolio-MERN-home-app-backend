const mongoose = require("mongoose");
const validator = require("validator"); // using a 3rd party package for validation

const PropertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a property name"],
      trim: true,
      maxLength: [100, "Name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide property price"],
      default: 0,
    },
    location: {
      type: String,
      required: [true, "Please provide property location"],
      maxLength: [40, "Location cannot be more than 40 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide property description"],
      maxLength: [1000, "Description cannot be more than 1000 characters"],
    },
    image: {
      type: String,
      default: "/uploads/example.jpg",
    },
    category: {
      type: String,
      required: [true, "Please state if property is for sale or rent"],

      enum: ["sale", "rent"],
    },

    garden: {
      type: Boolean,
      required: [true, "Please state if property has a garden"],
      default: false,
    },
    bedrooms: {
      type: Number,
      required: [true, "Please state number of bedrooms"],
      default: 1,
    },

    status: {
      type: String,
      required: [true, "Please state if property is active or archived"],
      default: "active",
      enum: ["active", "archive"],
    },

    agent: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, //set up the model to accept virtuals
  }
);

// ProductSchema.virtual(
//   "reviews", //name maps to what populate method calls in the controller
//   {
//     ref: "Review",
//     localField: "_id",
//     foreignField: "product",
//     justOne: false,
//     //match: { rating: 1 },//to only show docs where rating ===1
//   }
// );

// ProductSchema.pre("remove", async function () {
//   await this.model("Review").deleteMany({ product: this._id });
// });

module.exports = mongoose.model("Property", PropertySchema);

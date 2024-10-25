const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  getAllProperties,
  getSingleProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

router
  .route("/")
  .get(authenticateUser, getAllProperties)
  .post(authenticateUser, authorizePermissions("agent"), createProperty);

router
  .route("/:propertyId")
  .get(authenticateUser, getSingleProperty)

  .patch(authenticateUser, authorizePermissions("agent"), updateProperty)
  .delete(authenticateUser, authorizePermissions("agent"), deleteProperty);

module.exports = router;

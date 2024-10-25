const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  getAllFavourites,
  getSingleFavourite,
  createFavourite,
  updateFavourite,
  deleteFavourite,
} = require("../controllers/favouriteController");

router.route("/").get(authenticateUser, getAllFavourites);

router
  .route("/:propertyId")
  .get(authenticateUser, getSingleFavourite)
  .post(authenticateUser, createFavourite)
  .patch(authenticateUser, updateFavourite)
  .delete(authenticateUser, deleteFavourite);

module.exports = router;

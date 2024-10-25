const User = require("../models/User");
const Property = require("../models/Property");
const Favourite = require("../models/Favourite");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

// route to favourite is /api/v1/favourites/:propertyId

const getAllFavourites = async (req, res) => {
  const { userId } = req.user;
  const favourites = await Favourite.find({ user: userId });

  res.status(StatusCodes.OK).json({ favourites, count: favourites.length });
};

const getSingleFavourite = async (req, res) => {
  res.send("get single favourite");
};

const createFavourite = async (req, res) => {
  console.log(req.user.userId);

  const { userId } = req.user;
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId);

  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  //   // Check if this property is already favourited by this user
  const existingFavourite = await Favourite.findOne({
    user: userId,
    property: property._id,
  });

  if (existingFavourite) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Property already in favorites" });
  }

  const favourite = new Favourite({
    user: userId,
    property: property._id,
  });

  await favourite.save();
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Property added to favourites", favourite });
};

const updateFavourite = async (req, res) => {
  // 1 add a note
  // 2 unlike property - default like
  //3 readd a like
  // 4 archive a fav
  // req.body: like (t/f) notes (string) archive (t/f)

  const { like, notes, archive } = req.body;
  const { userId } = req.user;
  const { propertyId } = req.params;

  console.log(req.body);
  console.log(req.user);

  //add/remove likes but keep notes
  // or archive and keep notes

  const favourite = await Favourite.findOneAndUpdate(
    { user: userId, property: propertyId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!favourite) {
    throw new NotFoundError(`No favourite with id ${propertyId} and ${userId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "favourite updated", favourite });
};
const deleteFavourite = async (req, res) => {
  const { userId } = req.user;
  const { propertyId } = req.params;

  const favourite = await Favourite.findOneAndRemove({
    user: userId,
    property: propertyId,
  });
  if (!favourite) {
    throw new NotFoundError(`No favourite with id ${propertyId} and ${userId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "favourite deleted", favourite });
};

module.exports = {
  getAllFavourites,
  getSingleFavourite,
  createFavourite,
  updateFavourite,
  deleteFavourite,
};

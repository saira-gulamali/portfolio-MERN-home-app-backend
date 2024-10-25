const Property = require("../models/Property");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

// const getAllPropertiesStatic = async (req, res) => {
//   // to do
//   // add filters/search

//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 10;
//   const skip = (page - 1) * limit;
//   const search = req.query.search;

//   const properties = await Property.find({
//     location: { $regex: search, $options: "i" },
//     price: { $gt: 100000, $lt: 10000000 },
//   })
//     .sort("price")
//     .select("name location price")
//     .limit(limit)
//     .skip(skip);

//   res.status(StatusCodes.OK).json({ count: properties.length, properties });
// };

const getAllProperties = async (req, res) => {
  console.log(req.query);

  const {
    category,
    location,
    minPrice,
    maxPrice,
    garden,
    bedrooms,
    sort,
    fields,
  } = req.query;
  const queryObject = {};

  if (category) {
    queryObject.category = category;
  }
  if (location) {
    queryObject.location = { $regex: location, $options: "i" };
  }

  if (minPrice || maxPrice) {
    queryObject.price = {
      $gte: minPrice ? Number(minPrice) : 0,
      $lte: maxPrice ? Number(maxPrice) : 10000000,
    };
  }

  if (garden !== undefined) {
    queryObject.garden = garden;
  }
  if (bedrooms) {
    queryObject.bedrooms = {
      $gte: bedrooms,
    };
  }

  console.log({ queryObject });

  let result = Property.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("-createdAt");
  }

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const properties = await result;
  res.status(200).json({ count: properties.length, properties });
};

const getSingleProperty = async (req, res) => {
  const { propertyId } = req.params;

  const property = await Property.findOne({ _id: propertyId });

  if (!property) {
    throw new CustomError.NotFoundError(
      `No property found with id: ${propertyId}`
    );
  }

  res.status(StatusCodes.OK).json({ property });
};

const createProperty = async (req, res) => {
  const property = await Property.create(req.body);

  res.status(StatusCodes.CREATED).json({ msg: "Property created", property });
};

const updateProperty = async (req, res) => {
  const { propertyId } = req.params;
  const { userId } = req.user;

  // includes status>archive functionality

  const property = await Property.findOneAndUpdate(
    {
      _id: propertyId,
      agent: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!property) {
    throw new CustomError.NotFoundError(
      `No property exists with id: ${propertyId}. Check property exists and permissions.`
    );
  }

  // check user is agent who created property
  // checkPermissions(req.user, property.createdBy);

  // property.name = name;
  // property.price = price;
  // property.location = location;
  // property.description = description;
  // property.image = image;
  // property.category = category;
  // property.garden = garden;
  // property.bedrooms = bedrooms;
  // property.status = status;

  // await property.save();

  res.status(StatusCodes.OK).json({ msg: "property updated", property });
};

const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;
  const { userId } = req.user;

  const property = await Property.findByIdAndRemove({
    _id: propertyId,
    agent: userId,
  });
  if (!property) {
    throw new NotFoundError(
      `No property with id ${propertyId}. Check property and permissions.`
    );
  }
  res.status(StatusCodes.OK).json({ msg: "property deleted", property });
};

module.exports = {
  getAllProperties,
  getSingleProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};

// update body json
// "name":"beautiful terrace",
//     "price":1000000,
//     "location": "Brazil",
//       "description": "Beautiful terraced property facing beach",
//         "image": "image.jpg",
//         "category": "sale",
//         "garage": true,
//         "garden": true,
//         "bedrooms": 10,
//         "bathrooms": 20,
//         "status": "active"

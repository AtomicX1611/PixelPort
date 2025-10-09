import mongoose from "mongoose";
import Place from "../model/place.js";
import User from "../model/user.js";
import fs from "fs";

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    return next(err);
  }

  if (!place) {
    const error = new Error("Could not find a place with the given id");
    return next(error);
  }

  res.json({ message: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const UserId = req.params.uid;

  console.log("Called getPlacesByUserId");
  let places;
  try {
    places = await Place.find({ creatorID: UserId });
  } catch {
    const error = new Error("Could not find plces with User id");
    return next(error);
  }

  res.status(200).json({ places: places });
};

const createPlace = async (req, res, next) => {
  const { pid, title, desc, address, creatorID } = req.body;
  console.log("File path : ", req.file);

  if (!req.file) {
    const error = new Error("No image file provided");
    return next(error);
  }

  let location;
  try {
    location = JSON.parse(req.body.location);
  } catch (error) {
    return next(new Error("Invalid location data"));
  }

  console.log("Creating Place called, body : ", req.body);
  const createdPlace = new Place({
    pid,
    title,
    desc,
    address,
    creatorID,
    imageUrl: req.file.path,
    location,
  });

  let user;
  try {
    user = await User.findById(creatorID);
  } catch {
    const error = new Error("Could not find user with given id");
    return next(error);
  }
  console.log("Found user");
  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.log(error.message);
    const err = new Error("Error occurred");
    return next(err);
  }

  res.json({ message: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const placeID = req.params.pid;
  const { title, desc } = req.body;

  console.log("Updating Place");
  let place;
  try {
    place = await Place.findById(placeID);
  } catch {
    const error = new Error("Could not load place with given id");
    return next(error);
  }

  if (place.creatorID !== req.userData.userId) {
    return next(new Error("Your not allowed to edit this place"));
  }

  place.title = title;
  place.desc = desc;

  try {
    await place.save();
    console.log("Updating Place done");
  } catch (err) {
    const error = new Error("Could not save place");
    console.log("Error Occurred : ", err);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeID = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeID).populate("creatorID");
  } catch (err) {
    const error = new Error("Could not load place with given id");
    return next(error);
  }

  if (!place) {
    return next(new Error("Place not found"));
  }

  if (place.creatorID !== req.userData.userId) {
    return next(new Error("Your not allowed to delete this place"));
  }

  try {
    const imagePath = place.imageUrl;
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creatorID.places.pull(place);
    await place.creatorID.save({ session: sess });
    await sess.commitTransaction();

    // Delete the image file
    fs.unlink(imagePath, err => {
      if (err) {
        console.log("Error deleting image file:", err);
      }
    });
  } catch (err) {
    console.log("Error during delete:", err);
    const error = new Error("Could not remove place");
    return next(error);
  }
  res.status(200).json({ message: "Deleted place successfully" });
};

const getAllImages = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skipIndex = (page - 1) * limit;

  try {
    console.log('Fetching places with pagination:', { page, limit, skipIndex });
    
    const places = await Place.find()
      .select('title desc imageUrl creatorID')
      .populate('creatorID')
      .sort({ _id: -1 })
      .skip(skipIndex)
      .limit(limit);

    const totalPlaces = await Place.countDocuments();
    const hasMore = skipIndex + places.length < totalPlaces;

    console.log('Found places:', places.length);
    console.log('Sample place:', places[0]);
    
    const images = places.map(place => ({
      id: place._id,
      title: place.title || '',
      description: place.desc || '',
      path: place.imageUrl || '',
      creator: place.creatorID ? {
        id: place.creatorID._id,
        name: place.creatorID.name || 'Unknown',
        image: place.creatorID.image || ''
      } : null
    }));

    console.log('Processed images:', images.length);
    
    return res.json({
      images,
      currentPage: page,
      totalPages: Math.ceil(totalPlaces / limit),
      hasMore: hasMore,
      totalImages: totalPlaces
    });

  } catch (error) {
    console.error('Error in getAllImages:', error);
    return next(new Error("Couldn't get images: " + error.message));
  }
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
  getAllImages
};

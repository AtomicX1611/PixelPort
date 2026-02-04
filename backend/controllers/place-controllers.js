import mongoose from "mongoose";
import Place from "../model/place.js";
import User from "../model/user.js";
import fs from "fs";
import HttpError from "../util/http-error.js";

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
    return next(new HttpError("Error loading place", 500));
  }

  if (!place) {
    return next(new HttpError("Could not find a place with the given id", 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const UserId = req.params.uid;

  console.log("Called getPlacesByUserId");
  let places;
  try {
    places = await Place.find({ creatorID: UserId });
  } catch (err) {
    console.log("Error fetching places by user:", err.message);
    return next(new HttpError("Could not find places for this user", 500));
  }

  if (!places || places.length === 0) {
    return next(new HttpError("No places found for this user", 404));
  }

  res.status(200).json({ places: places });
};

const createPlace = async (req, res, next) => {
  const { pid, title, desc, address } = req.body;
  console.log("File path : ", req.file);

  if (!req.userData?.userId) {
    return next(new HttpError("Authentication required", 401));
  }

  if (!req.file) {
    return next(new HttpError("No image file provided", 400));
  }

  let location;
  try {
    location = JSON.parse(req.body.location);
  } catch (error) {
    return next(new HttpError("Invalid location data", 400));
  }

  console.log("Creating Place called, body : ", req.body);
  const createdPlace = new Place({
    pid,
    title,
    desc,
    address,
    creatorID: req.userData.userId,
    imageUrl: req.file.path,
    location,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch {
    return next(new HttpError("Could not find user with given id", 404));
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
    return next(new HttpError("Error occurred while saving place", 500));
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const placeID = req.params.pid;
  const { title, desc } = req.body;

  console.log("Updating Place");
  let place;
  try {
    place = await Place.findById(placeID);
  } catch {
    return next(new HttpError("Could not load place with given id", 500));
  }

  if (!place) {
    return next(new HttpError("Place not found", 404));
  }

  const creatorId = place.creatorID?.id || place.creatorID?.toString();
  if (creatorId !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this place", 403));
  }

  place.title = title;
  place.desc = desc;

  try {
    await place.save();
    console.log("Updating Place done");
  } catch (err) {
    console.log("Error Occurred : ", err);
    return next(new HttpError("Could not save place", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeID = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeID).populate("creatorID");
  } catch (err) {
    return next(new HttpError("Could not load place with given id", 500));
  }

  if (!place) {
    return next(new HttpError("Place not found", 404));
  }

  const creatorId = place.creatorID?.id || place.creatorID?.toString();
  if (creatorId !== req.userData.userId) {
    return next(new HttpError("You are not allowed to delete this place", 403));
  }

  try {
    const imagePath = place.imageUrl;
    const sess = await mongoose.startSession();
    await sess.startTransaction();
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
    return next(new HttpError("Could not remove place", 500));
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
    if (places[0]) {
      console.log('Sample place:', places[0]._id);
    }
    
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
    return next(new HttpError("Couldn't get images: " + error.message, 500));
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

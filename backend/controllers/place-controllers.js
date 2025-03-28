import mongoose from "mongoose";
import Place from "../model/place.js";
import User from "../model/user.js";

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
  const { pid, title, desc, address, creatorID} = req.body;
  console.log("File path : ", req.file);

  const location = JSON.parse(req.body.location);

  console.log("Creating Place called,body : ", req.body);
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
    place = await Place.findById(placeID).populate("createrID");
  } catch {
    const error = new Error("Could not load place with given id");
    return next(error);
  }

  if (place.creatorID !== req.userData.userId) {
    return next(new Error("Your not allowed to delete this place"));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    place.remove({ session: sess });
    place.creatorID.places.pull(place);
    place.creatorID.places.save({ session: sess });
    sess.commitTransaction();
  } catch {
    const error = new Error("Could not remove place");
    return next(error);
  }
  res.status(200).json({ message: "Deleted place successfully" });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};

import mongoose from "mongoose";
import Place from "../model/place.js";
import User from "../model/user.js";
import fs from "fs";
import HttpError from "../util/http-error.js";
import { getCache, setCache, deleteCacheByPrefix } from "../util/cache.js";

// Helper to shape post responses consistently for Explore/listing pages
const buildPostsResponse = (places, page, limit, totalPlaces) => {
  const hasMore = (page - 1) * limit + places.length < totalPlaces;
  const posts = places.map(place => {
    const imgs = place.images || (place.imageUrl ? [place.imageUrl] : []);
    return {
      id: place._id,
      title: place.title || '',
      description: place.desc || '',
      thumbnail: imgs[0] || '',
      imageCount: imgs.length,
      address: place.address || '',
      creator: place.creatorID ? {
        id: place.creatorID._id,
        name: place.creatorID.name || 'Unknown',
        image: place.creatorID.image || ''
      } : null
    };
  });

  return {
    posts,
    currentPage: page,
    totalPages: Math.ceil(totalPlaces / limit),
    hasMore,
    totalPosts: totalPlaces
  };
};

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  const cacheKey = `place:${placeId}`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json({ place: cached });
  }

  let place;
  try {
    place = await Place.findById(placeId)
      .populate('creatorID', 'name image')
      .lean({ virtuals: true, getters: true });
  } catch (err) {
    return next(new HttpError("Error loading place", 500));
  }

  if (!place) {
    return next(new HttpError("Could not find a place with the given id", 404));
  }

  // Normalize legacy single-image docs
  if (!place.images || place.images.length === 0) {
    if (place.imageUrl) place.images = [place.imageUrl];
    else place.images = [];
  }

  await setCache(cacheKey, place);
  res.json({ place });
};

const getPlacesByUserId = async (req, res, next) => {
  const UserId = req.params.uid;
  const cacheKey = `user:${UserId}:places`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.status(200).json({ places: cached });
  }

  let places;
  try {
    places = await Place.find({ creatorID: UserId }).lean({ virtuals: true, getters: true });
  } catch (err) {
    return next(new HttpError("Could not find places for this user", 500));
  }

  if (!places || places.length === 0) {
    await setCache(cacheKey, []);
    return res.status(200).json({ places: [] });
  }

  await setCache(cacheKey, places);
  res.status(200).json({ places });
};

const createPlace = async (req, res, next) => {
  const { pid, title, desc, address } = req.body;

  if (!req.userData?.userId) {
    return next(new HttpError("Authentication required", 401));
  }

  if (!req.files || req.files.length === 0) {
    return next(new HttpError("At least one image is required", 400));
  }

  let location;
  try {
    location = JSON.parse(req.body.location);
  } catch (error) {
    return next(new HttpError("Invalid location data", 400));
  }

  const imagePaths = req.files.map(f => f.path.replace(/\\/g, '/'));

  const createdPlace = new Place({
    pid,
    title,
    desc,
    address,
    creatorID: req.userData.userId,
    images: imagePaths,
    location,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch {
    return next(new HttpError("Could not find user with given id", 404));
  }

  if (!user) {
    return next(new HttpError("Could not find user with given id", 404));
  }

  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.error("Error saving place:", error);
    return next(new HttpError("Error occurred while saving place", 500));
  }

  await deleteCacheByPrefix(`user:${req.userData.userId}:places`);
  await deleteCacheByPrefix("images:");
  await deleteCacheByPrefix("place:");
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const placeID = req.params.pid;
  const { title, desc } = req.body;

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
  } catch (err) {
    return next(new HttpError("Could not save place", 500));
  }

  const serialized = place.toObject({ getters: true });
  await setCache(`place:${placeID}`, serialized);
  await deleteCacheByPrefix(`user:${creatorId}:places`);
  await deleteCacheByPrefix("images:");
  res.status(200).json({ place: serialized });
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
    const imagePaths = place.images || (place.imageUrl ? [place.imageUrl] : []);
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creatorID.places.pull(place);
    await place.creatorID.save({ session: sess });
    await sess.commitTransaction();

    // Delete all image files
    for (const imgPath of imagePaths) {
      fs.unlink(imgPath, err => {
        if (err) console.error("Error deleting image file:", err);
      });
    }
  } catch (err) {
    return next(new HttpError("Could not remove place", 500));
  }
  await deleteCacheByPrefix(`place:${placeID}`);
  await deleteCacheByPrefix(`user:${creatorId}:places`);
  await deleteCacheByPrefix("images:");
  res.status(200).json({ message: "Deleted place successfully" });
};

const getAllImages = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const search = req.query.search ? req.query.search.trim() : '';
  const skipIndex = (page - 1) * limit;
  const cacheKey = `images:page=${page}:limit=${limit}:search=${search}`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const filter = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const places = await Place.find(filter)
      .select('title desc images creatorID address')
      .populate('creatorID', 'name image')
      .sort({ _id: -1 })
      .skip(skipIndex)
      .limit(limit)
      .lean({ virtuals: true, getters: true });

    const totalPlaces = await Place.countDocuments(filter);
    const response = buildPostsResponse(places, page, limit, totalPlaces);

    await setCache(cacheKey, response, 120);
    return res.json(response);
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
  getAllImages,
};

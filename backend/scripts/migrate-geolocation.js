/**
 * One-time migration script: populate `geoLocation` GeoJSON field
 * from the existing `location.lat` / `location.lng` on all Place documents.
 *
 * Run once:   node scripts/migrate-geolocation.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Place from "../model/place.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    const places = await Place.find({
      "location.lat": { $exists: true },
      "location.lng": { $exists: true },
    });

    console.log(`Found ${places.length} places to migrate`);

    let updated = 0;
    for (const place of places) {
      if (
        place.location &&
        place.location.lat != null &&
        place.location.lng != null
      ) {
        place.geoLocation = {
          type: "Point",
          coordinates: [place.location.lng, place.location.lat],
        };
        await place.save();
        updated++;
      }
    }

    console.log(`Successfully migrated ${updated} places`);
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
};

run();

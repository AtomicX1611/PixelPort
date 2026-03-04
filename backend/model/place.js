import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const placeSchema = new Schema({
  pid : {type : String , required : false, default: () => uuidv4()},
  title: { type: String, required: true },
  desc : {type : String,required : true},
  images : [{ type: String }],
  address : {type : String,required : true},
  location : {
    lat : {type : Number,required : true},
    lng : {type : Number,required : true},
  },
  geoLocation : {
    type : { type: String, enum: ['Point'], default: 'Point' },
    coordinates : { type: [Number], default: [0, 0] },  // [lng, lat]
  },
  creatorID : {type : mongoose.Types.ObjectId ,required : true , ref : 'User'},
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Auto-populate geoLocation from location before saving
placeSchema.pre('save', function(next) {
  if (this.location && this.location.lat != null && this.location.lng != null) {
    this.geoLocation = {
      type: 'Point',
      coordinates: [this.location.lng, this.location.lat],
    };
  }
  next();
});

placeSchema.virtual('imageUrl').get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : '';
});

placeSchema.index({ creatorID: 1, _id: -1 });
placeSchema.index({ createdAt: -1 });
placeSchema.index({ geoLocation: '2dsphere' });

const schema = mongoose.model('Place',placeSchema)

export default schema
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
  creatorID : {type : mongoose.Types.ObjectId ,required : true , ref : 'User'},
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual for backward compatibility — returns first image
placeSchema.virtual('imageUrl').get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : '';
});

// Optimized indexes for common queries
placeSchema.index({ creatorID: 1, _id: -1 }); // speeds user-specific lists + reverse sort
placeSchema.index({ createdAt: -1 }); // speeds recent-first sorts

const schema = mongoose.model('Place',placeSchema)

export default schema
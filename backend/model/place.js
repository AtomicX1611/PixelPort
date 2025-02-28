import mongoose, { Schema } from "mongoose";

const placeSchema = new Schema({
  pid : {type : String , required : true},
  title: { type: String, require: true },
  desc : {type : String,required : true},
  imageUrl :{type : String,required : true},
  address : {type : String,required : true},
  location : {
    lat : {type : Number,required : true},
    lng : {type : Number,required : true},
  },
  creatorID : {type : mongoose.Types.ObjectId ,required : true , ref : 'User'},
});

const schema = mongoose.model('Place',placeSchema)

export default schema
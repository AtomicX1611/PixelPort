import mongoose, { Schema } from "mongoose";

const User = new Schema(
    {
          name : {type : String , required : true},
          email : {type : String , required : true, unique : true},
          password : {type : String , required : true},
          image : {type : String , required : true},
          places : [{type : mongoose.Types.ObjectId ,required : true , ref : 'Place'}],
          createdAt: { type: Date, default: Date.now }
    }
)

// Indexes to speed lookups and recent-user sorting
User.index({ email: 1 }, { unique: true });
User.index({ createdAt: -1 });

export default mongoose.model('User',User);
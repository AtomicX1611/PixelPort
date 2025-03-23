import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const User = new Schema(
    {
          name : {type : String , required : true},
          email : {type : String , required : true, unique : true},
          password : {type : String , required : true},
          image : {type : String , required : true},
          places : [{type : mongoose.Types.ObjectId ,required : true , ref : 'Place'}]
    }
)

User.plugin(uniqueValidator)

export default mongoose.model('User',User);
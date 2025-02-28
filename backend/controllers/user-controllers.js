import User from "../model/user.js";

const getAllUsers = async (req, res, next) => {

  let users;
  
  try {
    users = await User.find({})
    console.log("Retrieved all users") 
  } catch {
    const error = new Error("Couldnt get users");
    return next(error);
  }
  
  res.json({ message: users});

};

const signUpUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  let checkUser;

  try {
    checkUser = await User.findOne({ email: email });
  } catch {
    const error = new Error("Something went wrong");
    return next(error);
  }

  if (checkUser) {
    const error = new Error("Email already Used");
    return next(error);
  }

  const user = new User({
    name,
    email,
    password,
  });

  await user.save();
  res.json({ message: user });
};

const loginUser = async (req, res, next) => {
   const {email,password} = req.body;

   if(!email || !password){
     res.json({message : "Email and Password cannot be empty"})
   }
   console.log("Request Body:", req.body); 
   let user;
   try {
    user = await User.findOne({email : email})
   } catch{
    const err = new Error("Couldnt find User")
    return next(err)
   }
   
   if(!user){
      return res.status(404).json({message : "User not in database : ",user})
   }

   console.log("User accessed : ",user)
   res.json({message : "User logged in",user})
};

export { getAllUsers, signUpUser, loginUser };

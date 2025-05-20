import User from "../models/user.model.js";
import { createToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signUp = async (req, res) => {
  // res.send("signup route");

  const { fullName, email, password } = req.body;

  try {
    // hash password
    // 12345 => rwuerowuerowueoiru

    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required!!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters!!" });
    }
    //  To check if email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new User
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      //    generate jwt token
      createToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const login = async (req, res) => {
//   //   res.send("login route");
//   try {
//     // const { email, password } = req.body;
//     console.log("email, password", email,password)
//     const user = await User.findOne({ email });

//     if (!user) {
//       res.status(400).json({ message: "Invalid Credentials!!" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);

//     if (!isPasswordCorrect) {
//       res.status(400).json({ message: "Invalid Credentials!!" });
//     }

//     createToken(user._id, res);
//     res.status(200).json({
//       _id: user._id,
//       fullName: user.fullName,
//       email: user.email,
//       profilePic: user.profilePic,
//     });
//   } catch (error) {
//     console.log("Error in loggin Controller", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    createToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  //   res.send("logout route");
  try {
    res.cookie("jwt", "", { maxAGE: 0 });
    res.status(200).json({ message: "Logout Successfully!!" });
  } catch (error) {
    console.log("Error in logout Controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req,res) =>{
try {
    const {profilePic} = req.body
    const userId = req.user._id 

    if(!profilePic){
        return res.status(400).json({message:"Profile Pic is required!!"});

    }
    const uploadResponse =  await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url},{new:true})

    res.status(200).json(updatedUser)


} catch (error) {
    console.log("error in update profile:", error.message)
    res.status(500).json({message:"Internal Server Error"})

}
}

export const checkAuth = (req,res)=>{
try {
    res.status(200).json(req.user)
} catch (error) {
    console.log("Error in checkAuth controller", error.message)
    res.status(500).json({message:"Internal Server Error"})
    
}
}
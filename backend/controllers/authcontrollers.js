import User from "../models/userModels.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const login =  async(req,res) => {

    try{
        const {username , password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error : "Invalid Username or Password"});
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id : user._id,
            fullName : user.fullName,
            username : user.username,
            profilePic : user.profilePic
        });

    }catch(err){
        console.log("error from login :",err.message);
        res.status(500).json({err : "Internal Server Error : {login}"})
    }
}


// ------sign up -------------

export const signup = async(req,res) => {
    
    try {   
        const {fullName , username, password, confirmPassword, gender} = req.body; 

        if(password !== confirmPassword){
            return res.status(400).json({error : "Passwords don't match"})
        }

        const user = await User.findOne({username});
        if(user) {
            return res.status(400).json({error : "Username already exists !!!"})
        }
        
        // Hash the password 
        const salt = await bcryptjs.genSalt(10);
        const hashedPassoword = await bcryptjs.hash(password,salt)
        // 

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;

        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User ({
            fullName, 
            username,
            password:hashedPassoword,
            gender ,
            profilePic : gender ==="male" ? boyProfilePic : girlProfilePic 
        });

        if(newUser){

                // Generate JWT TOKEN --------
                 generateTokenAndSetCookie(newUser._id , res);
                //

             await newUser.save();

            res.status(201).json({
            _id : newUser._id,
            fullName : newUser.fullName,
            username : newUser.username,
            profilePic : newUser.profilePic
        })
    }else {
        res.status(400).json({error : "Invalid User Data "})
    }


    }catch(err) {
        console.log("error from sigup :",err.message);
        res.status(500).json({err : "Internal Server Error : {signup}"})
    }
    // res.send("Sign up Route");
}

export const logout = async(req,res) => {
   try {;

    res.cookie("jwt", "", {maxAge : 0});
    res.status(200).json({message: "Logged out successfully"});

   } catch (error) {
    console.log("error from logout :",err.message);
    res.status(500).json({err : "Internal Server Error : {logout}",error})
   }
}


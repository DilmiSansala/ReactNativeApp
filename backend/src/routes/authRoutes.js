import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const generateToken  = (userId)=> {
       return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '15d'});
};

router.post('/register', async(req, res) => {
   try{
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({msg: "Please enter all fields"});
    }
    if(password.length < 6){
        return res.status(400).json({msg: "Password must be at least 6 characters"});
    }
    if(username.length < 3){
        return res.status(400).json({msg: "Username must be at least 3 characters"});
    }
    const existingEmail = await User.findOne({email});
    if(existingEmail){
        return res.status(400).json({msg: "User already exists"});
    }
    const existingUsername = await User.findOne({username});
    if (existingUsername){
        return res.status(400).json({msg: "User already exists"});
    }
    //get random avatar
    const profileImage = 'https://api.dicebear.com/9.x/avataaars/svg?seed=${username}';
    const user = new User({
        email,
        username,
        password,
        profileImage
        
    });
    await user.save();
    
    const token = generateToken(username._id);
    res.status(201).json({
        token, 
        user: {
               _id: user._id,
                username: user.username,
               email: user.email,
                profileImage: user.profileImage
        }
    });
    
   }catch(error){
       console.error(error);
       res.status(500).json({msg: "Server error"});
   }
});
router.post('/login', async(req, res) => {
    res.send("login");
});

export default router;
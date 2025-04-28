import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

 
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, country } = req.body;


  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

   
  const user = await User.create({
    name,
    email,
    password,
    country,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      country: user.country,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

 
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

   const user = await User.findOne({ email });

   if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      country: user.country,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

 
export const getUserProfile = asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      country: user.country,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
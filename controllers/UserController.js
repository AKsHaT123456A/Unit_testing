import UserModel from "../models/userModel.js";

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

// Follow a User
export const followUser = async (req, res) => {
  const id = req.params.id;
  const userId  = req.user.id;
  console.log(id, userId)
  if (userId == id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(userId);

      if (!followUser.followers.includes(userId)) {
        await followUser.updateOne({ $push: { followers: userId } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("you are already following this id");
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
};

// Unfollow a User
export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const userId  = req.user.id;

  if(userId === id)
  {
    res.status(403).json("Action Forbidden")
  }
  else{
    try {
      const unFollowUser = await UserModel.findById(id)
      const unFollowingUser = await UserModel.findById(userId)

      if (unFollowUser.followers.includes(userId))
      {
        await unFollowUser.updateOne({$pull : {followers: userId}})
        await unFollowingUser.updateOne({$pull : {following: id}})
        res.status(200).json("User Unfollowed")
      }
      else{
        res.status(403).json("You are not following this User")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
};

// Get a User
export const getUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await UserModel.findById(id);
   const following = user.following.length;
    const followers = user.followers.length;
    if (user) {
      res.status(200).json({"username": user.username,"followers": followers,"following": following});
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

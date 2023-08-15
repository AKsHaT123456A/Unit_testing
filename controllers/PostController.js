import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";

// creating a post

export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    if (!req.body.title) return res.status(400).json("Title is Missing");
    await newPost.save();
    const { likes, likesCount, comments, updatedAt, __v, ...otherDetails } = newPost._doc;
    res.status(200).json(otherDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    const comments = post.comments.length;
    if (!post) return res.status(404).json("Post not found");
    res.status(200).json({ "_id": post._id, "title": post.title, "desc": post.desc, "likes": post.likesCount, "comments": comments });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// delete a post
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// like a post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const post = await PostModel.findById(id);
    if (post.likes.includes(userId)) {
      return res.status(400).json("This Post is already liked!!");
    } else {
      await post.updateOne({ $push: { likes: userId } });
      await post.updateOne({ $inc: { likesCount: 1 } });
      return res.status(200).json("Post liked");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//unlike a post
export const unlikePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const post = await PostModel.findById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      await post.updateOne({ $dec: { likesCount: 1 } });
      return res.status(200).json("Post disliked");
    } else {
      return res.status(400).json("This Post is already disliked!!");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//post comments
export const postComments = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await PostModel.findByIdAndUpdate(
      id,
      { $push: { comments: req.body.comments } },
      { new: true }
    );
    res.status(200).json(post._id);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get timeline posts
export const getTimelinePosts = async (req, res) => {
  const userId = req.user._id;
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    res.status(200).json(
      currentUserPosts
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

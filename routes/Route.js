import express from 'express';
import { loginUser, registerUser } from '../controllers/AuthController.js';
import authMiddleWare from '../middleware/AuthMiddleware.js';
import { followUser, getUser, unfollowUser } from '../controllers/UserController.js';
import { postComments, createPost, deletePost, getPost, getTimelinePosts, likePost, unlikePost, } from "../controllers/PostController.js";

const router = express.Router()


router.post('/register', registerUser)
router.post('/authenticate', loginUser)

router.put('/follow/:id',authMiddleWare, followUser)
router.put('/unfollow/:id',authMiddleWare, unfollowUser)
router.get('/user',authMiddleWare, getUser);

router.post("/posts", authMiddleWare, createPost);
router.delete("/posts/:id",authMiddleWare, deletePost);
router.put("/like/:id", authMiddleWare, likePost);
router.put("/unlike/:id", authMiddleWare, unlikePost);
router.put("/comment/:id", authMiddleWare, postComments);
router.get('/posts/:id', authMiddleWare, getPost)
router.get("/all_posts",authMiddleWare, getTimelinePosts);

export default router;
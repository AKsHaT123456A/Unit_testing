import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title:{type: String, required: true},
    desc: { type: String},
    likes: [],
    userId:{type:String},
    likesCount:{type:Number, default: 0},
    comments: [{ type: String}],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

var PostModel = mongoose.model("Posts", postSchema);

export default PostModel;

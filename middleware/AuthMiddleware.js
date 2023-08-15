import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_KEY;


const authMiddleWare = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) res.status(403).json("Token is not valid!")
            req.user = user;
            next();
        })
    } else {
        res.status(401).json("You are not authenticated!")
    }
}

export default authMiddleWare;

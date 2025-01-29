import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d" //login expires in 7 days
    });


    res.cookie("jwt", token, { 
        maxAge: 7 * 24 * 60 * 60 * 1000, // in ms
        httpOnly: true,  //prevent cookie from being accessed by client side js  
        sameSite: "strict", // prevent csrf attacks
        secure: process.env.NODE_ENV !== "development" , // cookie sent only over https in production
    });

    return token;
}


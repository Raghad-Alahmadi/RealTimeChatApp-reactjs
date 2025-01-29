import User from "../models/user.model.js";
import Message from "../models/message.model.js";


export const getUsersForSidebar = async (req, res) => {

    try {
        // Get all users except the current user
        const loggedInUserId = req.user_id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }

};

export const getMessages = async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;
  
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      });
  
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const sendMessage = async (req, res) => {
    
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;  
        const senderId = req.user_id;

        let imageUrl;

        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }
        
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();
        //todo : realtime functionality scoket.io

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sending the message", error);
        res.status(500).json({ message: "Server Error" });
    }
};
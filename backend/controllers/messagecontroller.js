import Conversation from "../models/conversationModel.js"
import Message from "../models/messageModel.js"
  
export const sendMessage = async (req,res) => {
    
    try{
        const {message} = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants : {$all : [senderId, receiverId]},
        })

        if(!conversation) {
            conversation = await Conversation.create({
                participants : [senderId, receiverId],
            })
        }

        const newMessage=  new Message ({
            senderId,
            receiverId,
            message,
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }

        // ------------- SOCKET.IO Functionality goes here-----------


        // await conversation.save();
        // await newMessage.save();

        // this will run in parallel , jldi ho jayenga

        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);

    }catch(err){
        console.log("Error in sendMessage controller : ",err.message);
        res.status(500).json({error : "Internal server error {sendMessage} "})
    }
}

export const getMessages = async (req,res) => {
    try{

        const {id:userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants : {$all : [senderId, userToChatId]},
        }).populate("messages");   // Not the Reference, but the actual messages

        if(!conversation) {
            return res.status(400).json([])
        }

        const messages = conversation.messages;

        res.status(200).json(messages);

    }catch(err){
        console.log("Error in getMessage controller : ",err.message);
        res.status(500).json({error : "Internal server error {getMessage} "})
    }
}
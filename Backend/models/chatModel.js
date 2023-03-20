const mongoose = require("mongoose")

const chatModel = mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true
        },
        isGrp: {
            type: Boolean,
            default: false
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }


    }, {
    timestamps: true
}
);

const chat = mongoose.model("Chat", chatModel);

module.exports = chat;

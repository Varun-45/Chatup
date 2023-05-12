const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { sendMsg } = require('../Controllers/messageController')
const { allMessages } = require("../Controllers/messageController")

const router = express.Router()

router.route('/').post(protect, sendMsg)

router.route('/:chatId').get(protect, allMessages)

module.exports = router
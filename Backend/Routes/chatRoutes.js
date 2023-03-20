const express = require('express')
const { protect } = require("../middleware/authMiddleware")
const { accessChat, fetchChat, createGroupChat, renameGroup, removefrmgroup, addtogroup } = require("../Controllers/chatController")

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChat)

router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup)
router.route("/removefrmgroup").put(protect, removefrmgroup)
router.route("/addtogroup").put(protect, addtogroup)

module.exports = router
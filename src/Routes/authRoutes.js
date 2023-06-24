const express = require('express');
const { register, login, getAllUser, getUserById, deleteUser, updateUser, unblockUser, blockUser, refreshCookie,optSender,verify } = require('../controller');
const { verifyToken, isAdmin } = require('../middleware/TokenVerification');
const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.delete("/:id",deleteUser)
router.get('/all-users', getAllUser)
router.get('/refresh-cookie', verifyToken, refreshCookie)
router.get('/sendOtp',verifyToken,optSender)
router.put("/update-user", verifyToken, updateUser)
router.post('/verify',verifyToken,verify)

router.get("/:id", verifyToken, isAdmin, getUserById)
router.get('/block-user/:id', verifyToken, isAdmin, blockUser)
router.put('/unblock-user/:id', verifyToken, isAdmin, unblockUser)
module.exports = router;


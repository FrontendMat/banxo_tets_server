const {Router} = require("express");
const likedController = require("../../like/like-controller");
const authMiddleware = require("../../middlewares/auth-middleware");

const router = new Router()

router.get('/get', authMiddleware, likedController.getLiked)
router.post('/toggle', authMiddleware, likedController.toggle);

module.exports = router
const Router = require('express').Router;
const userRouter = require('./routers/userRouter');
const likedRouter = require('./routers/likedRouter');

const router = new Router()

router.use('/user', userRouter)
router.use('/like', likedRouter)

module.exports = router
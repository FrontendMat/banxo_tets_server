const {Router} = require("express");
const userController = require("../../user/user-controller");
const authMiddleware = require("../../middlewares/auth-middleware");
const {body} = require("express-validator");

const router = new Router()

router.get('/refresh', userController.refresh)
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/registration',
    body('password').isLength({min: 3, max: 10}),
    body('email').isEmail(),
    userController.registration);
router.get('/users', userController.getUsers);
router.get('/activate/:link', userController.activate);

module.exports = router
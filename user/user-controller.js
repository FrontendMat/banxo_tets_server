const UserService = require('./user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-errors')

class UserController {
    async registration (req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation Error', errors.array()))
            }
            const {userData} = req.body
            const user = await UserService.registration(userData.email, userData.password)
            res.cookie('refreshToken', user.refreshToken, {secure: true, sameSite: 'none', maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async activate (req, res, next) {
        try {
           const link = req.params.link;
           await UserService.activate(link);
           return res.redirect(`${process.env.CLIENT_URL}/`)
        } catch (e) {
            next(e)
        }
    }

    async login (req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await UserService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {secure: true, sameSite: 'none', maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout (req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }

    }

    async refresh (req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {secure: true, sameSite: 'none', maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers (req, res, next) {
        try {
            const users = await UserService.getUsers();
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()


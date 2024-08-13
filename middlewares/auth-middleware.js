const ApiError = require('../exceptions/api-errors')
const tokenService = require('../user/token/token-service')

module.exports = function (req, res, next) {
    try{
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnAuthorizedError())
        }

        const accessToken = authorizationHeader.split(' ')[1]
         if (!accessToken) {
            return next(ApiError.UnAuthorizedError())
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.UnAuthorizedError());
        }

        if (!userData.isActivated) {
            return next(ApiError.UnAuthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnAuthorizedError())
    }
}
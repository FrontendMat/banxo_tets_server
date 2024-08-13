const UserModel = require('./model/user-model');
const bcrypt = require('bcrypt');
const tokenService = require('./token/token-service');
const UserDto = require('./dto/user-dto');
const ApiError = require('../exceptions/api-errors');
const uuid = require('uuid');
const mailService = require('./mail-service');

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest(`User with this Email already exist`);
        }
        const hashPassword = await bcrypt.hash(password, 8);
        const activationLink = uuid.v4();
        const user = await UserModel.create({
            email: email,
            password: hashPassword,
            activationLink: activationLink
        });

        await mailService.sendActivationMail(
            email,
            `${process.env.API_URL}/api/user/activate/${activationLink}`
        );

        const userDTO = new UserDto(user);
        const token = tokenService.generateTokens({...userDTO});

        await tokenService.saveToken(userDTO.id, token.refreshToken);
        return {...token, user: userDTO}
    }

    async activate(link) {
        const user = await UserModel.findOne({activationLink: link});
        if (!user) {
            throw ApiError.BadRequest('Wrong activation link');
        }

        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        console.log(email, password)
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest(`Wrong email or password`)
        }
        const isPasswordEqual = await bcrypt.compare(password, user.password)
        if (!isPasswordEqual) {
            throw ApiError.BadRequest('Wrong email or password')
        }
        const userDTO = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDTO})

        await tokenService.saveToken(userDTO.id, tokens.refreshToken)
        return {...tokens, user: userDTO}
    }

    async logout(refreshToken) {
        const token = tokenService.removeTokens(refreshToken)
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnAuthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const dbToken = await tokenService.findTokens(refreshToken)

        if(!userData || !dbToken) {
            throw ApiError.UnAuthorizedError()
        }

        if (!userData.isActivated) {
            throw ApiError.UnAuthorizedError()
        }

        const user = await UserModel.findById(userData.id)
        const userDTO = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDTO})

        await tokenService.saveToken(userDTO.id, tokens.refreshToken)
        return {...tokens, user: userDTO}
    }
}

module.exports = new UserService()

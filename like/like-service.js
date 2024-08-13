const ApiError = require('../exceptions/api-errors');
const LikeModel = require('./model/like-model');

class LikeService {
    async getLiked(UserData) {
        const liked = await LikeModel.find({
            user: UserData.id,
        })

        if (!liked) {
            throw ApiError.BadRequest('Not Found')
        }
        console.log(liked)
        return liked;
    }

    async toggle(id, userData) {
        const item = await LikeModel.findOne({
            dataId: id,
            user: userData.id,
        })

        if (!item) {
            const newItem = await LikeModel.create({
                dataId: id, user: userData.id
            })

            return newItem;
        }

        await LikeModel.deleteOne(item._id);
        return [];
    }
}

module.exports = new LikeService()
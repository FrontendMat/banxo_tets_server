const LikeService = require('./like-service')

class LikeController {
   async getLiked(req, res, next) {
       try {
           const userData = req.user;
           const data = await LikeService.getLiked(userData);

           return res.json(data)
       } catch (e) {
           next(e)
       }
   }

    async toggle(req, res, next) {
       try {
           const userData = req.user;
           const {dataId} = req.body;
           const data = await LikeService.toggle(dataId, userData);

           return res.json(data)
       } catch (e) {
           next(e)
       }
    }
}

module.exports = new LikeController()
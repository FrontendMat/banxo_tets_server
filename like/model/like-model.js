const {Schema, model} = require('mongoose')

const LikeSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    dataId: {type: String, required: true},
})

module.exports = model('Like', LikeSchema)
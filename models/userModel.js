import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 60
    },
    lastname: {
        type: String,
        required: true,
        maxLength: 60
    },
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 60
    },
    password: {
        type:  String,
        required: true,
    }
}, {
    timestamps: true
})

export default  mongoose.models.UserMonn || mongoose.model("UserMonn", UserSchema)
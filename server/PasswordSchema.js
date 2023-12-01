const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    password: {
        type: String,
        unique: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    type: {
        type: String,
        enum: ['normal', 'prioritaria'],
        default: 'normal',
    },
    status: {
        type: Boolean,
        default: false,
    },
}, { collection: 'passwords' }); // Nome da coleção

const Password = mongoose.model('Password', passwordSchema);

module.exports = Password;

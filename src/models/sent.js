const mongoose = require('mongoose');

const sentScheme = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: false,
    }, 
    sent: {
        type: Array,
        required: false,
    }
}, {
    timestamps: {
        createdAt: 'created_at', 
        updatedAt: 'updated_at'
    }
});

sentScheme.index({ date: 1, hour: 1}, { unique: true });

const sentModel = mongoose.model('sents', sentScheme);

exports.Schema = sentScheme;
exports.SentModel = sentModel;
const mongoose = require('mongoose');

const tweetScheme = new mongoose.Schema({
    tweet_id: {
        type: String,
        required: true,
        unique: true
    },
    tweet_id_str: {
        type: String,
        required: true,
        unique: true
    },
    tweet_text: {
        type: String,
        required: true
    },
    tweet_created_at: {
        type: Date,
        required: true
    },
    tweet: {
        type: Object,
        required: true
    },
    trigger_id: {
        type: String,
        required: true
    },
    trigger: {
        type: String,
        required: true
    },
    sent: {
        type: Boolean,
        required: true,
        default: false
    },
    sent_error: {
        type: Boolean,
        required: false,
        default: false
    },
    sent_error_obj: {
        type: Object,
        required: false,
    },
    sent_at: {
        type: Date,
        required: false,
    },
    tweet_reply: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created_at', 
        updatedAt: 'updated_at'
    }
});

tweetScheme.index({ tweet_id: 1, tweet_id_str: 1}, { unique: true });
tweetScheme.index({ trigger_id: 1 });

const tweetModel = mongoose.model('tweets', tweetScheme);

exports.Schema = tweetScheme;
exports.TweetModel = tweetModel;
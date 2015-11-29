var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
    name: String,
    screen_name: String,
    text: String,
    user_profile_location: String,
    tweet_coordinates: String,
    profile_image_url: String,
    follower: Number,
    following: Number
});

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = mongoose.model('Tweet', tweetSchema);

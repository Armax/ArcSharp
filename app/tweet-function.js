// Code by @Arm4x

var Tweet = require('../app/models/tweet');

module.exports = {
  	saveTweet: function(name,screen_name,text,user_profile_location,tweet_coordinates,profile_image_url,follower,following) {
        var tweet = new Tweet({   name: name,
                                  screen_name: screen_name,
                                  text: text,
                                  user_profile_location: user_profile_location,
                                  tweet_coordinates: tweet_coordinates,
                                  profile_image_url: profile_image_url,
                                  follower: follower,
                                  following: following
                                });
        tweet.save(function (err, tweet) {
          if (err) return console.error(err);
        });
  	}
}

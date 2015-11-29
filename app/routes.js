// Code by @Arm4x

var tweetfunction = require('../app/tweet-function');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var parser = require('body-parser');
var Twitter = require('twitter');
var Tweet = require('../app/models/tweet');
var connecteduser = 0;


// Config
var saveTweet = true;


// Twitter init
var client = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

var params = {track: "klei"};

module.exports = function(app, io) {
    app.use(parser.urlencoded({
        extended: true
    }));
    app.use(parser.json());

    // routes
    app.get('/', function(req, res) {
			res.render('index.ejs',{ title: 'ArcSharp'});
    });

    // update top influencer
    function update_top_influencer(socketid) {
      // sneaky sneaky group by
      Tweet.find().sort({ 'follower' : -1}).exec(function(err, tweets) {
          tweets = tweets.slice(0,25);
          var first = true;
          var lastname = "";
          var count = 0;

          tweets.forEach(function(tweet) {
              if(lastname != tweet.screen_name && count < 5) {
		          io.to(socketid).emit('top-tweet',   tweet.text,
                                                  tweet.name,
                                                  tweet.screen_name,
                                                  tweet.profile_image_url,
                                                  tweet.user_profile_location,
                                                  tweet.tweet_coordinates,
                                                  tweet.follower,
                                                  tweet.following,
                                                  first
                                    );
				  first = false;
				  count = count + 1;
				  lastname = tweet.screen_name
			  }
            });
      });
    }

    function update_top_influencer_for_socket(socketid) {
      // sneaky sneaky group by
      Tweet.find().sort({ 'follower' : -1}).exec(function(err, tweets) {
          tweets = tweets.slice(0,25);
          var first = true;
          var lastname = "";
          var count  = 0;

          tweets.forEach(function(tweet) {
	          if(lastname != tweet.screen_name && count < 5) {
		          io.to(socketid).emit('top-tweet',   tweet.text,
                                                  tweet.name,
                                                  tweet.screen_name,
                                                  tweet.profile_image_url,
                                                  tweet.user_profile_location,
                                                  tweet.tweet_coordinates,
                                                  tweet.follower,
                                                  tweet.following,
                                                  first
                                    );
				  first = false;
				  count = count + 1;
				  lastname = tweet.screen_name
			  }
            });
      });
    }

    // client stream
    client.stream('statuses/filter', params, function(stream){
        stream.on('data', function(tweet) {
            if(saveTweet == true) {
                tweetfunction.saveTweet(
                                          tweet.user.name,
                                          tweet.user.screen_name,
                                          tweet.text,tweet.user.location,
                                          tweet.coordinates,
                                          tweet.user.profile_image_url,
                                          tweet.user.followers_count,
                                          tweet.user.friends_count
                                        );
            }
            io.emit('tweet',  tweet.text,
                              tweet.user.name,
                              tweet.user.screen_name,
                              tweet.user.profile_image_url,
                              tweet.user.location,
                              tweet.coordinates,
                              tweet.user.followers_count,
                              tweet.user.friends_count
                    );
            update_top_influencer();
        });

        stream.on('error', function(error) {
            console.log(error);
        });
    });

    // Socket.io
    io.on('connection', function(socket){
	    connecteduser = connecteduser+1;
	    console.log("[i] user connected, currently we have: " + connecteduser + " online");
        Tweet.find({}, function(err, tweets) {
            tweets.forEach(function(tweet) {
              io.to(socket.id).emit('tweet',  tweet.text,
                                              tweet.name,
                                              tweet.screen_name,
                                              tweet.profile_image_url,
                                              tweet.user_profile_location,
                                              tweet.tweet_coordinates,
                                              tweet.follower,
                                              tweet.following
                                    );
            });
        });
        update_top_influencer_for_socket(socket.id);
        io.to(socket.id).emit('connected');

    });



}

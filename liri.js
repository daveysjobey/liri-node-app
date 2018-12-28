require("dotenv").config();

var keys = require("./keys")
var Spotify = require('node-spotify-api');
var fs = require('fs');
var axios = require("axios")
var moment = require("moment")


var input = process.argv;
var command = input[2];
var todo = input.slice(3).join(" ");

picker = function (command) {
    // muse,ironic,blade runner
    if (command === `concert-this`) {
        bandsIn(todo);
    }
    if (command === `spotify-this-song`) {
        spotify(todo)
    }
    if (command === `movie-this`) {
        omdb(todo)
    }
    if (command === `do-what-it-says`) {
        runTxt()
    }
}



bandsIn = function () {

    var bandName = todo;
    axios.get("https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp").then(
        function(response) {
            var eventData = response.data[0];
            

            var eventInfo = 
            "* Artist: " + bandName+
            "* Venue: " + eventData.venue.name +
            "* City, State: " + eventData.venue.city +", " + eventData.venue.region  +
            "* Date: " + moment(eventData.datetime).format("L");
            
        var dataArr = eventInfo.split("*");
        for (i = 0; i < dataArr.length; i++) {
            console.log(dataArr[i].trim())
            

            fs.appendFile("log.txt", dataArr[i].trim() + "\n", function (err) {
                if (err) {
                    return console.log(err);
                }
            })
            
        }
        console.log("\n===== log.txt was updated using BandsInTown! =====");
    }) ;




}

spotify = function () {


    var trackName = todo;


    var spotify = new Spotify(keys.spotify);

    spotify.search({
        type: 'track',
        query: trackName,
        limit: 3
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }


        var result = data.tracks.items[0];
        var trackInfo = "* Track Title: " + result.name +
            "* Artist(s): " + result.album.artists[0].name +
            "* Preview Link: " + result.external_urls.spotify +
            "* Album Name: " + result.album.name;
        var dataArr = trackInfo.split("*");
        for (i = 0; i < dataArr.length; i++) {
            console.log(dataArr[i].trim());


            fs.appendFile("log.txt", dataArr[i].trim() + "\n", function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
        console.log("\n===== log.txt was updated using Spotify =====");
    });
};

omdb = function () {
    
    var movieName = todo;
   
    
    axios.get("http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=trilogy").then(
        function(response) {

   
            var movieData = response.data;
            console.log (movieData)
            
        

            var movieInfo = "* Movie Title: " + movieData.Title +
                "* The movie's Release Year is: " + movieData.Year +
                "* The movie's IMDB Rating is: " + movieData.Ratings[0].Value +
                "* The movie's Rotten Tomatoes Rating is: " + movieData.Ratings[1].Value+
                "* The movie was produced in: " + movieData.Country +
                "* The movie's Language is: " + movieData.Language +
                "* The movie's Plot is: " + movieData.Plot +
                "* The movie's Actors include: " + movieData.Actors;
            var dataArr = movieInfo.split("*");
            for (i = 0; i < dataArr.length; i++) {
                console.log(dataArr[i].trim());
                

                fs.appendFile("log.txt", dataArr[i].trim() + "\n", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
            }
            console.log("\n===== log.txt was updated using OMDB! =====");
        }) ;
    
};

runTxt = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        } else {
            var randomTxt = data.split(',');
            command = randomTxt[0];
            todo = randomTxt[1];
            console.log(command)
            console.log(todo)
            picker(command, todo)
        };
    });
};

picker(command);
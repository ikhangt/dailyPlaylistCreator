//addVideos
var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var variables = require('./variables');

module.exports.retriveVideos = retriveVideos;

//  retrive videos from channel, 
//  create a playlist for the day,
//  push videos to the days playlist.
function retriveVideos(auth){
  return new Promise(function(resolve, reject) {
      console.log("entered retriveVideos")
      //transform request parameters 
      var searchRequest = variables.FullSearchQuery
      var service = google.youtube('v3');
      var parameters = (searchRequest['params']);
      parameters['auth'] = auth;
      service.search.list(parameters, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        var searchResults = response.data.items
        var videos = refineSearch(searchResults);
        
        console.log("enter Add video return")
        resolve(videos);
      });
    })
}

function refineSearch(searchResults){
	var videos = []
	searchResults.forEach(function (item){
		var currentdate = new Date();
		var twenty_four_Hours_Ago = new Date(currentdate.setHours(currentdate.getHours()-24));
		
    var date = true;
		var isVideo = item.id.kind == 'youtube#video'

		if(isVideo && date){
			videos.push(item.id.videoId)
		}
	})
	return videos;
}
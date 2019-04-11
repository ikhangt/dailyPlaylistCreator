var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var variables = require('./variables');

module.exports.playlistsInsert = playlistsInsert;
module.exports.playlistsInsertVideo = playlistsInsertVideo;
module.exports.addVideosToPlaylist = addVideosToPlaylist;


function playlistsInsert(auth) {
  return new Promise(function(resolve, reject) {
    var service = google.youtube('v3');
    var requestData = variables.playlistProperties
    console.log("requestData: " + JSON.stringify(requestData))
    var parameters = (requestData['params']);
    parameters['auth'] = auth;
    parameters['resource'] = createResource(requestData['properties']);

    service.playlists.insert(parameters, function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      } else {
        resolve(response.data.id);
      }
    });
    // resolve('PLuZ70MflC72rw7yIAsjqgsKVGLc5ZdnEd') use following playlist to avoid hitting quota
  })
}

function playlistsInsertVideo(auth,playlists, video_id) {
  var service = google.youtube('v3');
  if(Buffer.isBuffer(auth.credentials)){
    auth.credentials = JSON.parse(auth.credentials.toString())
  }

  // Transform data before inserting videos.
  var requestData = variables.playlistProperties
  requestData.properties["snippet.resourceId"].videoId = video_id;
  requestData.properties["snippet.playlistId"] = playlists;

  var parameters = (requestData['params']);
  parameters['auth'] = auth;
  parameters['resource'] = createResource(requestData['properties']);

  //Insert the video
  service.playlistItems.insert(parameters, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.log('completed insert video function')
  });
}

function addVideosToPlaylist(auth,playlist,videos) {
    myLoop(auth,playlist,videos);
}

function myLoop(auth,playlist,videos) {
  playlistsInsertVideo(auth,playlist,videos[0]);
  videos.shift();
  setTimeout(function() {
     if(!(videos.length < 1 || videos == undefined))
        myLoop(auth,playlist,videos);
  }, 100);
}

function createResource(properties) {
  var resource = {};
  var normalizedProps = properties;
  for (var p in properties) {
    var value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      var adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (var p in normalizedProps) {
    // Leave properties that don't have values out of inserted resource.
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      var propArray = p.split('.');
      var ref = resource;
      for (var pa = 0; pa < propArray.length; pa++) {
        var key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    };
  }
  return resource;
}
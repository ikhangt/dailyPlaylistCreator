var fs = require('fs');
const {variables} = require('./variables');
var YTmodules = require('./YTmodules');
var playListModules = require('./playListModules');
var addVideos = require('./addVideos');

var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
const oauth2Client = require('google-auth-library');

//******************************//
//****  Store Token Paths    ***//
//******************************//
 var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/Documents/personal/YoutubeAPI/Test2/YoutubeAttemptDeleteAsap' + '/.credentials/';
 var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  var playlist = (authorize0(JSON.parse(content), playListModules.playlistsInsert));

  var videos = authorize0(JSON.parse(content) ,addVideos.retriveVideos)//retrive(content);

  Promise.all([videos, playlist]).then(function(results){
    console.log("videos1234: "+results[0]+"\nPlaylist: "+results[1])
    authorize2(JSON.parse(content), results[1], results[0], playListModules.addVideosToPlaylist);
  })
});

function extractToken(token){
  return new Promise(function(resolve,reject){
    resolve(token)
  })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

function authorize0(credentials, callback) {
  return new Promise(function(resolve, reject) {
    console.log("entered authorize0Return")
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err || (JSON.parse(token)["expiry_date"] < new Date()/1)) {
        auth=YTmodules.getNewToken(oauth2Client)
      } 
      else{
        console.log("token in file valid: " + token)//debugger
        auth = new Promise(function(resolve,reject){
                resolve(token)
              }).then(function(token){
                oauth2Client.credentials = JSON.parse(token);
                return token
              })
      }
      console.log("waiting for token to resolve\n")
      Promise.all([auth]).then(function(token){
        console.log("auth resolved inside next promise: ") 
        console.log(oauth2Client.credentials)
        promiseResp = callback(oauth2Client);
        // Do async job
        resolve(promiseResp)
      })
    });
  })
}

function authorize2(credentials, requestData1,requestData2, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      YTmodules.getNewToken(oauth2Client, requestData, callback);
    } else {
      oauth2Client.credentials = token;
      console.log("oauth2Client.credentials inside auth2: " + oauth2Client.credentials)
      callback(oauth2Client, requestData1,requestData2);
    }
  });
}

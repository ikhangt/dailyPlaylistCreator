module.exports.monthArray = getMonthArray();
module.exports.playlistProperties = getPlaylistProperties();
module.exports.searchQuery = searchQuery();
module.exports.FullSearchQuery = getFullSearchQuery();
//*****************************************//
//****    Search related constants      ***//
//*****************************************//

function getMonthArray() {
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";
	return month

}

function getPlaylistProperties() {
	month = getMonthArray()
	date = new Date();
	var newPlaylistReqData = {
	    "params": {
	      "part": "snippet,status"
	    },
	    "properties": {
	      "snippet.title": (month[date.getMonth()] + "-" + date.getDate()) + " " + searchQuery()+" Playlist",
	      "status.privacyStatus": "private",
	      "snippet.resourceId": {kind: 'youtube#video'}
	    }
  	}
  	return newPlaylistReqData
}

function searchQuery(){
	return "JREClips"
}

function getFullSearchQuery(){
	return 	{'params': {'maxResults': '3',
		     'part': 'snippet',
		     'q': searchQuery(),
		     'type': ''}}
}



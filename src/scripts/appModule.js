//------------------------------------------------main app module for Aura Create--------------------------------------
var app = angular.module('auraCreate', []);
//------------------------------------------------main app module for Aura Create--------------------------------------

//allows modals to stack based on z-index
$(document).on('show.bs.modal', '.modal', function () {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function() {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
});


//-----------------------------------------------Start of helper functions---------------------------------------------
	//helper function to determine the associated field when pulling from the database
	function getAssociatedType(assoc){
		if(assoc == null){
			return "Software";
		}
		else{
			return "Hardware";
		}
	}

	//transforms the beacon type from the database to be more readable
	function parseBeaconType(beaconType){
		var type = "";
		switch(beaconType) {
			case "parking":
				type = "Parking";
				break;
			case "airport":
				type = "Airport";
				break;
			case "security":
				type = "Security";
				break;
			case "park":
				type = "Park";
				break;
			case "retail":
				type = "Retail";
				break;
			case "landmark":
				type = "Landmark";
				break;
			case "trail":
				type = "Trail";
				break;
			case "restaurant":
				type = "Restaurant";
				break;
			case "coffee-shop":
				type = "Coffee Shop";
				break;
			case "museum":
				type = "Museum";
				break;
			case "gallery":
				type = "Gallery";
				break;
			case "zoo":
				type = "Zoo";
				break;
			case "art":
				type = "Art";
				break;
			case "office":
				type = "Office";
				break;
			case "manufacturing":
				type = "Manufacturing";
				break;
			case "other":
				type = "Other";
				break;
		}
		return type;
	}

	//tally's the amount of each media type for an object
    function tallyAssets(mediaArray){
    	var tally = {numImage: 0, numAudio: 0, numVideo: 0, num3D: 0}
    	for(var i = 0; i < mediaArray.length; i++){
    		switch(mediaArray[i].content_type){
    			case "image":
    				tally.numImage += 1;
    				break;
    			case "audio":
    				tally.numAudio += 1;
    				break;
    			case "video":
    				tally.numVideo += 1;
    				break;
    			case "3D":
    				tally.num3D += 1;
    				break;
    		}
    	}
    	return tally;
    }

    //finds the beacon associated with an object
    function getBeaconName(beacon_id){
    	var beaconsArray = JSON.parse(sessionStorage.beaconsArray);
		for(var i = 0; i < beaconsArray.length; i++){
			if(beaconsArray[i].beacon_id == beacon_id){
				return beaconsArray[i].beacon_name;
			}
		}
    }

     //finds the distance between two latlng points in meters
    function findDistanceBetweenLatLng(lat1,lon1,lat2,lon2) {
	  var R = 6371000; // Radius of the earth in m
	  var dLat = deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = deg2rad(lon2-lon1); 
	  var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
	}
	//helper function for findDistanceBetweenLatLng
	function deg2rad(deg){
	  return deg * (Math.PI/180)
	}

	//creates a random id for a new beacon/object/organization/etc
    function randID(){
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	}

//-----------------------------------------------End of helper functions---------------------------------------------


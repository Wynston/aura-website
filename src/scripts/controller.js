//-------------------------------Angular Controller---------------------------------------
var app = angular.module('auraCreate', []);
app.controller('myCtrl', function($scope, $http) {
	//initializer function when the window is loaded
	$scope.init = function(){
		$scope.userName = "Wynston Ramsay";
		$scope.loadOrganizations();
		// $scope.loadBeacons();
		// $scope.loadObjects();
		// $scope.loadDashboard();
		$scope.changeView("dashboard");
		$scope.curOrg = "";
	}

	//---------------------------------display functions begin----------------------------------------


	//controls which view is to be displayed as well as the title
	$scope.changeView = function(view , secondTitle){;
		switch(view){
			case "dashboard":
				$scope.changeLiveTitle("Dashboard", $scope.userName, false);
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "profileSettings":
				$scope.changeLiveTitle("Profile Settings", $scope.userName, false);
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "beaconsList":
				$scope.changeLiveTitle("Beacons", secondTitle, true);
				$scope.filterTitle="beaconsView";
				$scope.changeViewType('List');
				$scope.loadBeacons();
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "objectsList":
				$scope.changeLiveTitle("Objects", secondTitle, true);
				$scope.filterTitle = "objectsView";
				$scope.changeViewType('List');
				$scope.changeBeaconFilter('All');
				$scope.loadObjects();
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "settings":
				$scope.changeLiveTitle("Settings", secondTitle, false);
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "stats":
				$scope.changeLiveTitle("Stats", secondTitle, false);
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
		}
	}

	//handles the display of all the live display titles
	$scope.changeLiveTitle = function(primT, secondT, bool){
		$scope.primTitle = primT;
		if(!(secondT == "")){
			$scope.secTitle = secondT;
		}

		if(bool){
    		document.getElementById("filterTitle").style.visibility = "visible";
    	}
    	else{
    		document.getElementById("filterTitle").style.visibility = "hidden";
    	}
	}

	//helps the carousel notify the controller what the current organization is
	$scope.carouselViewController = function(view){
		var index = $('div.active').index();
		$scope.changeView(view, $scope.organizationsArray[index].name);
	}

	//when a new organization is selected reload the current view of that organization
	$scope.carouselLeft = function(){
		var index = $('div.active').index() - 1;
		if(index >= 0){
			$scope.changeView($scope.curView, $scope.organizationsArray[index].name);
		}
		else{
			$scope.changeView($scope.curView, $scope.organizationsArray[$scope.organizationsArray.length - 1].name);
		}
	}

	//when a new organization is selected reload the current view of that organization
	$scope.carouselRight = function(){
		var index = $('div.active').index() + 1;
		if(index < $scope.organizationsArray.length){
			$scope.changeView($scope.curView, $scope.organizationsArray[index].name);
		}
		else{
			$scope.changeView($scope.curView, $scope.organizationsArray[0].name);
		}
	}

	//display a single object to the live display
	$scope.displayBeacon = function(beacon){
		$scope.curBeacon = beacon;
		sessionStorage.curBeacon = beacon;
		sessionStorage.curBeacon = JSON.stringify($scope.curBeacon);
		$scope.changeLiveTitle("Beacon: " + $scope.curBeacon.beacon_name, "", false);
		$scope.curView = "beacon";
		sessionStorage.curView = "beacon";
		$scope.loadGoogleScript(); 
	}

	//used to show a specified beacon's objects when selected from the beacons page
	$scope.displayBeaconObjects = function (){
		$scope.changeView("objectsList", "");
		$scope.changeBeaconFilter($scope.curBeacon.beacon_name);
	}

	//displays a single object to the live display
	$scope.displayObject = function(obj){
		$scope.curObj = obj;
		sessionStorage.curObj = obj;
		sessionStorage.curObj = JSON.stringify($scope.curObj);
		$scope.changeLiveTitle("Object: " + $scope.curObj.name, "", true);
		$scope.curView = "object";
		sessionStorage.curView = "object";
		$scope.filterTitle = "objectPrivacy";
		$scope.loadGoogleScript(); 
	}

	//activates the modal with a given image
	$scope.displaythumbNailModal = function(obj){
		$scope.modalImgSrc = obj.thumbnail;
		$scope.modalHeader = obj.name;
		$scope.curObj = obj;
		$("#thumbnailModal").modal();
	}

	//display an objects assets in a modal
	$scope.displayAssetsModal = function(){
		if($scope.curObj.assets.length > 0){
			$scope.assets = $scope.curObj.assets;
			$("#assetsModal").modal();
		}
		else{
			alert("Error: " + $scope.curObj.name + " has no media.");
		}
	}

	//display an objects assets in a modal
	$scope.displayDescriptionModal = function(){
		$("#descriptionModal").modal();
	}

	//adds an organization to the database for a user
	$scope.addOrganization = function(name, desc){
		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/organization',
        data: {name: name, desc: desc},
        headers: {
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		}
		}).then(function mySuccess(response) {
			alert(name + " has been successfully added!");
		}, function myError(response) {
		    alert(response.statusText);
		});
		$scope.loadOrganizations();
	}

	//------------------------------------------end of display functions-----------------------------------


	//------------------------------loader functions begin---------------------------------
	// loader functions retrieve any needed data from the database and then proceeds to display that view
	//Queries:
	//KEY: dGhpc2lzYWRldmVsb3BlcmFwcA==
	//https://website-155919.appspot.com/api/v1.0/beacon
	//https://website-155919.appspot.com/api/v1.0/organization
	//https://website-155919.appspot.com/api/v1.0/arobj
	//https://website-155919.appspot.com/api/v1.0/user

	// USER: {organization_id: ,
	// 		name: ,
	// 		email: ,
	// 		user_id: ,
	// 		role: }

	//load in a specific user from the database
	// $scope.loadUser = function(){
	// 	$http({
	// 	    method : "GET",
	// 	    url : "https://website-155919.appspot.com/api/v1.0/user",
	// 	    headers: {
 //        		'Accept': 'application/json',
 //        		"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
	// 	    }
	// 	  }).then(function mySucces(response) {
	// 	  	//stores the user in session storage and angular binding
	// 	  	var jsonArray = response.data;
	//   		$scope.user = {
	//   			name: jsonArray[0].name,
	//   			email: jsonArray[0].email,
	//   			user_id: jsonArray[0].user_id,
	//   			role: jsonArray[0].role
	//   		};
	// 	  	sessionStorage.user = JSON.stringify($scope.user);
	// 	    }, function myError(response) {
	// 	      alert(response.statusText);
	// 	  });
	// }

	//loads in the organizations of a user
	$scope.loadOrganizations = function(){
		$http({
		    method : "GET",
		    url : "https://website-155919.appspot.com/api/v1.0/organization",
		    headers: {
        		'Accept': 'application/json',
        		"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		    }
		  }).then(function mySuccess(response) {
		  	//loops over every organization in the response and adds it to session storage and binding
		  	var jsonArray = response.data.data;
		  	$scope.numOrganizations = jsonArray.length;
		  	$scope.organizationsArray = [];
		  	for(var i = 0; i < jsonArray.length; i++){
		  		$scope.organization = {
		  			name: jsonArray[i].attributes.name,
		  			id: jsonArray[i].attributes.organization_id,
		  			description: jsonArray[i].attributes.desc
		  		};
		  		$scope.organizationsArray[i] = $scope.organization;
		  	}
		  	sessionStorage.organizationsArray = JSON.stringify($scope.organizationsArray);

		    }, function myError(response) {
		      alert(response.statusText);
		  });
	}

	//retrieves all the beacons from the database for the organization
    $scope.loadBeacons = function(){
		$http({
		    method : "GET",
		    url : "https://website-155919.appspot.com/api/v1.0/beacon",
		    headers: {
        		'Accept': 'application/json',
        		"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		    }
		  }).then(function mySuccess(response) {
		  	//loops over every beacon object in the response and adds it to session storage
		  	//stores the objects as beacons objects in an array that is stored as JSON
		  	var jsonArray = response.data;
		  	$scope.beaconsArray = [];
		  	for(var i = 0; i < jsonArray.length; i++){
		  		$scope.beacon = {
		  			beacon_name: jsonArray[i].name, 
		  			beacon_id: jsonArray[i].beacon_id, 
		  			organization_id: jsonArray[i].organization_id, 
		  			beacon_type: $scope.parseBeaconType(jsonArray[i].beacon_type), 
		  			altitude:  jsonArray[i].altitude, 
		  			latitude: jsonArray[i].latitude, 
		  			longitude: jsonArray[i].longitude, 
		  			associated: "Software"
		  		};
		  		$scope.beaconsArray[i] = $scope.beacon;
		  	}
		  	sessionStorage.beaconsArray = JSON.stringify($scope.beaconsArray);

		    }, function myError(response) {
		      alert(response.statusText);
		  });
    }

    //transforms the beacon type from the database to be more readable
    $scope.parseBeaconType = function (beaconType){
    	var type = "";
		switch(beaconType) {
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

    //loads in a beacon from the objects list, given its name
    $scope.loadBeacon = function(beacName){
    	var beaconsArray = JSON.parse(sessionStorage.beaconsArray);
    	var found = false;
    	var targetBeacon;
    	for(var i = 0; i < beaconsArray.length; i++){
    		//found a beacon match, display the beacon
    		if(beaconsArray[i].beacon_name == beacName){
    			$scope.displayBeacon(beaconsArray[i]);
    			found = true;
    			break;
    		}
    	}
    	if(!found){
    		alert("Error: beacon not found.");
    	}
    }

    //retrieves AR object data from the database and asks the live display to be updated
    //sends the AR objects to session storage
    $scope.loadObjects = function(){
    	$http({
		    method : "GET",
		    url : "https://website-155919.appspot.com/api/v1.0/arobj",
		    headers: {
		    	'Accept': 'application/json',
        		"X-Aura-API-Key": 'dGhpc2lzYWRldmVsb3BlcmFwcA=='
        	}
		  }).then(function mySuccess(response) {
		  	//loops over every AR object in the response and adds it to session storage
		  	//stores the objects as beacons objects in an array that is stored as JSON
		  	var jsonArray = response.data;
		  	$scope.objectsArray = [];
		  	for(var i = 0; i < jsonArray.length; i++){
		  		var mediaCounter = $scope.tallyAssets(jsonArray[i].contents);
		  		$scope.arObject = {
		  			name: jsonArray[i].name, 
		  			arobj_id: jsonArray[i].arobj_id, 
		  			organization_id: jsonArray[i].organization_id, 
		  			thumbnail: jsonArray[i].thumbnail,
		  			altitude:  jsonArray[i].altitude, 
		  			latitude: jsonArray[i].latitude, 
		  			longitude: jsonArray[i].longitude, 
		  			description: jsonArray[i].desc, 
		  			assets: jsonArray[i].contents, 
		  			beacon_id: jsonArray[i].beacon_id, 
		  			beacon_name: $scope.getBeaconName(jsonArray[i].beacon_id), 
		  			numImage: mediaCounter.numImage,
		  			numAudio: mediaCounter.numAudio, 
		  			numVideo: mediaCounter.numVideo, 
		  			num3D: mediaCounter.num3D
		  		};
		  		$scope.objectsArray[i] = $scope.arObject;
		  	}
		  	sessionStorage.arObjectsList = JSON.stringify($scope.objectsArray);
		    }, function myError(response) {
		      alert(response.statusText);
		  });
    }

    //tally's the amount of each media type for an object
    $scope.tallyAssets = function(mediaArray){
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
    $scope.getBeaconName = function(beacon_id){
    	var beaconsArray = JSON.parse(sessionStorage.beaconsArray);
		for(var i = 0; i < beaconsArray.length; i++){
			if(beaconsArray[i].beacon_id == beacon_id){
				return beaconsArray[i].beacon_name;
			}
		}
    }

    $scope.loadSettings = function(){

    }

    $scope.loadStats = function(){

    }

    //provides generic info about the users profile
    // $scope.loadDashboard = function(){
    // 	$scope.numOrganizations = $scope.organizations.length;
    // 	$scope.numBeacons = 0;
    // 	$scope.numObjects = 0;
    // 	for(var i = 0; i < $scope.organizations.length; i++){
    // 		$scope.numBeacons += $scope.organization[i].beaconsArray.length;
    // 		$scope.numObjects += $scope.organization[i].objectsArray.length;
    // 	}
    // 	$scope.avgThroughput = 0; 	 
    // }

    $scope.loadProfileSettings = function(){
  
    } 

    //must load in script when the object view is first loaded in html
    $scope.loadGoogleScript = function(){
    	if(document.getElementById("googleScript")){
    		document.getElementById("googleScript").remove();
    		var googleMapsScript = document.createElement('script');
			googleMapsScript.id = "googleScript";
			googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCq80g8ye8MQaNGW3BOVaj0VY3m7jpomoY&callback=initMap&libraries=visualization";
			document.getElementById("MAIN").appendChild(googleMapsScript);
		}
		else{
			var googleMapsScript = document.createElement('script');
			googleMapsScript.id = "googleScript";
			googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCq80g8ye8MQaNGW3BOVaj0VY3m7jpomoY&callback=initMap&libraries=visualization";
			document.getElementById("MAIN").appendChild(googleMapsScript);
		}
	}

	//alters the objects list to view by a specific beacon or by all beacons
    $scope.changeBeaconFilter = function(filter){
    	$scope.beaconsFilter = filter;
    	if($scope.viewType == "Map"){
    		$scope.filterObjectsByBeacon(filter);
    		$scope.loadGoogleScript();
    	}
    }

    //filters the session storage of objects depending on the beacon filter
    $scope.filterObjectsByBeacon = function(filter){
    	var tempArray = [];
    	for(var i = 0; i < $scope.objectsArray.length; i++){
	    	if(filter == "All"){
	    		tempArray.push($scope.objectsArray[i]);
	    	}
	    	else{
	    		if(filter == $scope.objectsArray[i].beacon_name){
	    			tempArray.push($scope.objectsArray[i]);
	    		}
	    	}
	    }
	    sessionStorage.arObjectsList = JSON.stringify(tempArray);
    }

    //changes the view type between list or map
    $scope.changeViewType = function(type){
    	$scope.viewType = type;
    	if(type == "Map"){
    		$scope.filterObjectsByBeacon($scope.beaconsFilter);
    		$scope.loadGoogleScript();
    	}
    }


    //changes the location of a beacon or object from google maps and uploads it to the database
    //assures the user wishes to make the change to the beacon
    $scope.changeLocation = function(pos, type){
    	switch(type){
    		case "beacon":
    			var locationPrompt = confirm("Are you sure you want to change " + $scope.curBeacon.beacon_name + "'s location?");
    			if(locationPromt){
    				$scope.curBeacon.latitude = pos.lat;
    				$scope.curBeacon.longitude = pos.lng;
    			}
    			break;
    		case "object":
    			var locationPrompt = confirm("Are you sure you want to change " + $scope.curObj.name + "'s location?");
    			if(locationPrompt){
	    			$scope.curObj.latitude = pos.lat;
	    			$scope.curObj.longitude = pos.lng;
	    		}
    			break;
        }
    }
});
//--------------------------------------end of loader functions----------------------------------


//-------------------------------------custom filters begins-------------------------------------

//filters an object list by beacon
app.filter('filterByBeacon', function() {

	return function(objectsArray, beaconsFilter) {
	    var filteredObjects = [];
	    angular.forEach(objectsArray, function(obj) {
	      if(beaconsFilter == 'All') {
	        filteredObjects.push(obj);
	      }
	      else{
	      	if(obj.beacon_name == beaconsFilter){
    			filteredObjects.push(obj);
    		}
    		else{
    			//object is not associated to the beacon
    		}
	      }
	    });
	    return filteredObjects;
  	}
});

//remove duplicate items from a dropdown menu
app.filter('removeDuplicates', function() {
	return function(objectsArray) {
	    var filteredItems = [];
	    angular.forEach(objectsArray, function(obj) {
	    	var duplicate = false;
	    	for(var i = 0; i < filteredItems.length; i++){
	    		if(filteredItems[i].beacon_name == obj.beacon_name){
	    			duplicate = true;
	    			break;
	    		}
	    		else{
	    			//not a duplicate in this comparison
	    		}
	    	}
	    	if(duplicate){
	    		//don't add it to the list
	    	}
	    	else{
	    		//add it to the list since it is not a duplicate
	    		filteredItems.push(obj);
	    	}
	    });
	    return filteredItems;
  	}
});

//-------------------------------------end of custom filters-------------------------------------

//initMap function for google maps api
function initMap(){
	if(sessionStorage.curView == "beacon"){
		var curBeacon = JSON.parse(sessionStorage.curBeacon);
	    var loc = {lat: curBeacon.latitude, lng: curBeacon.longitude };
	    var map = new google.maps.Map(document.getElementById("googleMapsBeacon"), {
	      zoom: 15,
	      center: loc
	    });
	    var marker = new google.maps.Marker({
	      position: loc,
	      map: map,
	      draggable:true,
   		  animation: google.maps.Animation.DROP
	    });
	    google.maps.event.addListener(marker, 'dragend', function() 
		{
		    geocodePosition(marker.getPosition(), "beacon");
		});
	}
	else if(sessionStorage.curView == "object"){
		var curObj = JSON.parse(sessionStorage.curObj);
	    var loc = {lat: curObj.latitude, lng: curObj.longitude };
	    var map = new google.maps.Map(document.getElementById("googleMapsObject"), {
	      zoom: 15,
	      center: loc
	    });
	    var marker = new google.maps.Marker({
	      position: loc,
	      map: map,
	      draggable:true,
    	  animation: google.maps.Animation.DROP
	    });
	    google.maps.event.addListener(marker, 'dragend', function() 
		{
		    geocodePosition(marker.getPosition(), "object");
		});
	}
	else if(sessionStorage.curView == "beaconsList"){
		map = new google.maps.Map(document.getElementById('googleMapsBeacons'), {
          zoom: 11,
          center: findbeaconsDPCenter(),
        });

        heatmap = new google.maps.visualization.HeatmapLayer({
          data: getBeaconsDataPoints(),
          map: map
        });
        heatmap.setOptions({radius: heatmap.get('50')});
		heatmap.setMap(map);
	}
	else if(sessionStorage.curView == "objectsList"){
		map = new google.maps.Map(document.getElementById('googleMapsObjects'), {
          zoom: 11,
          center: findObjectsDPCenter(),
        });
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: getObjectsDataPoints(),
          map: map
        });
        heatmap.setOptions({radius: heatmap.get('50')});
		heatmap.setMap(map);
	}
	else{
		alert("Error: undefined map");
	}
}

//gathers the co-ordinates of all the objects to display in a heat map
function getObjectsDataPoints(){
	var dataPoints = [];
	var objects = JSON.parse(sessionStorage.arObjectsList);
	for(var i = 0; i < objects.length; i++){
		dataPoints[i] = new google.maps.LatLng(objects[i].latitude, objects[i].longitude);
	}
	return dataPoints;
}

//finds the center of all the objects of an organization
function findObjectsDPCenter(){
	var objects = JSON.parse(sessionStorage.arObjectsList);
	var avgLat = 0;
	var avgLong = 0;
	for(var i = 0; i < objects.length; i++){
		avgLat += objects[i].latitude;
		avgLong += objects[i].longitude;
	}
	var center = {lat: avgLat / objects.length, lng: avgLong / objects.length};
	return center;
}

//gathers the co-ordinates of all the beacons to display in a heat map
function getBeaconsDataPoints(){
	var dataPoints = [];
	var beacons = JSON.parse(sessionStorage.beaconsArray);
	for(var i = 0; i < beacons.length; i++){
		dataPoints[i] = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
	}
	return dataPoints;
}

//finds the center of all the beacons of an organization
function findbeaconsDPCenter(){
	var beacons = JSON.parse(sessionStorage.beaconsArray);
	var avgLat = 0;
	var avgLong = 0;
	for(var i = 0; i < beacons.length; i++){
		avgLat += beacons[i].latitude;
		avgLong += beacons[i].longitude;
	}
	var center = {lat: avgLat / beacons.length, lng: avgLong / beacons.length};
	return center;
}


//updates the location of a marker when moved (by mouse)
function geocodePosition(pos, type) {
   geocoder = new google.maps.Geocoder();
   geocoder.geocode
    ({
        latLng: pos
    }, 
        function(results, status) 
        {
            if (status == google.maps.GeocoderStatus.OK) 
            {
                $("#mapSearchInput").val(results[0].formatted_address);
                $("#mapErrorMsg").hide(100);
                angular.element(document.getElementById('MAIN')).scope().changeLocation(pos, type);
            } 
            else 
            {
                $("#mapErrorMsg").html('Cannot determine address at this location.'+ status).show(100);
            }
        }
    );
}

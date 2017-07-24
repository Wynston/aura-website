//-------------------------------Main Angular Controller---------------------------------------
auraCreate.controller('mainController', function($scope, $http){
	//initializer function when the window is loaded
	$scope.init = function(){
		//controllers pre-loaded
		auraCreate.config($scope);
		auraCreate.userManagement($scope, $http);
		auraCreate.organizationManagement($scope, $http);
		auraCreate.beaconManagement($scope, $http);
		auraCreate.objectManagement($scope, $http);
		auraCreate.assetManagement($scope, $http);
		auraCreate.statManagement($scope, $http);
		auraCreate.dashboard($scope);
		auraCreate.firebaseManagement($scope);
		auraCreate.viewController($scope);
		auraCreate.carouselControls($scope);
		auraCreate.resetControls($scope);
		auraCreate.fileUpload($scope);
		auraCreate.modals($scope);
		auraCreate.locationCalculations($scope);

		//Initialize User and their organizations and displays the dashboard
		$scope.userName = "Wynston Ramsay";
		$scope.loadOrganizations();
	}

// -------------------------------------------------Global functions--------------------------------------------------------
	//creates a random id for a new beacon/object/organization/etc
    $scope.randID = function(){
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	}

	//replacement of the $apply to safely reload DOM
	$scope.safeApply = function(fn){
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
			  fn();
			}
		} 
		else{
			if(fn){
		    	$scope.$apply(fn);
			} 
			else{
		    	$scope.$apply();
			}
		}
	}

	//when the user requests to sign out, switch to log-in page
	$scope.signOut = function(){
		document.location.href = "index.html";

		//sign out of google auth
		var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
	      console.log('User signed out.');
	    });
	}

	//loads in beacons and objects when an organization is changed, does so in callback fashion
	$scope.loadBeaconsAndObjects = function(callback){
		$http({
		    method : "GET",
		    url : $scope.queryBeaconsByOrg + $scope.curOrg.organization_id,
		    headers: {
        		'Accept': 'application/json',
        		"X-Aura-API-Key": $scope.auraAPIKey
		    }
		  }).then(function mySuccess(response) {
		  	$scope.resetBeaconTypeTally();
		  	//loops over every beacon object in the response and adds it to session storage
		  	//stores the objects as beacons objects in an array that is stored as JSON
		  	var jsonArray = response.data.data;
		  	$scope.beaconsArray = [];
		  	for(var i = 0; i < jsonArray.length; i++){
		  		$scope.beacon = {
		  			beacon_name: jsonArray[i].attributes.name, 
		  			beacon_id: jsonArray[i].attributes.beacon_id, 
		  			organization_id: jsonArray[i].attributes.organization_id, 
		  			beacon_type: $scope.toUpperBeaconType(jsonArray[i].attributes.beacon_type), 
		  			beacon_rawType: jsonArray[i].attributes.beacon_type,
		  			altitude:  jsonArray[i].attributes.altitude, 
		  			latitude: jsonArray[i].attributes.latitude, 
		  			longitude: jsonArray[i].attributes.longitude, 
		  			associated: $scope.getAssociatedType(jsonArray[i].attributes.associated),
		  			associated_id: jsonArray[i].attributes.associated
		  		};
		  		$scope.beaconsArray[i] = $scope.beacon;
		  		$scope.tallyBeaconTypes($scope.beacon.beacon_type);
		  	}
		  	sessionStorage.beaconsArray = JSON.stringify($scope.beaconsArray);
		    }, function myError(response) {
		    	alertFailure("ERROR: failed to load beacons.");
		  });

		  $http({
		    method : "GET",
		    url : $scope.queryObjectsByOrg + $scope.curOrg.organization_id,
		    headers: {
		    	'Accept': 'application/json',
        		"X-Aura-API-Key": $scope.auraAPIKey
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
		  			beacon_name: $scope.findBeaconForObject(jsonArray[i].beacon_id), 
		  			numImage: mediaCounter.numImage,
		  			numAudio: mediaCounter.numAudio, 
		  			numVideo: mediaCounter.numVideo, 
		  			num3D: mediaCounter.num3D
		  		};
		  		$scope.objectsArray[i] = $scope.arObject;
		  	}
		  	sessionStorage.objectsArray = JSON.stringify($scope.objectsArray);
		    }, function myError(response) {
		  });

		  callback();
	}	
});
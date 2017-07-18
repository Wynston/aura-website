//handles the loading, creating, editing, and deletion of objects
auraCreate.objectManagement = function($scope, $http){
	//adds a object for an organization onto the database
	$scope.addObject = function(name, objDesc, objID){
		$scope.findClosestBeacon(function (beacon_id){
			$http({
	        method: 'PUT',
	        url: $scope.queryObjects,
	        data: {
	        	name: name, 
	        	desc: objDesc,
	        	beacon_id: beacon_id, 
	        	arobj_id: objID, 
	        	organization_id: $scope.curOrg.organization_id,
	        	altitude: $scope.newAlt, 
	        	latitude: $scope.newLat, 
	        	longitude: $scope.newLng,
	        	thumbnail: $scope.thumbnailURL
	        },
	        headers: {
	        	"X-Aura-API-Key": $scope.auraAPIKey
			}
			}).then(function mySuccess(response){
				alertSuccess("SUCCESS: the object " + name + " has been successfully created!");
				$scope.loadObjects();
			}, function myError(response) {
				alertFailure("ERROR: failed to create the object " + name + ".");
			});
		});
	}

	//retrieves AR object data from the database and asks the live display to be updated
    //sends the AR objects to session storage
    $scope.loadObjects = function(){
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
    }

    //updates multiple fields of the object
	$scope.updateObject = function(name, desc){
		$http({
        method: 'PUT',
        url: $scope.queryObjects,
        data: {
        	name: name, 
        	desc: desc,
        	beacon_id: $scope.curObj.beacon_id, 
        	arobj_id: $scope.curObj.arobj_id, 
        	organization_id: $scope.curObj.organization_id,
        	altitude: $scope.newAlt, 
        	latitude: $scope.newLat, 
        	longitude: $scope.newLng,
        	thumbnail: $scope.curObj.thumbnail,
        	contents: $scope.curObj.assets
        },
        headers: {
        	"X-Aura-API-Key": $scope.auraAPIKey
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: " + $scope.curObj.name + " has been successfully updated!");
			//reload the object change
			$scope.loadObjects();
		}, function myError(response) {
			alertFailure("ERROR: failed to update " + $scope.curObj.name + "!");
		});
	}

	//updates the location of an object on the server side
	$scope.updateObjectLocation = function(){
		$http({
        method: 'PUT',
        url: $scope.queryObjects,
        data: {
        	name: $scope.curObj.name, 
        	desc: $scope.curObj.description,
        	beacon_id: $scope.curObj.beacon_id, 
        	arobj_id: $scope.curObj.arobj_id, 
        	organization_id: $scope.curObj.organization_id,
        	altitude: $scope.curObj.altitude, 
        	latitude: $scope.curObj.latitude, 
        	longitude: $scope.curObj.longitude,
        	thumbnail: $scope.curObj.thumbnail,
        	contents: $scope.curObj.assets
        },
        headers: {
        	"X-Aura-API-Key": $scope.auraAPIKey
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: " + $scope.curObj.name + " has been successfully updated!");
			//reload the object change
			$scope.loadObjects();
			$scope.displayObject($scope.curObj);
		}, function myError(response) {
			alertFailure("ERROR: failed to update " + $scope.curObj.name + "!");
		});
	}

	//updates the service beacon of an object
	$scope.updateBeacForObject = function(beacon){
		$http({
        method: 'PUT',
        url: $scope.queryObjects,
        data: {
        	name: $scope.curObj.name, 
        	desc: $scope.curObj.description,
        	beacon_id: beacon.beacon_id, 
        	arobj_id: $scope.curObj.arobj_id, 
        	organization_id: $scope.curObj.organization_id,
        	altitude: $scope.curObj.altitude, 
        	latitude: $scope.curObj.latitude, 
        	longitude: $scope.curObj.longitude,
        	thumbnail: $scope.curObj.thumbnail,
        	contents: $scope.curObj.assets
        },
        headers: {
        	"X-Aura-API-Key": $scope.auraAPIKey
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: " + $scope.curObj.name + " has been successfully updated!");
			//reload the object change
			$scope.loadObjects();
			$scope.displayObject($scope.curObj);
		}, function myError(response) {
				alertFailure("ERROR: failed to update " + $scope.curObj.name + "!");
		});
	}


	//updates an objects description on the server side
	$scope.updateObjectDescription = function(description){
		$scope.curObj.description = description;
		$http({
        method: 'PUT',
        url: $scope.queryObjects,
        data: {
        	name: $scope.curObj.name, 
        	desc: $scope.curObj.description,
        	beacon_id: $scope.curObj.beacon_id, 
        	arobj_id: $scope.curObj.arobj_id, 
        	organization_id: $scope.curObj.organization_id,
        	altitude: $scope.curObj.altitude, 
        	latitude: $scope.curObj.latitude, 
        	longitude: $scope.curObj.longitude,
        	thumbnail: $scope.curObj.thumbnail,
        	contents: $scope.curObj.assets
        },
        headers: {
        	"X-Aura-API-Key": $scope.auraAPIKey
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: " + $scope.curObj.name + " has been successfully updated!");
			//reload the object change
			$scope.loadObjects();
		}, function myError(response) {
			alertFailure("ERROR: failed to update " + $scope.curObj.name + "!");
		});
	}

	//deletes an object and all of its assetschange
	$scope.removeObject = function(object){
		bootbox.confirm({
		    title: "Delete " + object.name + "?",
		    message: "Are you sure you want to permanently delete " + object.name + "?",
		    buttons: {
		        cancel: {
		            label: '<i class="fa fa-times"></i> Cancel',
		            className: 'btn-danger'
		        },
		        confirm: {
		            label: '<i class="fa fa-check"></i> Confirm',
		            className: 'btn-success'
		        }
		    },
		    callback: function (result) {
		        if(result){
		        	//Delete all assets associated with the object from firebase
					for(var i = 0; i < object.assets.length; i++){
						$scope.removeAsset(object.assets[i]);
					}

					//remove the object thumbnail from firebase

					//Delete the object
					$http({
				        method: 'Delete',
				        url: $scope.queryObjects + "/" + object.arobj_id,
				        headers: {
				        	"X-Aura-API-Key": $scope.auraAPIKey
						}
					}).then(function mySuccess(response) {
						alertSuccess("SUCCESS: " + object.name + " has been successfully deleted!");
					}, function myError(response) {
					    alertFailure("ERROR: failed to delete " + object.name + ".");
					});
		        }
		    }
		});
	}

//----------------------------------------Object Helper Functions-------------------------------------------------------------------
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

	//finds the beacon associated with an object of the same beacon id
    $scope.findBeaconForObject = function(beacon_id){
    	var beaconsArray = JSON.parse(sessionStorage.beaconsArray);
		for(var i = 0; i < beaconsArray.length; i++){
			if(beaconsArray[i].beacon_id == beacon_id){
				return beaconsArray[i].beacon_name;
			}
		}
    }

    //finds the nearest beacon for a newly created object
    $scope.findClosestBeacon = function(callback){
	  	var closestBeacon = null;
	  	var closest;
	  	for(var i = 0; i < $scope.beaconsArray.length; i++){
	  		var distance = $scope.findDistanceBetweenLatLng($scope.newLat, $scope.newLng, $scope.beaconsArray[i].latitude, $scope.beaconsArray[i].longitude);
	  		if(i == 0){
	  			closestBeacon = $scope.beaconsArray[i];
	  			closest = distance;
	  		}
	  		else{
	  			if(distance < closest){
	  				closestBeacon = $scope.beaconsArray[i];
	  				closest = distance;
	  			}
	  		}
	  	}
	  	//no beacons within 50m of the objects location
	  	if(closest > 50 || closestBeacon == null){
	  		$('#addObjectModal').modal('hide');
	  		//prompt user to make a new beacon within range
	  		bootbox.confirm({
			    title: "Create new beacon?",
			    message: "No beacons within range. Create a new one at this location?",
			    buttons: {
			        cancel: {
			            label: '<i class="fa fa-times"></i> Cancel',
			            className: 'btn-danger'
			        },
			        confirm: {
			            label: '<i class="fa fa-check"></i> Confirm',
			            className: 'btn-success'
			        }
			    },
			    callback: function (result) {
			       if(result){
			       		var id = $scope.randID();
			       		$scope.closestBeaconID =  id;
	  					$('#beaconForObjectModal').modal('show'); 
	  					callback(id);
	  				}
	  				else{
	  					callback(null);
	  				} 			    
	  			}
			});
	  	}
	  	else{
	  		callback(closestBeacon.beacon_id);
	  	}
    }
}
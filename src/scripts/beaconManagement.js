//manages the loading, creation, editing, and deletion of beacons
auraCreate.beaconManagement = function($scope, $http){
	//adds a beacon to an organization onto the database
	$scope.addBeacon = function(name, type){
		$scope.newBeacon = {
        	name: name, 
        	beacon_id: $scope.randID(), 
        	beacon_type: type.toLowerCase(), 
        	altitude: $scope.newAlt, 
        	latitude: $scope.newLat, 
        	longitude: $scope.newLng,
        	organization_id: $scope.curOrg.id,
        	associated: null
        }

		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/newbeacon',
        data: $scope.newBeacon,
        headers: {
        	"X-Aura-API-Key": $scope.AuraAPIKEY
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: the beacon " + name + " has been successfully created!");
			$scope.loadBeacons();
		}, function myError(response) {
		    alertFailure("ERROR: failed to create the beacon " + name + ".");
		});
	}

	//adding a beacon at an objects location 
	$scope.addBeaconForObject = function(name, type){
		$scope.newBeacon = {
        	name: name, 
        	beacon_id: $scope.closestBeaconID, 
        	beacon_type: type.toLowerCase(), 
        	altitude: $scope.newAlt, 
        	latitude: $scope.newLat, 
        	longitude: $scope.newLng,
        	organization_id: $scope.curOrg.id,
        	associated: null
        }
        $scope.closestBeacon = $scope.newBeacon;

		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/newbeacon',
        data: $scope.newBeacon,
        headers: {
        	"X-Aura-API-Key": $scope.auraAPIKey
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: the beacon " + name + " has been successfully created!");
			$scope.loadBeacons();
		}, function myError(response) {
		    alertFailure("ERROR: failed to create the beacon " + name + ".");
		});
	}

	//retrieves all the beacons from the database for the organization
    $scope.loadBeacons = function(){
		$http({
		    method : "GET",
		    url : "https://website-155919.appspot.com/api/v1.0/newbeacon",
		    headers: {
        		'Accept': 'application/json',
        		"X-Aura-API-Key": $scope.auraAPIKey
		    }
		  }).then(function mySuccess(response) {
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
		  			associated: getAssociatedType(jsonArray[i].attributes.associated),
		  			associated_id: jsonArray[i].attributes.associated
		  		};
		  		$scope.beaconsArray[i] = $scope.beacon;
		  	}
		  	sessionStorage.beaconsArray = JSON.stringify($scope.beaconsArray);

		    }, function myError(response) {
		  });
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
    		alertFailure("Error: beacon not found.");
    	}
    }

    //updates multiple fields of the beacon at once
	$scope.updateBeacon = function(updatedName, updatedType){
		var updatedBeacon = {
			name: updatedName,
			beacon_type: updatedType.toLowerCase(),
        	beacon_id: $scope.curBeacon.beacon_id, 
        	altitude: $scope.newAlt, 
        	latitude: $scope.newLat, 
        	longitude: $scope.newLng,
        	organization_id: $scope.curBeacon.organization_id,
        	associated: $scope.curBeacon.associated_id
        }
		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/newbeacon',
        data: updatedBeacon,
        headers: {
        	"X-Aura-API-Key": $scope.auraAPIKey
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: " + $scope.curBeacon.beacon_name + " has been successfully updated!");
			$scope.loadBeacons();
		}, function myError(response) {
		    alertFailure("ERROR: failed to update " + $scope.curBeacon.beacon_name + "!");
		});
	}

	//updates a beacons location on the server side
	$scope.updateBeaconLocation = function(){
		var updatedBeacon = {
			name: $scope.curBeacon.beacon_name,
			beacon_type: $scope.curBeacon.beacon_rawType,
        	beacon_id: $scope.curBeacon.beacon_id, 
        	altitude: $scope.curBeacon.altitude, 
        	latitude: $scope.curBeacon.latitude, 
        	longitude: $scope.curBeacon.longitude,
        	organization_id: $scope.curBeacon.organization_id,
        	associated: $scope.curBeacon.associated_id
        }
		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/newbeacon',
        data: updatedBeacon,
        headers: {
        	"X-Aura-API-Key": $scope.auraAPIKey
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: " + $scope.curBeacon.beacon_name + " has been successfully updated!");
			$scope.displayBeacon(updatedBeacon); 	
		}, function myError(response) {
		    alertFailure("ERROR: failed to update " + $scope.curBeacon.beacon_name + "!");
		});
	}

	//updates a beacons type on the server side
	$scope.updateBeaconType = function(updatedType){
		var updatedBeacon = {
			name: $scope.curBeacon.beacon_name,
			beacon_type: updatedType.toLowerCase(),
        	beacon_id: $scope.curBeacon.beacon_id, 
        	altitude: $scope.curBeacon.altitude, 
        	latitude: $scope.curBeacon.latitude, 
        	longitude: $scope.curBeacon.longitude,
        	organization_id: $scope.curBeacon.organization_id,
        	associated: $scope.curBeacon.associated_id
        }

		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/newbeacon',
        data: updatedBeacon,
        headers: {
        	"X-Aura-API-Key": $scope.auraAPIKey
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: " + $scope.curBeacon.beacon_name + " has been successfully updated!");
			$scope.displayBeacon(updatedBeacon);
		}, function myError(response) {
		    alertFailure("ERROR: failed to update " + $scope.curBeacon.beacon_name + "!");
		});
	}

	//deletes a beacon from the server and local
	$scope.removeBeacon = function(beacon){
		bootbox.confirm({
		    title: "Delete " + beacon.beacon_name + "?",
		    message: "Are you sure you want to permanently delete " + beacon.beacon_name + "?",
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
		        	//Delete the beacon
					$http({
				        method: 'Delete',
				        url: 'https://website-155919.appspot.com/api/v1.0/newbeacon/' + beacon.beacon_id,
				        headers: {
				        	"X-Aura-API-Key": $scope.auraAPIKey
						}
					}).then(function mySuccess(response) {
						alertSuccess("SUCCESS: " + beacon.beacon_name + " has been successfully deleted!");
						$scope.loadBeacons();
					}, function myError(response){
					    alertFailure("ERROR: failed to delete " + beacon.beacon_name + ".");
					});
		        }
		    }
		});
	}

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
	$scope.toUpperBeaconType = function(beaconType){
		var type = "";
		for(var i = 0; i < $scope.beaconTypes.length; i++){
			if(beaconType == $scope.beaconTypes[i].toLowerCase()){
				type = $scope.beaconTypes[i];
				break;
			}
		}
		return type;
	}
}
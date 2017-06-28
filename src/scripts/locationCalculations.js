// Math on positional data of objects and beacons and their relations
auraCreate.locationCalculations = function($scope){
	//changes the location of a beacon or object from google maps and uploads it to the database
    //assures the user wishes to make the change to the beacon
    $scope.changeLocation = function(pos, type){
    	switch(type){
    		case "beacon":
    			bootbox.confirm({
				    title: "Change " + $scope.curBeacon.beacon_name + "?",
				    message: "Are you sure you want to change " + $scope.curBeacon.beacon_name + "'s location?",
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
				        	$scope.curBeacon.latitude = pos.lat;
	    					$scope.curBeacon.longitude = pos.lng;
	    					$scope.calcAltitude(pos, type);
				        }
				        else{
				        	$scope.displayBeacon($scope.curBeacon);
				        }
				    }
				});
    			break;
    		case "object":
    			bootbox.confirm({
				    title: "Change " + $scope.curObj.name +"?",
				    message: "Are you sure you want to change " + $scope.curObj.name + "'s location?",
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
				        	$scope.curObj.latitude = pos.lat;
		    				$scope.curObj.longitude = pos.lng;
		    				$scope.calcAltitude(pos, type);
				        }
				        else{
				        	$scope.displayObject($scope.curObj);
				        }
				    }
				});
    			break;
        }
    }

    //updates a beacon's or objects altitude and requests to be uploaded to the server
    $scope.calcAltitude = function(latLng, type) {
		var locations = [];
			
		locations.push(latLng);
		
		// Create a LocationElevationRequest object using the array's one value
		var positionalRequest = {'locations': locations};
		
		elevator = new google.maps.ElevationService();
		// Initiate the location request
		elevator.getElevationForLocations(positionalRequest, function(results, status){
			if (status == google.maps.ElevationStatus.OK) 
			{
				// Retrieve the first result
				if (results[0]) 
				{
					if(type == "beacon"){
						$scope.curBeacon.altitude = results[0].elevation.toFixed(3);
						$scope.updateBeaconLocation();
					}
					if(type == "object"){
						$scope.curObj.altitude = results[0].elevation.toFixed(3);
						$scope.updateObjectLocation();
					}
				} 
				else 
				{
					alertFailure("No results found");
				}
		  	} 
		  	else 
		  	{
		  		alertFailure("Elevation service failed due to: " + status);
			}
		});
	}

	 //finds the distance between two latlng points in meters
    $scope.findDistanceBetweenLatLng = function(lat1,lon1,lat2,lon2) {
	  var R = 6371000; // Radius of the earth in m
	  var dLat = $scope.deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = $scope.deg2rad(lon2-lon1); 
	  var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos($scope.deg2rad(lat1)) * Math.cos($scope.deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
	}

	//helper function for $scope.findDistanceBetweenLatLng
	$scope.deg2rad = function(deg){
	  return deg * (Math.PI/180);
	}
}
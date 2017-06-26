//-------------------------------------google maps handling begins-------------------------------

//dynamically load in google maps
function loadGoogleScript(){
	$( document ).ready(function() {
		google.load("visualization", "1", {"callback" : initMap});
	});
}

//initMap function for google maps api
function initMap(){
	$('#addBeaconModal').on('shown.bs.modal', function (){
		var beacons = JSON.parse(sessionStorage.beaconsArray);
	    var map = new google.maps.Map(document.getElementById('googleMapsAddBeacon'), {
	      zoom: 11,
	      center: findDPCenter(beacons)
	    });
	    for (var i = 0; i < beacons.length; i++ ) {
	      beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
          // Adds a 100m radius circle around each beacon
          var cityCircle = new google.maps.Circle({
            strokeColor: '#00FFE4',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: '#00FFE4',
            fillOpacity: 0.35,
            map: map,
            center: beaconCenter,
            radius: 100,
            clickable: false
          });
        }
	    google.maps.event.addListener(map, 'click', function(event) {
		   placeMarker(event.latLng);
		   //places a marker at a given location, used for onclick triggers
			//places a marker at a given location, used for onclick triggers
			function placeMarker(location) {
				if ( marker ) {
			    	marker.setPosition(location);
			  	} 
			  	else{
			    	marker = new google.maps.Marker({
				    	position: location,
				    	map: map
			    	});
			  	}
			  	var pos = (JSON.parse(JSON.stringify(location)));
			  	getElevation(location);
			  	angular.element(document.getElementById('MAIN')).scope().newLat = pos.lat;
            	angular.element(document.getElementById('MAIN')).scope().newLng = pos.lng;
			}
		});
	});
	$('#addObjectModal').on('shown.bs.modal', function () {
		var beacons = JSON.parse(sessionStorage.beaconsArray);
	    var map = new google.maps.Map(document.getElementById('googleMapsAddObject'), {
	      zoom: 11,
	      center: findDPCenter(beacons)
	    });
	    for (var i = 0; i < beacons.length; i++ ) {
	      beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
          // Adds a 100m radius circle around each beacon
          var beaconCircle = new google.maps.Circle({
            strokeColor: '#00FFE4',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: '#00FFE4',
            fillOpacity: 0.35,
            map: map,
            center: beaconCenter,
            radius: 100,
            clickable: false
          });
        }
	    google.maps.event.addListener(map, 'click', function(event) {
		   placeMarker(event.latLng);
		   //places a marker at a given location, used for onclick triggers
			function placeMarker(location) {
				if ( marker ) {
			    	marker.setPosition(location);;
			  	} 
			  	else{
			    	marker = new google.maps.Marker({
			    	position: location,
			    	map: map
			    	});
			  	}
			  	var pos = (JSON.parse(JSON.stringify(location)));
			  	getElevation(location);
			  	angular.element(document.getElementById('MAIN')).scope().newLat = pos.lat;
            	angular.element(document.getElementById('MAIN')).scope().newLng = pos.lng;
			}
		});
	});

	$('#addObjectAtBeaconModal').on('shown.bs.modal', function(){
		var beacon = JSON.parse(sessionStorage.curBeacon);
		var beaconCenter = new google.maps.LatLng(beacon.latitude, beacon.longitude);
	    var map = new google.maps.Map(document.getElementById('googleMapsAddObjectAtBeacon'), {
	      zoom: 14,
	      center: beaconCenter
	    });
      // Adds a 100m radius circle around each beacon
      var beaconCircle = new google.maps.Circle({
        strokeColor: '#00FFE4',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        fillColor: '#00FFE4',
        fillOpacity: 0.35,
        map: map,
        center: beaconCenter,
        radius: 100,
        clickable: false
      });
	    google.maps.event.addListener(map, 'click', function(event) {
		   placeMarker(event.latLng);
		   //places a marker at a given location, used for onclick triggers
			function placeMarker(location) {
				if ( marker ) {
			    	marker.setPosition(location);;
			  	} 
			  	else{
			    	marker = new google.maps.Marker({
			    	position: location,
			    	map: map
			    	});
			  	}
			  	var pos = (JSON.parse(JSON.stringify(location)));
			  	getElevation(location);
			  	angular.element(document.getElementById('MAIN')).scope().newLat = pos.lat;
            	angular.element(document.getElementById('MAIN')).scope().newLng = pos.lng;
			}
		});
	});

	$('#editBeacForObjModal').on('shown.bs.modal', function () {
		var beacons = JSON.parse(sessionStorage.beaconsArray);
	    var map = new google.maps.Map(document.getElementById('googleMapsEditBeacForObj'), {
	      zoom: 11,
	      center: findDPCenter(beacons)
	    });
	    for (var i = 0; i < beacons.length; i++ ) {
		      var beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
	          // Adds a 100m radius circle around each beacon
	          var beaconCircle = new google.maps.Circle({
	            strokeColor: '#00FFE4',
	            strokeOpacity: 0.8,
	            strokeWeight: 4,
	            fillColor: '#00FFE4',
	            fillOpacity: 0.35,
	            map: map,
	            center: beaconCenter,
	            radius: 100,
	            clickable: false
	          });
	          var marker = new google.maps.Marker({
			      position: beaconCenter,
			      map: map,
			      draggable: false,
		    	  animation: google.maps.Animation.DROP,
		    	  beacon: beacons[i]
			  });
	    	  google.maps.event.addListener(marker, 'click', function(){
	    	  	var curObj = angular.element(document.getElementById('MAIN')).scope().curObj;
	    	  	var beacon = this.beacon;
	    	  	bootbox.confirm({
				    title: "Change " + curObj.name + "?",
				    message: "Are you sure you want to change " + curObj.name + "'s service beacon to " + this.beacon.beacon_name + "?",
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
				        	angular.element(document.getElementById('MAIN')).scope().updateBeacForObject(beacon);
	    	  				$('#editBeacForObjModal').modal('hide');
				        }
				    }
				});
	    	  });
        }
	});

	if(sessionStorage.curView == "beacon" && document.getElementById("googleMapsBeacon")){
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
		    geocodePosition(JSON.stringify(marker.getPosition()), "beacon");
		});
	}
	else if(sessionStorage.curView == "object" && document.getElementById('googleMapsObject')){
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
		    geocodePosition(JSON.stringify(marker.getPosition()), "object");
		});
	}
	else if(sessionStorage.curView == "beaconsList" && document.getElementById('googleMapsBeacons')){
		var beacons = JSON.parse(sessionStorage.beaconsArray);
		var map = new google.maps.Map(document.getElementById('googleMapsBeacons'), {
          zoom: 11,
          center: findDPCenter(JSON.parse(sessionStorage.beaconsArray))
        });
        for (var i = 0; i < beacons.length; i++ ) {
		      var beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
	          // Adds a 100m radius circle around each beacon
	          var beaconCircle = new google.maps.Circle({
	            strokeColor: '#00FFE4',
	            strokeOpacity: 0.8,
	            strokeWeight: 4,
	            fillColor: '#00FFE4',
	            fillOpacity: 0.35,
	            map: map,
	            center: beaconCenter,
	            radius: 100,
	            clickable: false
	          });
	          var marker = new google.maps.Marker({
			      position: beaconCenter,
			      map: map,
			      draggable: false,
		    	  animation: google.maps.Animation.DROP,
		    	  beacon: beacons[i],
		    	  icon: 'images/auro_logo.png'
			  });
	    	  google.maps.event.addListener(marker, 'click', function(){
	    	  	if(document.getElementById('googleMapsBeacons')){
	    	  		angular.element(document.getElementById('MAIN')).scope().displayBeacon(this.beacon);
	    	  	}
	    	  });
        }
  //       heatmap = new google.maps.visualization.HeatmapLayer({
  //         data: getDataPoints(JSON.parse(sessionStorage.beaconsArray)),
  //         map: map,
  //         radius: 30
  //       });
		// heatmap.setMap(map);
	}
	else if(sessionStorage.curView == "objectsList" && document.getElementById('googleMapsObjects')){
		var objects = JSON.parse(sessionStorage.objectsArray);
		var map = new google.maps.Map(document.getElementById('googleMapsObjects'),{
          zoom: 11,
          center: findDPCenter(JSON.parse(sessionStorage.objectsArray))
        });
        for (var i = 0; i < objects.length; i++ ) {
		      var objectCenter = new google.maps.LatLng(objects[i].latitude, objects[i].longitude);
	          var marker = new google.maps.Marker({
			      position: objectCenter,
			      map: map,
			      draggable: false,
		    	  animation: google.maps.Animation.DROP,
		    	  object: objects[i]
			  });
	    	  google.maps.event.addListener(marker, 'click', function(){
	    	  	angular.element(document.getElementById('MAIN')).scope().displayObject(this.object);
	    	  });
        }
  //       heatmap = new google.maps.visualization.HeatmapLayer({
  //         data: getDataPoints(JSON.parse(sessionStorage.objectsArray)),
  //         map: map,
  //         radius: 30
  //       });
		// heatmap.setMap(map);
	}
	else if(sessionStorage.curView == "stats" && document.getElementById('googleMapsStats')){
		var beacons = JSON.parse(sessionStorage.beaconsArray);
		var stats = JSON.parse(sessionStorage.statsArray);
		var map = new google.maps.Map(document.getElementById('googleMapsStats'), {
          zoom: 11,
          center: findDPCenter(stats),
        });
        for (var i = 0; i < beacons.length; i++ ) {
	      beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
          // Adds a 100m radius circle around each beacon
          var cityCircle = new google.maps.Circle({
            strokeColor: '#00FFE4',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: '#00FFE4',
            fillOpacity: 0.35,
            map: map,
            center: beaconCenter,
            radius: 100,
            clickable: false
          });
        }
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: getDataPoints(stats),
          map: map,
          radius: 30
        });
		heatmap.setMap(map);
	}
}

//gathers the co-ordinates of all the elements of an array to display in a heat map
function getDataPoints(dataArray){
	var dataPoints = []
	for(var i = 0; i < dataArray.length; i++){
		dataPoints[i] = new google.maps.LatLng(dataArray[i].latitude, dataArray[i].longitude);
	}
	return dataPoints;
}

//finds the center of given datapoints
function findDPCenter(dataArray){
	// var avgLat = 0;
	// var avgLong = 0;
	// for(var i = 0; i < dataArray.length; i++){
	// 	avgLat += dataArray[i].latitude;
	// 	avgLong += dataArray[i].longitude;
	// }
	// var center = {lat: avgLat / dataArray.length, lng: avgLong / dataArray.length};


	//saskatoon hardcoded in as the center
	var center ={lat: 52.1332, lng: -106.6700};

	return center;
}


//updates the location of a marker when moved (by mouse)
function geocodePosition(loc, type) {
   var pos = JSON.parse(loc);
   geocoder = new google.maps.Geocoder();
   geocoder.geocode({
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


//finds the altitude of a latlng location using elevation service
function getElevation(latLng) 
{
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
				angular.element(document.getElementById('MAIN')).scope().newAlt = results[0].elevation.toFixed(3);
			} 
			else 
			{
				angular.element(document.getElementById('MAIN')).scope().alertFailure("No results found");
			}
	  	} 
	  	else 
	  	{
	  		angular.element(document.getElementById('MAIN')).scope().alertFailure("Elevation service failed due to: " + status);
		}
	});
}

//-------------------------------------end of google maps handling-------------------------------

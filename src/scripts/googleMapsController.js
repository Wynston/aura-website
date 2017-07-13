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
	      center: findDPCenter(beacons),
	      styles: darkThemedMap(),
          backgroundColor: '#333'
	    });
	    for (var i = 0; i < beacons.length; i++ ) {
	      beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
          // Adds a 50m radius circle around each beacon
          var cityCircle = new google.maps.Circle({
            strokeColor: '#00FFE4',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: '#00FFE4',
            fillOpacity: 0.35,
            map: map,
            center: beaconCenter,
            radius: 50,
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
				    	map: map,
				    	draggable: true
			    	});
			    	google.maps.event.addListener(marker, 'dragend', function(event){
						moveMarker(event.latLng);
					});
			  	}
			  	var pos = (JSON.parse(JSON.stringify(location)));
			  	getElevation(location);
			  	angular.element(document.getElementById('MAIN')).scope().newLat = pos.lat;
            	angular.element(document.getElementById('MAIN')).scope().newLng = pos.lng;
			}
		});
	});
	$('#editBeaconModal').on('shown.bs.modal', function (){
		var beacons = JSON.parse(sessionStorage.beaconsArray);
		var curBeacon = JSON.parse(sessionStorage.curBeacon);
		var curBeaconLoc = new google.maps.LatLng(curBeacon.latitude, curBeacon.longitude);
	    var map = new google.maps.Map(document.getElementById('googleMapsEditBeacon'), {
	      zoom: 14,
	      center: curBeaconLoc,
	      styles: darkThemedMap(),
          backgroundColor: '#333'
	    });
	    var marker = new google.maps.Marker({
	      position: curBeaconLoc,
	      map: map,
	      draggable:true,
    	  animation: google.maps.Animation.DROP
	    });
	    for (var i = 0; i < beacons.length; i++ ) {
	      beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
          // Adds a 50m radius circle around each beacon
          var cityCircle = new google.maps.Circle({
            strokeColor: '#00FFE4',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: '#00FFE4',
            fillOpacity: 0.35,
            map: map,
            center: beaconCenter,
            radius: 50,
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
	    //moves the marker and updates the lat lng coordinates
		google.maps.event.addListener(marker, 'dragend', function(event){
			moveMarker(event.latLng);
		});
	});
	$('#addObjectModal').on('shown.bs.modal', function () {
		var beacons = JSON.parse(sessionStorage.beaconsArray);
	    var map = new google.maps.Map(document.getElementById('googleMapsAddObject'), {
	      zoom: 11,
	      center: findDPCenter(beacons),
	      styles: darkThemedMap(),
          backgroundColor: '#333'
	    });
	    for (var i = 0; i < beacons.length; i++ ) {
	      beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
          // Adds a 50m radius circle around each beacon
          var beaconCircle = new google.maps.Circle({
            strokeColor: '#00FFE4',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: '#00FFE4',
            fillOpacity: 0.35,
            map: map,
            center: beaconCenter,
            radius: 50,
            clickable: false
          });
        }
	    google.maps.event.addListener(map, 'click', function(event) {
		   placeMarker(event.latLng);
		   //places a marker at a given location, used for onclick triggers
			function placeMarker(location) {
				if ( marker ) {
			    	marker.setPosition(location);
			  	} 
			  	else{
			    	marker = new google.maps.Marker({
				    	position: location,
				    	map: map,
				    	draggable: true
			    	});
			    	//moves the marker and updates the lat lng coordinates
					google.maps.event.addListener(marker, 'dragend', function(event){
						placeMarker(event.latLng);
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
	      center: beaconCenter,
	      styles: darkThemedMap(),
          backgroundColor: '#333'
	    });
      // Adds a 50m radius circle around each beacon
      var beaconCircle = new google.maps.Circle({
        strokeColor: '#00FFE4',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        fillColor: '#00FFE4',
        fillOpacity: 0.35,
        map: map,
        center: beaconCenter,
        radius: 50,
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
			    	map: map,
			    	draggable: true
			    	});
			    	 //moves the marker and updates the lat lng coordinates
					google.maps.event.addListener(marker, 'dragend', function(event){
						moveMarker(event.latLng);
					});
			  	}
			  	var pos = (JSON.parse(JSON.stringify(location)));
			  	getElevation(location);
			  	angular.element(document.getElementById('MAIN')).scope().newLat = pos.lat;
            	angular.element(document.getElementById('MAIN')).scope().newLng = pos.lng;
			}
		});
	});

	$('#editObjectModal').on('shown.bs.modal', function (){
		var beacons = JSON.parse(sessionStorage.beaconsArray);
		var curObj = JSON.parse(sessionStorage.curObj);
		var curObjLoc = new google.maps.LatLng(curObj.latitude, curObj.longitude);
	    var map = new google.maps.Map(document.getElementById('googleMapsEditObject'), {
	      zoom: 14,
	      center: curObjLoc,
	      styles: darkThemedMap(),
          backgroundColor: '#333'
	    });
	    var marker = new google.maps.Marker({
	      position: curObjLoc,
	      map: map,
	      draggable:true,
    	  animation: google.maps.Animation.DROP
	    });
	    for (var i = 0; i < beacons.length; i++ ) {
	      beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
          // Adds a 50m radius circle around each beacon
          var cityCircle = new google.maps.Circle({
            strokeColor: '#00FFE4',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: '#00FFE4',
            fillOpacity: 0.35,
            map: map,
            center: beaconCenter,
            radius: 50,
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
	    //moves the marker and updates the lat lng coordinates
		google.maps.event.addListener(marker, 'dragend', function(event){
			moveMarker(event.latLng);
			function moveMarker(location){
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
	      center: findDPCenter(beacons),
	      styles: darkThemedMap(),
          backgroundColor: '#333'
	    });
	    for (var i = 0; i < beacons.length; i++ ) {
		      var beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
	          // Adds a 50m radius circle around each beacon
	          var beaconCircle = new google.maps.Circle({
	            strokeColor: '#00FFE4',
	            strokeOpacity: 0.8,
	            strokeWeight: 4,
	            fillColor: '#00FFE4',
	            fillOpacity: 0.35,
	            map: map,
	            center: beaconCenter,
	            radius: 50,
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
	      center: loc,
	      styles: darkThemedMap(),
          backgroundColor: '#333'
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
	      center: loc,
	      styles: darkThemedMap(),
          backgroundColor: '#333'
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
          center: findDPCenter(JSON.parse(sessionStorage.beaconsArray)),
          styles: darkThemedMap(),
          backgroundColor: '#333'
        });
        var infoWindows = [];
        var markers = [];
        for (var i = 0; i < beacons.length; i++ ) {
        	//info window for beacon
        	var idButton = "btn-" + beacons[i].beacon_id;
        	var contentString = "<button id='"+idButton+"' class='btn btn-sm btn-info'>Beacon: " + beacons[i].beacon_name 
        		+ "</button><h6>Type: " + beacons[i].beacon_type + "</h6><h6>Altitude: " + beacons[i].altitude +
        		"</h6><h6>Latitude: " + beacons[i].latitude + "</h6><h6>Longitude: " + beacons[i].longitude + "</h6>";
	        infoWindows[i] = new google.maps.InfoWindow({
	          content: contentString,
	          maxWidth: 300,
	          beacon: beacons[i],
	          id: idButton
	        });

	        //button for routing to an beacon
	        google.maps.event.addListener(infoWindows[i], 'domready', function(){
			    var link = $('#' + this.id)
			    var beacon = this.beacon;
			    google.maps.event.addDomListener(link[0], 'click', function(){
			    	angular.element(document.getElementById('MAIN')).scope().displayBeacon(beacon);
			    });
			});

		      var beaconCenter = new google.maps.LatLng(beacons[i].latitude, beacons[i].longitude);
	          // Adds a 50m radius circle around each beacon
	          var beaconCircle = new google.maps.Circle({
	            strokeColor: '#00FFE4',
	            strokeOpacity: 0.8,
	            strokeWeight: 4,
	            fillColor: '#00FFE4',
	            fillOpacity: 0.35,
	            map: map,
	            center: beaconCenter,
	            radius: 50,
	            clickable: false
	          });
	          markers[i] = new google.maps.Marker({
			      position: beaconCenter,
			      map: map,
			      draggable: false,
		    	  animation: google.maps.Animation.DROP,
		    	  beacon: beacons[i]
			  });

	    	  google.maps.event.addListener(markers[i], 'click', (function(marker, i) {
			  return function() {
			    infoWindows[i].open(map, markers[i]);
			  }
			})(markers[i], i));
        }
	}
	else if(sessionStorage.curView == "objectsList" && document.getElementById('googleMapsObjects')){
		var objects = JSON.parse(sessionStorage.objectsArray);
		var map = new google.maps.Map(document.getElementById('googleMapsObjects'),{
          zoom: 11,
          center: findDPCenter(JSON.parse(sessionStorage.objectsArray)),
          styles: darkThemedMap(),
          backgroundColor: '#333'
        });
        var infoWindows = [];
        var markers = [];
        for (var i = 0; i < objects.length; i++ ) {
        	//info window for object
        	var idButton = "btn-" + objects[i].arobj_id;
        	var contentString = "<button id='"+idButton+"' class='btn btn-sm btn-info'>Object: " + objects[i].name 
        	+ "</button><h6>Description: " + objects[i].description
        	+ "</h6><h6>Altitude: " + objects[i].altitude +
        		"</h6><h6>Latitude: " + objects[i].latitude + "</h6><h6>Longitude: " + objects[i].longitude + "</h6>";
	        infoWindows[i] = new google.maps.InfoWindow({
	          content: contentString,
	          maxWidth: 300,
	          object: objects[i],
	          id: idButton
	        });

	        //button for routing to an object
	        google.maps.event.addListener(infoWindows[i], 'domready', function(){
			    var link = $('#' + this.id)
			    var obj = this.object;
			    google.maps.event.addDomListener(link[0], 'click', function(){
			    	angular.element(document.getElementById('MAIN')).scope().displayObject(obj);
			    });
			});

	        //marker for object
			var objectCenter = new google.maps.LatLng(objects[i].latitude, objects[i].longitude);
			markers[i] = new google.maps.Marker({
			  position: objectCenter,
			  map: map,
			  draggable: false,
			  animation: google.maps.Animation.DROP,
			  object: objects[i]
			}); 

			google.maps.event.addListener(markers[i], 'click', (function(marker, i) {
			  return function() {
			    infoWindows[i].open(map, markers[i]);
			  }
			})(markers[i], i));
        }
	}
	else if(sessionStorage.curView == "stats"  && document.getElementById('googleMapsStats')){
		var stats = JSON.parse(sessionStorage.statsArray);
		var map = new google.maps.Map(document.getElementById('googleMapsStats'), {
          zoom: 11,
          center: findDPCenter(stats),
          styles: darkThemedMap(),
          backgroundColor: '#333'
        });
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: getDataPoints(stats),
          maxIntensity: 4,
          opacity: 0.75,
          radius: 10
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


//updates the new marker location in the scope
function moveMarker(location){
	var pos = (JSON.parse(JSON.stringify(location)));
	getElevation(location);
  	angular.element(document.getElementById('MAIN')).scope().newLat = pos.lat;
	angular.element(document.getElementById('MAIN')).scope().newLng = pos.lng;
}

//returns a dark theme of google maps styling
function darkThemedMap(){
	return [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ];
}
//-------------------------------------end of google maps handling-------------------------------

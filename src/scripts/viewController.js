//controls the live display and various filter
auraCreate.viewController = function($scope){
	//controls which view is to be displayed as well as the title
	$scope.changeView = function(view , org){
		switch(view){
			case "dashboard":
				$scope.changeLiveTitle("Dashboard", false);
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "profileSettings":
				$scope.changeLiveTitle("Profile Settings", false);
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "beaconsList":
				$scope.curOrg = org;
				$scope.changeLiveTitle("Beacons", true);
				$scope.filterTitle="beaconsView";
				$scope.changeViewType('List');
				$scope.loadBeacons();
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "objectsList":
				$scope.curOrg = org;
				$scope.changeLiveTitle("Objects", true);
				$scope.filterTitle = "objectsView";
				$scope.changeViewType('List');
				$scope.changeBeaconFilter('All');
				$scope.loadObjects();
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "stats":
				$scope.curOrg = org;
				$scope.changeLiveTitle("Stats", false);
				sessionStorage.curView = view;
				$scope.curView = view;
				$scope.loadStats();
				loadGoogleScript();
				break;
		}
	}

	//handles the display of all the live display titles
	$scope.changeLiveTitle = function(primT, bool){
		$scope.primTitle = primT;

		if(bool){
    		document.getElementById("filterTitle").style.display = "inline";
    	}
    	else{
    		document.getElementById("filterTitle").style.display = "none";
    	}
	}

	//changes the view type between list or map
    $scope.changeViewType = function(type){
    	$scope.viewType = type;
    	if(type == "Map"){
    		if($scope.curView == "objectsList"){
    			$scope.filterObjectsByBeacon($scope.beaconsFilter);
    		}
    		loadGoogleScript();
    	}
    }

    //display a single object to the live display
	$scope.displayBeacon = function(beacon){
		$scope.curBeacon = beacon;
		sessionStorage.curBeacon = JSON.stringify($scope.curBeacon);
		$scope.changeLiveTitle("Beacon: " + $scope.curBeacon.beacon_name, false);
		$scope.curView = "beacon";
		sessionStorage.curView = "beacon";
		$scope.safeApply();
		loadGoogleScript(); 
	}

	//used to show a specified beacon's objects when selected from the beacons page
	$scope.displayBeaconObjects = function (){
		$scope.changeView("objectsList", $scope.curOrg);
		$scope.changeBeaconFilter($scope.curBeacon.beacon_name);
	}


	//displays a single object to the live display
	$scope.displayObject = function(obj){
		$scope.curObj = obj;
		sessionStorage.curObj = JSON.stringify($scope.curObj);
		$scope.changeLiveTitle("Object: " + $scope.curObj.name, true);
		$scope.curView = "object";
		sessionStorage.curView = "object";
		$scope.filterTitle = "objectPrivacy";
		$scope.safeApply();
		loadGoogleScript(); 
	}


//----------------------------------------------View Filters---------------------------------------------------------------
	//toggles the description content editable on demand feature
	$scope.toggleObjectDescriptionEdit = function(){
		if($scope.showObjDescEdit){
			$scope.showObjDescEdit = false;
		}
		else{
			$scope.showObjDescEdit = true;
		}
	}

    //returns whether or not an asset is to be displayed based on the filters and media type
    $scope.galleryMediaFilter = function(asset){
		return($scope.galleryFilter[asset.content_type]);
	}

	//alters the objects list to view by a specific beacon or by all beacons
    $scope.changeBeaconFilter = function(filter){
    	$scope.beaconsFilter = filter;
    	if($scope.viewType == "Map"){
    		$scope.filterObjectsByBeacon(filter);
    		loadGoogleScript();
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
	    sessionStorage.objectsArray = JSON.stringify(tempArray);
    }

    //determines the active class of the navbar
    $('.nav.navbar-nav > li').on('click', function(e) {
	    $('.nav.navbar-nav > li').removeClass('active');
	    $(this).addClass('active');
	}); 

	//toggles the popover on certain events
	$scope.showBeaconsFilterTooltip = function(){
		$("#beaconsFilterDiv").tooltip({title: $scope.beaconsFilter, placement: "right"});
	}

	$scope.hideBeaconsFilterTooltip = function(){
		$("#beaconsFilterDiv").tooltip("destroy");
	}
}
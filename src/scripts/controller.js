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
	$scope.changeView = function(view , org){;
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
				$scope.curOrg = org;
				$scope.changeLiveTitle("Beacons", org.name, true);
				$scope.filterTitle="beaconsView";
				$scope.changeViewType('List');
				$scope.loadBeacons();
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "objectsList":
				$scope.curOrg = org;
				$scope.changeLiveTitle("Objects", org.name, true);
				$scope.filterTitle = "objectsView";
				$scope.changeViewType('List');
				$scope.changeBeaconFilter('All');
				$scope.loadObjects();
				sessionStorage.curView = view;
				$scope.curView = view;
				break;
			case "settings":
				$scope.curOrg = org;
				$scope.changeLiveTitle("Settings", org.name, false);
				sessionStorage.curView = view;
				$scope.curView = view;
				$scope.loadGoogleScript();
				break;
			case "stats":
				$scope.curOrg = org;
				$scope.changeLiveTitle("Stats", org.name, false);
				sessionStorage.curView = view;
				$scope.curView = view;
				$scope.loadStats();
				$scope.loadGoogleScript();
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

//-------------------------------end of display functions-----------------------------------

//---------------------------------------upload functions begin----------------------------------------
	
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

	//adds a beacon to an organization onto the database
	$scope.addBeacon = function(name, type){
		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/newbeacon',
        data: {
        	name: name, 
        	beacon_id: $scope.randID(), 
        	beacon_type: type, 
        	altitude: $scope.newAlt, 
        	latitude: $scope.newLat, 
        	longitude: $scope.newLng,
        	organization_id: $scope.curOrg.id
        },
        headers: {
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		}
		}).then(function mySuccess(response) {
			alert(name + " has been successfully added!");
		}, function myError(response) {
		    alert(response.statusText);
		});
		$scope.loadBeacons();
	}

	//adds a object to an organization onto the database
	$scope.addObject = function(name, type){
		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/arobj',
        data: {name: name, beacon_id: $scope.randID(), beacon_type: type, altitude: $scope.newAlt, latitude: $scope.newLat, longitude: $scope.newLng},
        headers: {
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		}
		}).then(function mySuccess(response) {
			alert(name + " has been successfully added!");
		}, function myError(response) {
		    alert(response.statusText);
		});
		$scope.loadObjects();
	}
//---------------------------------------end of upload functions----------------------------------------




// ------------------------------loader functions begin--------------------------------------
// loader functions retrieve any needed data from the database and then proceeds to display that view
// Queries:
// KEY: dGhpc2lzYWRldmVsb3BlcmFwcA==
// https://website-155919.appspot.com/api/v1.0/newbeacon
// https://website-155919.appspot.com/api/v1.0/organization
// https://website-155919.appspot.com/api/v1.0/arobj
// https://website-155919.appspot.com/api/v1.0/user

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

    //loads in stats about an organization to be displayed
    $scope.loadStats = function(){
    	jsonArray = {
			"latlong":[
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092033,"long":-106.590820},
			{"lat":52.092119,"long":-106.590902},
			{"lat":52.092122,"long":-106.590955},
			{"lat":52.092151,"long":-106.590986},
			{"lat":52.092206,"long":-106.591019},
			{"lat":52.092117,"long":-106.590920},
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092090,"long":-106.590870},
			{"lat":52.092010,"long":-106.590781},
			{"lat":52.092107,"long":-106.590881},
			{"lat":52.092069,"long":-106.590946},
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092221,"long":-106.590937},
			{"lat":52.092206,"long":-106.590965},
			{"lat":52.092132,"long":-106.590989},
			{"lat":52.092149,"long":-106.590874},
			{"lat":52.092162,"long":-106.590742},
			{"lat":52.092179,"long":-106.590814},
			{"lat":52.092244,"long":-106.590884},
			{"lat":52.092319,"long":-106.591040},
			{"lat":52.092354,"long":-106.591263},
			{"lat":52.092314,"long":-106.591201},
			{"lat":52.092345,"long":-106.591218},
			{"lat":52.092272,"long":-106.591118},
			{"lat":52.092217,"long":-106.591036},
			{"lat":52.092276,"long":-106.591069},
			{"lat":52.092176,"long":-106.590906},
			{"lat":52.092050,"long":-106.590792},
			{"lat":52.092151,"long":-106.590831},
			{"lat":52.092046,"long":-106.590877},
			{"lat":52.092036,"long":-106.590907},
			{"lat":52.092061,"long":-106.590917},
			{"lat":52.092071,"long":-106.591162},
			{"lat":52.092104,"long":-106.590919},
			{"lat":52.092160,"long":-106.590942},
			{"lat":52.092146,"long":-106.590968},
			{"lat":52.092209,"long":-106.590966},
			{"lat":52.092221,"long":-106.591006},
			{"lat":52.092087,"long":-106.591079},
			{"lat":52.092122,"long":-106.590980},
			{"lat":52.092186,"long":-106.590945},
			{"lat":52.092081,"long":-106.590897},
			{"lat":52.092083,"long":-106.590958},
			{"lat":52.092132,"long":-106.590986},
			{"lat":52.092097,"long":-106.590982},
			{"lat":52.092091,"long":-106.590905},
			{"lat":52.092128,"long":-106.590874},
			{"lat":52.092059,"long":-106.590922},
			{"lat":52.092192,"long":-106.590943},
			{"lat":52.092076,"long":-106.590870},
			{"lat":52.092077,"long":-106.590989},
			{"lat":52.092232,"long":-106.590980},
			{"lat":52.092153,"long":-106.591007},
			{"lat":52.092118,"long":-106.590996},
			{"lat":52.092054,"long":-106.590824},
			{"lat":52.092000,"long":-106.591023},
			{"lat":52.092122,"long":-106.590962},
			{"lat":52.092109,"long":-106.590871},
			{"lat":52.092154,"long":-106.591028},
			{"lat":52.092114,"long":-106.590863},
			{"lat":52.092173,"long":-106.591039},
			{"lat":52.092163,"long":-106.590977},
			{"lat":52.092098,"long":-106.590939},
			{"lat":52.092208,"long":-106.591067},
			{"lat":52.092071,"long":-106.590997},
			{"lat":52.092018,"long":-106.591006},
			{"lat":52.092046,"long":-106.591020},
			{"lat":52.092100,"long":-106.591009},
			{"lat":52.092112,"long":-106.590937},
			{"lat":52.092119,"long":-106.590979},
			{"lat":52.092104,"long":-106.590955},
			{"lat":52.092091,"long":-106.591031},
			{"lat":52.092056,"long":-106.591062},
			{"lat":52.092032,"long":-106.591044},
			{"lat":52.092063,"long":-106.590963},
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092107,"long":-106.590979},
			{"lat":52.092144,"long":-106.590995},
			{"lat":52.091962,"long":-106.591028},
			{"lat":52.092030,"long":-106.590851},
			{"lat":52.092093,"long":-106.590870},
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092148,"long":-106.590934},
			{"lat":52.092158,"long":-106.590959},
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092233,"long":-106.590922},
			{"lat":52.092135,"long":-106.590927},
			{"lat":52.092088,"long":-106.590867},
			{"lat":52.092183,"long":-106.591005},
			{"lat":52.092069,"long":-106.590815},
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092174,"long":-106.591003},
			{"lat":52.092168,"long":-106.590923},
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092009,"long":-106.591071},
			{"lat":52.092090,"long":-106.591121},
			{"lat":52.092106,"long":-106.591050},
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092192,"long":-106.590818},
			{"lat":52.092164,"long":-106.590993},
			{"lat":52.092144,"long":-106.590981},
			{"lat":52.092323,"long":-106.590906},
			{"lat":52.092196,"long":-106.591108},
			{"lat":52.092105,"long":-106.591144},
			{"lat":52.092028,"long":-106.591170},
			{"lat":52.091917,"long":-106.591138},
			{"lat":52.091887,"long":-106.590974},
			{"lat":52.091860,"long":-106.590884},
			{"lat":52.091862,"long":-106.590788},
			{"lat":52.091809,"long":-106.590875},
			{"lat":52.091750,"long":-106.591407},
			{"lat":52.092305,"long":-106.591548},
			{"lat":52.092968,"long":-106.591531},
			{"lat":52.093162,"long":-106.596460},
			{"lat":52.093284,"long":-106.596945},
			{"lat":52.094378,"long":-106.598844},
			{"lat":52.095294,"long":-106.598859},
			{"lat":52.096242,"long":-106.598869},
			{"lat":52.097292,"long":-106.598884},
			{"lat":52.098534,"long":-106.598900},
			{"lat":52.099811,"long":-106.598854},
			{"lat":52.100183,"long":-106.599012},
			{"lat":52.102644,"long":-106.597087},
			{"lat":52.103325,"long":-106.596014},
			{"lat":52.103763,"long":-106.595161},
			{"lat":52.103746,"long":-106.595797},
			{"lat":52.104821,"long":-106.601118},
			{"lat":52.106213,"long":-106.604071},
			{"lat":52.110444,"long":-106.604306},
			{"lat":52.112781,"long":-106.604305},
			{"lat":52.115349,"long":-106.604270},
			{"lat":52.121690,"long":-106.604099},
			{"lat":52.124393,"long":-106.604558},
			{"lat":52.126986,"long":-106.605699},
			{"lat":52.129134,"long":-106.607395},
			{"lat":52.131249,"long":-106.609178},
			{"lat":52.133539,"long":-106.611037},
			{"lat":52.136101,"long":-106.611787},
			{"lat":52.138731,"long":-106.611753},
			{"lat":52.141215,"long":-106.611634},
			{"lat":52.143635,"long":-106.611553},
			{"lat":52.146001,"long":-106.611316},
			{"lat":52.148243,"long":-106.611258},
			{"lat":52.150035,"long":-106.612768},
			{"lat":52.151440,"long":-106.613097},
			{"lat":52.150676,"long":-106.612209},
			{"lat":52.150046,"long":-106.614271},
			{"lat":52.149978,"long":-106.619312},
			{"lat":52.149798,"long":-106.619541},
			{"lat":52.148941,"long":-106.619518},
			{"lat":52.148671,"long":-106.620813},
			{"lat":52.148269,"long":-106.621406},
			{"lat":52.148230,"long":-106.621893},
			{"lat":52.148099,"long":-106.622274},
			{"lat":52.148061,"long":-106.622035},
			{"lat":52.147980,"long":-106.622015},
			{"lat":52.147867,"long":-106.621996},
			{"lat":52.147742,"long":-106.622052},
			{"lat":52.147280,"long":-106.622396},
			{"lat":52.147178,"long":-106.622454},
			{"lat":52.147521,"long":-106.621841},
			{"lat":52.146503,"long":-106.622789},
			{"lat":52.146347,"long":-106.622837},
			{"lat":52.146164,"long":-106.622733},
			{"lat":52.146002,"long":-106.622897},
			{"lat":52.145868,"long":-106.622892},
			{"lat":52.145714,"long":-106.622907},
			{"lat":52.145136,"long":-106.622863},
			{"lat":52.144992,"long":-106.622921},
			{"lat":52.144883,"long":-106.622926},
			{"lat":52.144738,"long":-106.622936},
			{"lat":52.144587,"long":-106.622923},
			{"lat":52.144421,"long":-106.622925},
			{"lat":52.144268,"long":-106.622946},
			{"lat":52.144095,"long":-106.622943},
			{"lat":52.143944,"long":-106.623019},
			{"lat":52.143850,"long":-106.623150},
			{"lat":52.143758,"long":-106.623332},
			{"lat":52.143683,"long":-106.623567},
			{"lat":52.143639,"long":-106.623805},
			{"lat":52.143593,"long":-106.624073},
			{"lat":52.143602,"long":-106.624321},
			{"lat":52.143528,"long":-106.624534},
			{"lat":52.143455,"long":-106.624743},
			{"lat":52.143394,"long":-106.624971},
			{"lat":52.143322,"long":-106.625147},
			{"lat":52.143235,"long":-106.625381},
			{"lat":52.143173,"long":-106.625524},
			{"lat":52.143090,"long":-106.625765},
			{"lat":52.142872,"long":-106.625908},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.142828,"long":-106.625690},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143186,"long":-106.626221},
			{"lat":52.143008,"long":-106.625707},
			{"lat":52.143153,"long":-106.625640},
			{"lat":52.143118,"long":-106.625338},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143195,"long":-106.625566},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143211,"long":-106.625511},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143281,"long":-106.626321},
			{"lat":52.143192,"long":-106.626088},
			{"lat":52.143158,"long":-106.626033},
			{"lat":52.143185,"long":-106.625910},
			{"lat":52.143235,"long":-106.625824},
			{"lat":52.143295,"long":-106.625749},
			{"lat":52.143269,"long":-106.625773},
			{"lat":52.143246,"long":-106.625760},
			{"lat":52.143200,"long":-106.625732},
			{"lat":52.143221,"long":-106.625788},
			{"lat":52.143203,"long":-106.625757},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143132,"long":-106.625706},
			{"lat":52.143148,"long":-106.625645},
			{"lat":52.143122,"long":-106.625579},
			{"lat":52.143002,"long":-106.625511},
			{"lat":52.143012,"long":-106.625545},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143012,"long":-106.625545},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143250,"long":-106.625769},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143232,"long":-106.625715},
			{"lat":52.143176,"long":-106.625842},
			{"lat":52.143169,"long":-106.625871},
			{"lat":52.143140,"long":-106.625727},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143096,"long":-106.625607},
			{"lat":52.143318,"long":-106.625795},
			{"lat":52.143312,"long":-106.625862},
			{"lat":52.143291,"long":-106.625772},
			{"lat":52.143249,"long":-106.625708},
			{"lat":52.143248,"long":-106.625602},
			{"lat":52.143246,"long":-106.625638},
			{"lat":52.143240,"long":-106.625681},
			{"lat":52.143220,"long":-106.625617},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143134,"long":-106.625445},
			{"lat":52.142931,"long":-106.625076},
			{"lat":52.142738,"long":-106.624673},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.142765,"long":-106.625319},
			{"lat":52.142854,"long":-106.625359},
			{"lat":52.142900,"long":-106.625485},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143132,"long":-106.625680},
			{"lat":52.143200,"long":-106.626048},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.142880,"long":-106.625856},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143020,"long":-106.625502},
			{"lat":52.142994,"long":-106.625540},
			{"lat":52.142989,"long":-106.625598},
			{"lat":52.143008,"long":-106.625628},
			{"lat":52.143036,"long":-106.625596},
			{"lat":52.143085,"long":-106.625736},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143036,"long":-106.625880},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143060,"long":-106.625768},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143108,"long":-106.625786},
			{"lat":52.143013,"long":-106.626022},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143139,"long":-106.625534},
			{"lat":52.143195,"long":-106.625581},
			{"lat":52.143180,"long":-106.625645},
			{"lat":52.143219,"long":-106.625760},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143158,"long":-106.625650},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143032,"long":-106.625856},
			{"lat":52.143074,"long":-106.625841},
			{"lat":52.143150,"long":-106.625763},
			{"lat":52.143221,"long":-106.625716},
			{"lat":52.143042,"long":-106.625894},
			{"lat":52.143062,"long":-106.625736},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143145,"long":-106.625816},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143095,"long":-106.625843},
			{"lat":52.142916,"long":-106.626017},
			{"lat":52.143026,"long":-106.625970},
			{"lat":52.143047,"long":-106.625789},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143121,"long":-106.625916},
			{"lat":52.143153,"long":-106.625879},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143198,"long":-106.625776},
			{"lat":52.143240,"long":-106.625756},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143209,"long":-106.624931},
			{"lat":52.143174,"long":-106.625076},
			{"lat":52.143065,"long":-106.625131},
			{"lat":52.142958,"long":-106.625763},
			{"lat":52.142924,"long":-106.625710},
			{"lat":52.142835,"long":-106.625860},
			{"lat":52.142861,"long":-106.625422},
			{"lat":52.142916,"long":-106.625545},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143047,"long":-106.625726},
			{"lat":52.143153,"long":-106.625729},
			{"lat":52.142981,"long":-106.625696},
			{"lat":52.143026,"long":-106.625771},
			{"lat":52.143107,"long":-106.625739},
			{"lat":52.143090,"long":-106.625704},
			{"lat":52.143110,"long":-106.625689},
			{"lat":52.143094,"long":-106.625645},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143200,"long":-106.625690},
			{"lat":52.143220,"long":-106.625657},
			{"lat":52.143196,"long":-106.625637},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.142872,"long":-106.625908},
			{"lat":52.142841,"long":-106.625904},
			{"lat":52.142624,"long":-106.626371},
			{"lat":52.142559,"long":-106.626678},
			{"lat":52.142396,"long":-106.627209},
			{"lat":52.142405,"long":-106.627151},
			{"lat":52.142444,"long":-106.628059},
			{"lat":52.141950,"long":-106.627866},
			{"lat":52.141930,"long":-106.627932},
			{"lat":52.141965,"long":-106.627985},
			{"lat":52.142029,"long":-106.628277},
			{"lat":52.141916,"long":-106.628618},
			{"lat":52.141767,"long":-106.628906},
			{"lat":52.141816,"long":-106.628715},
			{"lat":52.141808,"long":-106.628773},
			{"lat":52.141824,"long":-106.628735},
			{"lat":52.141731,"long":-106.628567},
			{"lat":52.141731,"long":-106.628567},
			{"lat":52.141781,"long":-106.628662},
			{"lat":52.141802,"long":-106.628959},
			{"lat":52.141811,"long":-106.628901},
			{"lat":52.141878,"long":-106.628879},
			{"lat":52.141878,"long":-106.628879},
			{"lat":52.141878,"long":-106.628879},
			{"lat":52.141854,"long":-106.628896},
			{"lat":52.141834,"long":-106.628884},
			{"lat":52.141909,"long":-106.628883},
			{"lat":52.141902,"long":-106.628783},
			{"lat":52.141916,"long":-106.628618},
			{"lat":52.141896,"long":-106.628606},
			{"lat":52.141876,"long":-106.628594},
			{"lat":52.141881,"long":-106.628565},
			{"lat":52.141888,"long":-106.628664},
			{"lat":52.141872,"long":-106.628623},
			{"lat":52.141848,"long":-106.628640},
			{"lat":52.141896,"long":-106.628606},
			{"lat":52.141896,"long":-106.628606},
			{"lat":52.141916,"long":-106.628618},
			{"lat":52.141896,"long":-106.628606},
			{"lat":52.141916,"long":-106.628618},
			{"lat":52.141876,"long":-106.628594},
			{"lat":52.141888,"long":-106.628585},
			{"lat":52.141853,"long":-106.628611},
			{"lat":52.141833,"long":-106.628599},
			{"lat":52.141857,"long":-106.628582},
			{"lat":52.141774,"long":-106.628563},
			{"lat":52.141920,"long":-106.628589},
			{"lat":52.141881,"long":-106.628565},
			{"lat":52.141896,"long":-106.628606},
			{"lat":52.141896,"long":-106.628606},
			{"lat":52.141857,"long":-106.628582},
			{"lat":52.141849,"long":-106.628561},
			{"lat":52.141805,"long":-106.628645},
			{"lat":52.141995,"long":-106.628067},
			{"lat":52.141916,"long":-106.628097},
			{"lat":52.141930,"long":-106.627932},
			{"lat":52.141886,"long":-106.627495},
			{"lat":52.142368,"long":-106.626892},
			{"lat":52.142535,"long":-106.626695},
			{"lat":52.142556,"long":-106.626550},
			{"lat":52.142609,"long":-106.626330},
			{"lat":52.142800,"long":-106.626037},
			{"lat":52.142849,"long":-106.625846},
			{"lat":52.142849,"long":-106.625846},
			{"lat":52.142849,"long":-106.625846},
			{"lat":52.142869,"long":-106.625858},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143000,"long":-106.625687},
			{"lat":52.143008,"long":-106.625707},
			{"lat":52.143008,"long":-106.625707},
			{"lat":52.143008,"long":-106.625707}]
		};

		$scope.statsArray = [];
		for(var i = 0; i < jsonArray.latlong.length; i++){
			$scope.stat = {
				latitude: jsonArray.latlong[i].lat,
				longitude: jsonArray.latlong[i].long
			}
			$scope.statsArray[i] = $scope.stat;
		}
    	sessionStorage.statsArray = JSON.stringify($scope.statsArray);
    // 	$http({
		  //   method : "GET",
		  //   url : "https://website-155919.appspot.com/api/v1.0/stats",
		  //   headers: {
		  //   	'Accept': 'application/json',
    //     		"X-Aura-API-Key": 'dGhpc2lzYWRldmVsb3BlcmFwcA=='
    //     	}
		  // }).then(function mySuccess(response) {
		  // 	//retrieves stats on an organization 
		  // 	var jsonArray = response.data;
		  // 	$scope.statsArray = [];
		  // 	for(var i = 0; i < jsonArray.length; i++){
		  // 		$scope.stat = {
		  // 			latitude: jsonArray[i].lat ,
		  // 			longitude: jsonArray[i].long,
		  // 		};
		  // 		$scope.statsArray[i] = $scope.stat;
		  // 	}
		  // 	sessionStorage.statsArray = JSON.stringify($scope.statsArray);
		  //   }, function myError(response) {
		  //     alert(response.statusText);
		  // });
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
//--------------------------------------end of loader functions----------------------------------


//--------------------------------------helper functions begin-----------------------------------------
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
    		if($scope.curView == "objectsList"){
    			$scope.filterObjectsByBeacon($scope.beaconsFilter);
    		}
    		$scope.loadGoogleScript();
    	}
    }


    //changes the location of a beacon or object from google maps and uploads it to the database
    //assures the user wishes to make the change to the beacon
    $scope.changeLocation = function(pos, type){
    	switch(type){
    		case "beacon":
    			var locationPrompt = confirm("Are you sure you want to change " + $scope.curBeacon.beacon_name + "'s location?");
    			if(locationPrompt){
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
});

//-------------------------------------end of helper functions-----------------------------------


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

//-------------------------------------google maps handling begins-------------------------------
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
		    geocodePosition(JSON.stringify(marker.getPosition()), "beacon");
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
		    geocodePosition(JSON.stringify(marker.getPosition()), "object");
		});
	}
	else if(sessionStorage.curView == "beaconsList"){
		map = new google.maps.Map(document.getElementById('googleMapsBeacons'), {
          zoom: 7,
          center: findDPCenter(JSON.parse(sessionStorage.beaconsArray))
        });

        heatmap = new google.maps.visualization.HeatmapLayer({
          data: getDataPoints(JSON.parse(sessionStorage.beaconsArray)),
          map: map,
          radius: 30
        });
		heatmap.setMap(map);
	}
	else if(sessionStorage.curView == "objectsList"){
		map = new google.maps.Map(document.getElementById('googleMapsObjects'), {
          zoom: 11,
          center: findDPCenter(JSON.parse(sessionStorage.arObjectsList))
        });
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: getDataPoints(JSON.parse(sessionStorage.beaconsArray)),
          map: map,
          radius: 30
        });
		heatmap.setMap(map);
	}
	else if(sessionStorage.curView == "settings"){
		$('#addBeaconModal').on('shown.bs.modal', function (){
			var loc = {lat: 52.125471, lng: -106.655811 };
		    var map = new google.maps.Map(document.getElementById('googleMapsAddBeacon'), {
		      zoom: 11,
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
			    geocodePosition(JSON.stringify(marker.getPosition()), "addBeacon");
			});
		});
		$('#addObjectModal').on('shown.bs.modal', function () {
			var loc = {lat: 52.125471, lng: -106.655811 };
		    var map = new google.maps.Map(document.getElementById('googleMapsAddObject'), {
		      zoom: 11,
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
			    geocodePosition(JSON.stringify(marker.getPosition()), "addObject");
			});
		});
	}
	else if(sessionStorage.curView == "stats"){
		var stats = JSON.parse(sessionStorage.statsArray);
		map = new google.maps.Map(document.getElementById('googleMapsStats'), {
          zoom: 11,
          center: findDPCenter(stats),
        });
      // Markers of traffic flow
      //   for(var i = 0; i < stats.length; i++){
      //   	var loc = {lat: stats[i].latitude, lng: stats[i].longitude};
      //   	var marker = new google.maps.Marker({
		    //   position: loc,
		    //   map: map,
	    	//   animation: google.maps.Animation.DROP
		    // });
      //   }
        heatmap = new google.maps.visualization.HeatmapLayer({
          data: getDataPoints(stats),
          map: map,
          radius: 30
        });
		heatmap.setMap(map);
	}
	else{
		alert("Error: undefined map");
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
	var avgLat = 0;
	var avgLong = 0;
	for(var i = 0; i < dataArray.length; i++){
		avgLat += dataArray[i].latitude;
		avgLong += dataArray[i].longitude;
	}
	var center = {lat: avgLat / dataArray.length, lng: avgLong / dataArray.length};
	return center;
}


//updates the location of a marker when moved (by mouse)
function geocodePosition(loc, type) {
   var pos = JSON.parse(loc);
   var alt = getElevation(pos);
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
                if(type == "addBeacon" || type == "addObject"){
                	angular.element(document.getElementById('MAIN')).scope().newLat = pos.lat;
                	angular.element(document.getElementById('MAIN')).scope().newLng = pos.lng;
                }
                if(type == "object" || type == "beacon"){
               		angular.element(document.getElementById('MAIN')).scope().changeLocation(pos, type);
               	}
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
				alert("No results found");
			}
	  	} 
	  	else 
	  	{
			alert("Elevation service failed due to: " + status);
		}
	});
}

//-------------------------------------end of google maps handling-------------------------------
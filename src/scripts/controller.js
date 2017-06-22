//-------------------------------Angular Controller---------------------------------------
app.controller('mainController', function($scope, $http) {
	//initializer function when the window is loaded
	$scope.init = function(){
		$scope.userName = "Wynston Ramsay";
		$scope.loadOrganizations();
		$scope.changeView("dashboard");
		$scope.curOrg = "";
		$scope.curBeacon;
		$scope.curObj;
		$scope.curAsset;
		$scope.curAssetIndex;
		$scope.curGalleryIndex;
		$scope.beaconTypes = [
			"Airport",
			"Art",
			"Coffee-shop",
			"Gallery",
			"Landmark",
			"Manufacturing",
			"Museum",
			"Office",
			"Other",
			"Park",
			"Parking",
			"Retail",
			"Restaurant",
			"Security",
			"Trail",
			"Zoo"
		];

		//media carousel filters preset to true
		$scope.galleryFilter = {
			image: true,
			audio: true,
			video: true,
			threeD: true
		}

		//initiate functions
		$scope.resetAssetsForm();
		$scope.resetThumbnailForm();
		$scope.resetObjectDescriptionModal();

		//-------------------------------------- Initialize Firebase ------------------------------------------
		var config = {
			storageBucket: "https://firebasestorage.googleapis.com/v0/b/auraalert-21339.appspot.com"
		};
		$scope.firebaseApp = firebase.initializeApp(config);
		// Root reference to the storage
		$scope.storage = $scope.firebaseApp.storage("gs://auraalert-21339.appspot.com/");
		$scope.storageRef = $scope.storage.ref();
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

//---------------------------------------Firebase functions begin---------------------------------------

	//resets the assets form fields
	$scope.resetAssetsForm = function(){
		$scope.files = [];
		$scope.fileNames = [];
		$scope.uploadCount = 0;
	}

	//resets the thumbnail file name field
	$scope.resetThumbnailForm = function(){
		$scope.curThumbnail = "No file chosen.";
	}

	//updates the current files to be uploaded
	//	NOTE: JS array methods don't work with FileList objects
    $scope.uploadFile = function(files){
        if($scope.files.length == 0){
        	$scope.files = files;
        }
        else{
        	//concant both arrays
        	var temp1 = [];
        	for(var i = 0; i < $scope.files.length; i++){
        		temp1[i] = $scope.files[i];
        	}
        	for(var i = 0; i < files.length; i++){
        		temp1[$scope.files.length + i] = files[i];
        	}

        	//remove duplicates
        	var temp2 = [];
			for(var i = 0; i < temp1.length; i++){
				//searching for a duplicate
				var cur = temp1[i];
				var duplicate = false;
				for(var j = 0; j < temp2.length; j++){
					if(cur.name == temp2[j].name){
						duplicate = true;
					}
				}
				if(duplicate == true){
					//don't add the element
				}
				else{
					//no duplicate case, add to array
					temp2[temp2.length] = cur;
				}
			}
        	$scope.files = temp2;
        }
        $scope.safeApply();
    }; 

    //removes a file from the currently upload files
    //	NOTE: JS array methods don't work with FileList objects
    $scope.removeFile = function(index){
		var temp = []
		//element to remove is the first 
		if(index == 0){
			for(var i = 0; i < $scope.files.length - 1; i++){
				temp[i] = $scope.files[i + 1];
			}
		}
		//element to remove is the last
		else if(index == $scope.files.length - 1){
			for(var i = 0; i < $scope.files.length - 1; i++){
				temp[i] = $scope.files[i];
			}
		}
		//element to remove is in the middle
		else{
			//copy elements before the index
			for(var i = 0; i < index; i++){
				temp[i] = $scope.files[i];
			}
			//copy elements after the index and shift left
			for(var i = index + 1; i < $scope.files.length; i++){
				temp[i - 1] = $scope.files[i];
			}
		}
		$scope.files = temp;
    }

    //changes the thumbnail label to the selected file name
    $scope.updateThumbnailLabel = function(event){
    	var thumb = document.getElementById("thumbnailSelect");
    	$scope.curThumbnail = thumb.value;
    	$scope.$apply();
    }

	//uploads a thumbnail to the firebase and retrieves a url of it to be stored in the AR object
	$scope.uploadThumbnail = function(name, desc, thumbnailURL){
		//remove unecessary base64 string data
		thumbnailURL = thumbnailURL.split(',')[1];

		//new AR object ID, will be used to generate thumbnail firebase name
		var objID = randID();

		// thumbnail metadata
		var metadata = {
			customMetadata: {
				'AuraAPIKey': 'dGhpc2lzYWRldmVsb3BlcmFwcA=='
			}
		};

		var thumnailRef = $scope.storageRef.child(objID + "_thumb.jpg");

		// Upload file and metadata to the object 
		var uploadTask = thumnailRef.putString(thumbnailURL, 'base64', metadata);

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
		  function(snapshot){
		    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		    console.log('Upload is ' + progress + '% done');
		    switch (snapshot.state) {
		      case firebase.storage.TaskState.PAUSED:
		        console.log('Upload is paused');
		        break;
		      case firebase.storage.TaskState.RUNNING:
		        console.log('Upload is running');
		        break;
		    }
		  }, function(error) {

		  switch (error.code) {
		    case 'storage/unauthorized':
		      // User doesn't have permission to access the object
		      break;

		    case 'storage/canceled':
		      // User canceled the upload
		      break;

		    case 'storage/unknown':
		      // Unknown error occurred, inspect error.serverResponse
		      break;
		  }
		}, function() {
		 // Upload completed successfully, now we can get the download URL
		  $scope.thumbnailURL = uploadTask.snapshot.downloadURL;
		  $scope.addObject(name, desc, objID);
		});
	}

	//scales a thumbnail to about 150px by 150px to be easily stored in firebase
	$scope.thumbnailResize = function(name, desc){
		var filesToUpload = document.getElementById('thumbnailSelect').files;
	    var file = filesToUpload[0];

	    // Create an image
	    var img = document.createElement("img");
	    // Create a file reader
	    var reader = new FileReader();
	    // Set the image once loaded into file reader
	    reader.onload = function(e)
	    {
	        img.src = e.target.result;
	        img.onload = function(){
	        	var canvas = document.createElement("canvas");
		        var ctx = canvas.getContext("2d");
		        ctx.drawImage(img, 0, 0);

		        //thumbnail size is 150px by 150px
		        var width = 150;
		        var height = 150;
		        
		        canvas.width = width;
		        canvas.height = height;
		        var ctx = canvas.getContext("2d");
		        ctx.drawImage(img, 0, 0, width, height);

		        var dataurl = canvas.toDataURL("image/jpeg");  
		        $scope.uploadThumbnail(name, desc, dataurl); 
	        }
	    }
	    // Load files into file reader
	    reader.readAsDataURL(file);
	}

	//helper function to loop through input files 
	$scope.multiFileUpload = function(){
		for (var i = 0; i < $scope.files.length; i++) {
		    $scope.resizeAsset($scope.files[i], $scope.fileNames[i]);
		}
	}

	//resize an asset to be 750px and creates a 150px thumbnail version of itself
	$scope.resizeAsset = function(file, fileName){
		// Create an image and a thumbnail copy
	    var imgAsset = document.createElement("img");
	    var assetThumbnail = document.createElement("img");
	    // Create a file reader
	    var reader = new FileReader();
	    // Set the image once loaded into file reader
	    reader.onload = function(e){
	        imgAsset.src = e.target.result;
	        assetThumbnail.src = e.target.result;
	        imgAsset.onload = function(){
	        	assetThumbnail.onload = function(){
	        		//canvas for the main asset
	        		var canvas1 = document.createElement("canvas");
			        var ctx1 = canvas1.getContext("2d");
			        ctx1.drawImage(imgAsset, 0, 0);

			        //canvas for the asset thumbnail
			        var canvas2 = document.createElement("canvas");
			        var ctx2 = canvas2.getContext("2d");
			        ctx2.drawImage(assetThumbnail, 0, 0);

			        //width and height for the main asset
			        //  Note: Scale height proportional to width of 750px
			        var oldHeight = imgAsset.height;
			        var oldWidth = imgAsset.width;
			        var width1;
			        var height1;

			        //scaling for the main asset
			        var scaleFactor  = 750 / oldWidth;
			        width1 = oldWidth * scaleFactor;
			        height1 = oldHeight * scaleFactor;

			        //width and height for the asset thumbnail 
			        	//thumbnails are 150px by 150px
			        var width2 = 150;
			        var height2 = 150;

			        //draws the scaled asset on the canvas
			        canvas1.width = width1;
			        canvas1.height = height1;
			        var ctx1 = canvas1.getContext("2d");
			        ctx1.drawImage(imgAsset, 0, 0, width1, height1);

			        //draws the scaled asset on the canvas
			        canvas2.width = width2;
			        canvas2.height = height2;
			        var ctx2 = canvas2.getContext("2d");
			        ctx2.drawImage(assetThumbnail, 0, 0, width2, height2);

			        //taking the base64 url for the asset and its thumbnail
			        var assetURL = canvas1.toDataURL("image/jpeg"); 
			        var thumbnailURL = canvas2.toDataURL("image/jpeg");

			        $scope.uploadFBAsset(fileName, assetURL, thumbnailURL);
	        	}
	        }
	    }
	    //Load files into file reader
	    reader.readAsDataURL(file);
	}

	//uploads the main asset and calls the uploading of the thumbnail asset
	$scope.uploadFBAsset = function(assetName, assetURL, thumbnailURL){
		//remove unecessary base64 string data
		assetURL = assetURL.split(',')[1];

		//new asset ID, will be used to generate thumbnail firebase name
		var assetID = randID();

		// thumbnail metadata
		var metadata = {
			customMetadata: {
				'AuraAPIKey': 'dGhpc2lzYWRldmVsb3BlcmFwcA=='
			}
		};

		var assetRef = $scope.storageRef.child(assetID + "_img.jpg");

		// Upload file and metadata to the object 
		var uploadTask = assetRef.putString(assetURL, 'base64', metadata);

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
		  function(snapshot){
		    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		    console.log('Upload is ' + progress + '% done');
		    switch (snapshot.state) {
		      case firebase.storage.TaskState.PAUSED:
		        console.log('Upload is paused');
		        break;
		      case firebase.storage.TaskState.RUNNING:
		        console.log('Upload is running');
		        break;
		    }
		  }, function(error) {

		  switch (error.code) {
		    case 'storage/unauthorized':
		      // User doesn't have permission to access the object
		      break;

		    case 'storage/canceled':
		      // User canceled the upload
		      break;

		    case 'storage/unknown':
		      // Unknown error occurred, inspect error.serverResponse
		      break;
		  }
		}, function() {
		 // Upload completed successfully, now we can get the download URL
		  var newAssetURL = uploadTask.snapshot.downloadURL;
		  $scope.uploadFBAssetThumbnail(assetName, assetID, newAssetURL, thumbnailURL);
		});
	}

	$scope.uploadFBAssetThumbnail = function(assetName, assetID, assetURL, thumbnailURL){
		//remove unecessary base64 string data
		thumbnailURL = thumbnailURL.split(',')[1];

		// thumbnail metadata
		var metadata = {
			customMetadata: {
				'AuraAPIKey': 'dGhpc2lzYWRldmVsb3BlcmFwcA=='
			}
		};

		var thumnailRef = $scope.storageRef.child(assetID + "_thumb.jpg");

		// Upload file and metadata to the object 
		var uploadTask = thumnailRef.putString(thumbnailURL, 'base64', metadata);

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
		  function(snapshot){
		    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		    console.log('Upload is ' + progress + '% done');
		    switch (snapshot.state) {
		      case firebase.storage.TaskState.PAUSED:
		        console.log('Upload is paused');
		        break;
		      case firebase.storage.TaskState.RUNNING:
		        console.log('Upload is running');
		        break;
		    }
		  }, function(error) {

		  switch (error.code) {
		    case 'storage/unauthorized':
		      // User doesn't have permission to access the object
		      break;

		    case 'storage/canceled':
		      // User canceled the upload
		      break;

		    case 'storage/unknown':
		      // Unknown error occurred, inspect error.serverResponse
		      break;
		  }
		}, function() {
		 // Upload completed successfully, now we can get the download URL
		  var newAssetThumbnailURL = uploadTask.snapshot.downloadURL;
		  $scope.updateAssets(assetName, assetID, assetURL, newAssetThumbnailURL);
		});
	}

	//adds the asset to local storage in preparation to be added to the server
	$scope.updateAssets = function(assetName, assetID, assetURL, thumbnailURL){
		var newAsset = {
			name: assetName,
			value: assetURL,
			content_type: "image",
			arobj_id: $scope.curObj.arobj_id,
			content_id: assetID,
			thumbnail: thumbnailURL
		}
		$scope.updatedAssets = $scope.curObj.assets;
		$scope.updatedAssets[$scope.updatedAssets.length] = newAsset;
		$scope.uploadCount ++;
		if($scope.uploadCount == $scope.files.length){
			$scope.addAssets();
		}
	}

//---------------------------------------End of Firebase functions--------------------------------------

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
				break;
			case "stats":
				$scope.curOrg = org;
				$scope.changeLiveTitle("Stats", org.name, false);
				sessionStorage.curView = view;
				$scope.curView = view;
				$scope.loadStats();
				loadGoogleScript();
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
		$scope.changeView(view, $scope.organizationsArray[index]);
	}

	//when a new organization is selected reload the current view of that organization
	$scope.carouselRight = function(){
		var index = $('div.active').index() + 1;
		if(index < $scope.organizationsArray.length){
			$scope.changeView($scope.curView, $scope.organizationsArray[index]);
		}
		else{
			$scope.changeView($scope.curView, $scope.organizationsArray[0]);
		}
	}

	//when a new organization is selected reload the current view of that organization
	$scope.carouselLeft = function(){
		var index = $('div.active').index() - 1;
		if(index >= 0){
			$scope.changeView($scope.curView, $scope.organizationsArray[index]);
		}
		else{
			$scope.changeView($scope.curView, $scope.organizationsArray[$scope.organizationsArray.length - 1]);
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
		sessionStorage.curObj = obj;
		sessionStorage.curObj = JSON.stringify($scope.curObj);
		$scope.changeLiveTitle("Object: " + $scope.curObj.name, "", true);
		$scope.curView = "object";
		sessionStorage.curView = "object";
		$scope.filterTitle = "objectPrivacy";
		$scope.safeApply();
		loadGoogleScript(); 
	}

	//activates the modal with a given image
	$scope.displaythumbNailModal = function(obj){
		$scope.modalImgSrc = obj.thumbnail;
		$scope.modalHeader = obj.name;
		$scope.curObj = obj;
		$("#thumbnailModal").modal();
	}

	//activates the modal, loads the google scripts and resets any forms necessary
	$scope.displayAddObjectModal = function(){
		loadGoogleScript();
		$scope.resetThumbnailForm();
	}

	//display an objects assets in a modal
	$scope.displayAssetsModal = function(){
		if($scope.curObj.assets.length > 0){
			$scope.assets = $scope.curObj.assets;
			$("#assetsModal").modal();
		}
		else{
			alertFailure("ERROR: " + $scope.curObj.name + " has no media.");
		}
	}

	//displays a single asset in a modal
	$scope.displayAssetCarouselModal = function(asset){
		$scope.curAsset = asset;
		$scope.curAssetIndex = $scope.assets.map(function(asset) {return asset.content_id; }).indexOf(asset.content_id);
		$("#galleryCarousel").carousel($scope.curAssetIndex);
		$("#assetCarouselModal").modal();
	}

	//display an objects assets in a modal
	$scope.displayDescriptionModal = function(){
		$scope.resetObjectDescriptionModal();
		$scope.editObjDesc = $scope.curObj.description;
		$("#descriptionModal").modal();
	}

	//toggles the description content editable on demand feature
	$scope.toggleObjectDescriptionEdit = function(){
		if($scope.showObjDescEdit){
			$scope.showObjDescEdit = false;
		}
		else{
			$scope.showObjDescEdit = true;
		}
	}

	//resets the object description modal for editing
	$scope.resetObjectDescriptionModal = function(){
		$scope.showObjDescEdit = false;
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
			alertSuccess(name + " has been successfully added!");
		}, function myError(response) {
		    
		});
		$scope.loadOrganizations();
		$scope.safeApply();
		$scope.destroy();
	}

	//adds a beacon to an organization onto the database
	$scope.addBeacon = function(name, type){
		$scope.newBeacon = {
        	name: name, 
        	beacon_id: randID(), 
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
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		}
		}).then(function mySuccess(response) {
			alertSuccess(name + " has been successfully added!");
		}, function myError(response) {
		    
		});
		$scope.loadBeacons();
		$scope.safeApply();
	}

	//adds a object for an organization onto the database
	$scope.addObject = function(name, objDesc, objID){
		$scope.closestBeaconID = randID();
		$scope.findClosestBeacon();
		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/arobj',
        data: {
        	name: name, 
        	desc: objDesc,
        	beacon_id: $scope.closestBeaconID, 
        	arobj_id: objID, 
        	organization_id: $scope.curOrg.id,
        	altitude: $scope.newAlt, 
        	latitude: $scope.newLat, 
        	longitude: $scope.newLng,
        	thumbnail: $scope.thumbnailURL
        },
        headers: {
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		}
		}).then(function mySuccess(response) {
			alertSuccess(name + " has been successfully added!");
		}, function myError(response) {
		});
		$scope.loadObjects();
		$scope.safeApply();
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
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		}
		}).then(function mySuccess(response) {
			alertSuccess(name + " has been successfully added!");
		}, function myError(response) {
		});
		$scope.loadBeacons();
		$scope.safeApply();
	}


	//adds an asset to a obect
	$scope.addAssets = function(){
		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/arobj',
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
        	contents: $scope.updatedAssets
        },
        headers: {
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		}
		}).then(function mySuccess(response) {
			alertSuccess($scope.uploadCount +  " assets have been successfully added to " + $scope.curObj.name + "!");
		}, function myError(response) {
		});
		$scope.displayObject($scope.curObj);
		$scope.safeApply();
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
		  });
	}

	//retrieves all the beacons from the database for the organization
    $scope.loadBeacons = function(){
		$http({
		    method : "GET",
		    url : "https://website-155919.appspot.com/api/v1.0/newbeacon",
		    headers: {
        		'Accept': 'application/json',
        		"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
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
		  			beacon_type: parseBeaconType(jsonArray[i].attributes.beacon_type), 
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
		  		var mediaCounter = tallyAssets(jsonArray[i].contents);
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
		  			beacon_name: getBeaconName(jsonArray[i].beacon_id), 
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

    //loads in stats about an organization to be displayed
    $scope.loadStats = function(){
		$scope.statsArray = [];
		for(var i = 0; i < willStats.latlong.length; i++){
			$scope.stat = {
				latitude: willStats.latlong[i].lat,
				longitude: willStats.latlong[i].long
			}
			$scope.statsArray[i] = $scope.stat;
		}
    	sessionStorage.statsArray = JSON.stringify($scope.statsArray);
    }

//--------------------------------------end of loader functions----------------------------------------


//-------------------------------------- Update functions begin-----------------------------------------
	
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
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
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
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: " + $scope.curBeacon.beacon_name + " has been successfully updated!");
			$scope.displayBeacon(updatedBeacon);
		}, function myError(response) {
		    alertFailure("ERROR: failed to update " + $scope.curBeacon.beacon_name + "!");
		});
	}

	//updates the location of an object on the server side
	$scope.updateObjectLocation = function(){
		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/arobj',
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
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
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
        url: 'https://website-155919.appspot.com/api/v1.0/arobj',
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
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
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
        url: 'https://website-155919.appspot.com/api/v1.0/arobj',
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
        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: " + $scope.curObj.name + " has been successfully updated!");
			//reload the object change
			$scope.loadObjects();
		}, function myError(response) {
			alertFailure("ERROR: failed to update " + $scope.curObj.name + "!");
		});
	}

//-------------------------------------- End of update functions----------------------------------------

//--------------------------------------Start of Delete Functions---------------------------------------
	
	//removes an organization and all of its beacons, objects, and assets from the database and storage bucket
	$scope.removeOrganization = function(organization){
		bootbox.confirm({
		    title: "Delete " + organization.name + "?",
		    message: "Are you sure you want to permanently delete " + organization.name + "?",
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
		        	//Delete the organization and any beacon, object, and media associated
					$http({
				        method: 'Delete',
				        url: 'https://website-155919.appspot.com/api/v1.0/orgnization/' + organization_id.organization_id,
				        headers: {
				        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
						}
					}).then(function mySuccess(response) {
						alertSuccess("SUCCESS: " + beacon.beacon_name + " has been successfully deleted!");
						$scope.loadOrganizations();
					}, function myError(response){
					    alertFailure("ERROR: failed to delete " + beacon.beacon_name + ".");
					});
		        }
		    }
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
				        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
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
				        url: 'https://website-155919.appspot.com/api/v1.0/arobj/object.arobj_id',
				        headers: {
				        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
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

	//deletes an asset from an objects assets and from firebase
	$scope.removeAsset = function(asset){
		bootbox.confirm({
		    title: "Delete " + asset.name + "?",
		    message: "Are you sure you want to permanently delete " + asset.name + "?",
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
		        	//remove the asset thumbnail from firebase

					//remove the asset url from firebase

					//Delete the asset by updating the object its associated with
					$http({
				        method: 'Put',
				        url: 'https://website-155919.appspot.com/api/v1.0/arobj/' + $scope.curObj.arobj_id,
				        headers: {
				        	"X-Aura-API-Key": "dGhpc2lzYWRldmVsb3BlcmFwcA=="
						}
					}).then(function mySuccess(response) {
						    alertSuccess("SUCCESS: " + asset.name + " has been successfully deleted!");
					}, function myError(response) {
							alertFailure("ERROR: failed to delete " + asset.name + ".");
					});
		        }
		    }
		});
	}
//--------------------------------------End of Delete Function------------------------------------------

//--------------------------------------helper functions begin-----------------------------------------

    //helper function to scopify assets for deletion purposes
    $scope.setAssets = function(){
    	$scope.curAssets = $scope.curObj.assets;
    }


    //returns whether or not an asset is to be displayed based on the filters and media type
    $scope.galleryMediaFilter = function(asset){
		return($scope.galleryFilter[asset.content_type]);
	}

    //finds the nearest beacon for a newly created object
    $scope.findClosestBeacon = function(){
	  	var closestBeacon = null;
	  	var closest;
	  	for(var i = 0; i < $scope.beaconsArray.length; i++){
	  		var distance = findDistanceBetweenLatLng($scope.newLat, $scope.newLng, $scope.beaconsArray[i].latitude, $scope.beaconsArray[i].longitude);
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
	  	if(closest > 100){
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
	  				$('#beaconForObjectModal').modal('show'); 
	  			}
	  			else{
	  				$scope.closestBeaconID = null;
	  			} 			    }
			});
	  	}
	  	else{
	  		$scope.closestBeaconID = closestBeacon.beacon_id;
	  	}
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
});

//-------------------------------------end of helper functions-----------------------------------


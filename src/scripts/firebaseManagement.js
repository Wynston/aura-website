//handlings uploading assets and thumbnails to firebase as removal of urls
auraCreate.firebaseManagement = function($scope, $http){
	//-------------------------------------- Initialize Firebase ------------------------------------------
	$scope.firebaseApp = firebase.initializeApp($scope.storageBucket);
	// Root reference to the storage
	$scope.storage = $scope.firebaseApp.storage($scope.fireBaseGS);
	$scope.storageRef = $scope.storage.ref();

	//firebase loading bar
	$scope.fbLoading = false;
	$scope.progressPercent = 0;

	//uploads the main asset and calls the uploading of the thumbnail asset
	$scope.uploadFBAsset = function(assetName, assetURL, thumbnailURL, type){
		//new asset ID, will be used to generate thumbnail firebase name
		var assetID = $scope.randID();

		var assetRef;
		var uploadTask;
		switch(type){
			case "image":
				//remove unecessary base64 string data
				assetURL = assetURL.split(',')[1];
				assetRef = $scope.storageRef.child(assetID + "_img.jpg");
				// Upload file and metadata to the object 
				uploadTask = assetRef.putString(assetURL, 'base64', $scope.FBMetaData);
				break;
			case "audio":
				assetRef = $scope.storageRef.child(assetID + "_audio.mp3");
				uploadTask = assetRef.put(assetURL, $scope.FBMetaData);
				break;
			case "video":
				assetRef = $scope.storageRef.child(assetID + "_video.mp4");
				uploadTask = assetRef.put(assetURL, $scope.FBMetaData);
				break;
			case "3d":
				break;
		}

		//reset progress bar
		$('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
		$scope.fbLoading = true;
		$scope.safeApply();

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
		  function(snapshot){
		    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		    $('.progress-bar').css('width', progress+'%').attr('aria-valuenow', progress);
		    $scope.progressPercent = progress;
		    $scope.safeApply();
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
		      $scope.fbLoading = false;
		      break;

		    case 'storage/canceled':
		      // User canceled the upload
		      $scope.fbLoading = false;
		      break;

		    case 'storage/unknown':
		      // Unknown error occurred, inspect error.serverResponse
		      $scope.fbLoading = false;
		      break;
		  }
		}, function(){
			$scope.fbLoading = false;
			// Upload completed successfully, now we can get the download URL
		  var newAssetURL = uploadTask.snapshot.downloadURL;
			switch(type){
				case "image":
					$scope.uploadFBAssetThumbnail(assetName, assetID, newAssetURL, thumbnailURL, type);
					break;
				case "audio":
					$scope.updateAssets(assetName, assetID, newAssetURL, thumbnailURL, type);
					break;
				case "video":
					$scope.uploadFBAssetThumbnail(assetName, assetID, newAssetURL, thumbnailURL, type);
					break;
				case "3d":
					break;
			}
		});
	}

	$scope.uploadFBAssetThumbnail = function(assetName, assetID, assetURL, thumbnailURL, type){
		//remove unecessary base64 string data
		thumbnailURL = thumbnailURL.split(',')[1];

		var thumnailRef = $scope.storageRef.child(assetID + "_thumb.jpg");

		// Upload file and metadata to the object 
		var uploadTask = thumnailRef.putString(thumbnailURL, 'base64', $scope.FBMetaData);

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
		  $scope.updateAssets(assetName, assetID, assetURL, newAssetThumbnailURL, type);
		});
	}

	//uploads a thumbnail to the firebase and retrieves a url of it to be stored in the AR object
	$scope.uploadThumbnail = function(name, desc, thumbnailURL){
		//remove unecessary base64 string data
		thumbnailURL = thumbnailURL.split(',')[1];

		//new AR object ID, will be used to generate thumbnail firebase name
		var objID = $scope.randID();

		var thumnailRef = $scope.storageRef.child(objID + "_thumb.jpg");

		// Upload file and metadata to the object 
		var uploadTask = thumnailRef.putString(thumbnailURL, 'base64', $scope.FBMetaData);

		//reset progress bar
		$('.progress-bar').css('width', '0%').attr('aria-valuenow', 0);
		$scope.fbLoading = true;
		$scope.safeApply();

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
		  function(snapshot){
		    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		    $('.progress-bar').css('width', progress+'%').attr('aria-valuenow', progress);
		    $scope.progressPercent = progress;
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
		      $scope.fbLoading = false;
		      break;

		    case 'storage/canceled':
		      // User canceled the upload
		      $scope.fbLoading = false;
		      break;

		    case 'storage/unknown':
		      // Unknown error occurred, inspect error.serverResponse
		      $scope.fbLoading = false;
		      break;
		  }
		}, function() {
		 // Upload completed successfully, now we can get the download URL
		  $scope.fbLoading = false;
		  $scope.thumbnailURL = uploadTask.snapshot.downloadURL;
		  $scope.addObject(name, desc, objID);
		});
	}
}
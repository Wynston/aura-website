//handlings uploading assets and thumbnails to firebase as removal of urls
auraCreate.firebaseManagement = function($scope, $http){
	//-------------------------------------- Initialize Firebase ------------------------------------------
	$scope.firebaseApp = firebase.initializeApp($scope.storageBucket);
	// Root reference to the storage
	$scope.storage = $scope.firebaseApp.storage($scope.fireBaseGS);
	$scope.storageRef = $scope.storage.ref();

	//uploads the main asset and calls the uploading of the thumbnail asset
	$scope.uploadFBAsset = function(assetName, assetURL, thumbnailURL){
		//remove unecessary base64 string data
		assetURL = assetURL.split(',')[1];

		//new asset ID, will be used to generate thumbnail firebase name
		var assetID = $scope.randID();

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
}
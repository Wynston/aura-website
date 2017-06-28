//handles the resetting of forms and modals
auraCreate.resetControls = function($scope){
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

	//initializes or resets the form for object creation
	$scope.resetAddObjectForm = function(){
		$scope.addObjectName = "";
		$scope.addObjectDesc = "";
		$scope.resetThumbnailForm();
	}


	//initializes or reserts the form for adding beacons
	$scope.resetAddBeaconForm = function(){
		$scope.addBeaconName = "";
		$scope.addBeaconType = "";
	}

	//resets the object description modal for editing
	$scope.resetObjectDescriptionModal = function(){
		$scope.showObjDescEdit = false;
	}
}
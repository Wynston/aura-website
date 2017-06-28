//controls the bootstrap modal content
auraCreate.modals = function($scope){
	//allows modals to stack based on z-index
	$(document).on('show.bs.modal', '.modal', function () {
	    var zIndex = 1040 + (10 * $('.modal:visible').length);
	    $(this).css('z-index', zIndex);
	    setTimeout(function() {
	        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
	    }, 0);
	});

//------------------------------------------Content modals------------------------------------
	//activates the modal with a given image
	$scope.displaythumbNailModal = function(obj){
		$scope.modalImgSrc = obj.thumbnail;
		$scope.modalHeader = obj.name;
		$scope.curObj = obj;
		$("#thumbnailModal").modal();
	}

	//displays a single asset in a modal
	$scope.displayAssetCarouselModal = function(asset){
		$scope.curAsset = asset;
		$scope.assetIndex = $scope.assets.map(function(asset) {return asset.content_id; }).indexOf(asset.content_id);
		$scope.curAssetSlide = $scope.assetIndex + 1;
		$("#galleryCarousel").carousel($scope.assetIndex);
		$("#assetCarouselModal").modal();
	}

	//display an objects assets in a modal
	$scope.displayDescriptionModal = function(){
		$scope.resetObjectDescriptionModal();
		$scope.editObjDesc = $scope.curObj.description;
		$("#descriptionModal").modal();
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

//--------------------------------------Creation Modals------------------------------------------------
	//activates the add beacon modal, loads the google scripts and resets any forms necessary
	$scope.displayAddBeaconModal = function(){
		loadGoogleScript();
		$scope.resetAddBeaconForm();
		$("#addBeaconModal").modal();
	}

	//activates the add object modal, loads the google scripts and resets any forms necessary
	$scope.displayAddObjectModal = function(){
		$scope.loadBeacons();
		loadGoogleScript();
		$scope.resetAddObjectForm();
		$("#addObjectModal").modal();
	}

	//activates the modal form that allows for object creation within a beacon's radius
	$scope.displayAddObjectAtBeaconModal = function(beacon){
		$scope.curBeacon = beacon;
		sessionStorage.curBeacon = JSON.stringify($scope.curBeacon);
		loadGoogleScript();
		$scope.resetAddObjectForm();
		$("#addObjectAtBeaconModal").modal();
	}

	//activates the add assets modal
	$scope.displayAddAssetsModal = function(obj){
		$scope.curObj = obj;
		$scope.resetAssetsForm();
		$("#addAssetsModal").modal();
	}

//---------------------------------------Editing Modals-------------------------------------------------
	//displays the modal to edit beacons
	$scope.displayEditBeaconModal = function(beacon){
		$scope.curBeacon = beacon;
		sessionStorage.curBeacon = JSON.stringify(beacon);
		$scope.editBeacName = $scope.curBeacon.beacon_name;
		$scope.editBeacType = $scope.curBeacon.beacon_type;
		loadGoogleScript();
		$("#editBeaconModal").modal();
	}

	//displays the modal to edit objects 
	$scope.displayEditObjectModal = function(obj){
		$scope.curObj = obj;
		sessionStorage.curObj = JSON.stringify(obj);
		loadGoogleScript();
		$scope.resetThumbnailForm();
		$scope.editObjName = $scope.curObj.name;
		$scope.editObjDesc = $scope.curObj.description
		$scope.newAlt = $scope.curObj.altitude;
		$scope.newLat = $scope.curObj.latitude;
		$scope.newLng = $scope.curObj.longitude;
		$("#editObjectModal").modal();
	}

	$scope.displayEditBeaconTypeModal = function(){
		$scope.newBeaconType = $scope.curBeacon.beacon_type;
		$('#beaconTypeEditModal').modal();
	}
}
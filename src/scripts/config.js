//config file that allows certain types and fields to be easily updated and changed
auraCreate.config = function($scope){
	//Database url https://website-155919.appspot.com/api/v1.0/
	//aura api key
	$scope.auraAPIKey = "dGhpc2lzYWRldmVsb3BlcmFwcA==";

	//firebase bucket and gs urls
	$scope.storageBucket = {
		storageBucket: "https://firebasestorage.googleapis.com/v0/b/auraalert-21339.appspot.com"
	};
	$scope.fireBaseGS = "gs://auraalert-21339.appspot.com/";

	//firebase custom metadata
	$scope.FBMetaData = {
		customMetadata: {
			'AuraAPIKey': $scope.auraAPIKey
		}
	};

	$scope.genericAudioThumbnail = "../images/auraheadphone150.jpg";

	//initates scope variables
	$scope.curOrg;
	$scope.curBeacon;
	$scope.curObj;
	$scope.curAsset;
	$scope.curAssetIndex;
	$scope.curGalleryIndex;

	//valid beacon types
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

	//media carousel filters, all preset to true
	$scope.galleryFilter = {
		image: true,
		audio: true,
		video: true,
		threeD: true
	}
}
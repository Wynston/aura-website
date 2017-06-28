//config file that allows certain types and fields to be easily updated and changed
auraCreate.config = function($scope){
	//aura api key
	$scope.auraAPIKey = "dGhpc2lzYWRldmVsb3BlcmFwcA==";

	//firebase bucket and gs urls
	$scope.storageBucket = {
		storageBucket: "https://firebasestorage.googleapis.com/v0/b/auraalert-21339.appspot.com"
	};
	$scope.fireBaseGS = "gs://auraalert-21339.appspot.com/";

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
}
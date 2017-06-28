//-------------------------------Main Angular Controller---------------------------------------
auraCreate.controller('mainController', function($scope, $http){
	//initializer function when the window is loaded
	$scope.init = function(){
		//controllers
		auraCreate.config($scope);
		auraCreate.userManagement($scope, $http);
		auraCreate.organizationManagement($scope, $http);
		auraCreate.beaconManagement($scope, $http);
		auraCreate.objectManagement($scope, $http);
		auraCreate.assetManagement($scope, $http);
		auraCreate.statManagement($scope, $http);
		auraCreate.firebaseManagement($scope);
		auraCreate.viewController($scope);
		auraCreate.carouselControls($scope);
		auraCreate.resetControls($scope);
		auraCreate.fileUpload($scope);
		auraCreate.modals($scope);
		auraCreate.locationCalculations($scope);

		//Initialize User and their organizations and displays the dashboard
		$scope.userName = "Wynston Ramsay";
		$scope.loadOrganizations();
		$scope.changeView("dashboard");
	}

// -------------------------------------------------Global functions--------------------------------------------------------
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
});
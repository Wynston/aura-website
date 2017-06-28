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
});
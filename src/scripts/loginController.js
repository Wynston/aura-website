//-------------------------------Main Angular Controller---------------------------------------
loginAppModule.controller('loginController', function($scope, $http){
	$scope.init = function(){
		
	}

	//authenticates a user's login info
	$scope.authenticateUser = function(){
		$scope.toAuraCreate();
	}

	//directes the user to the Aura Create Web Application after a successful login
	$scope.toAuraCreate = function(){
		document.location.href = "auraCreate.html";
	}
});
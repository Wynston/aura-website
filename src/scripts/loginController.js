//-------------------------------Main Angular Controller---------------------------------------
loginAppModule.controller('loginController', function($scope, $http){
	//when angular finishes loading, pre-load any necessary controllers
	$scope.init = function(){
		loginAppModule.loginConfig($scope);
	}

	//switches pages to AuraCreate once the user has been authentificated
	$scope.signIn = function(){
		document.location.href = "/auraCreate.html";
	}
});


//handles loading in the user information and updating it
auraCreate.userManagement = function($scope, $http){
	//load in a specific user from the database
	// $scope.loadUser = function(){
	// 	$http({
	// 	    method : "GET",
	// 	    url : "https://website-155919.appspot.com/api/v1.0/user",
	// 	    headers: {
 //        		'Accept': 'application/json',
 //        		"X-Aura-API-Key": $scope.auraAPIKey
	// 	    }
	// 	  }).then(function mySucces(response) {
	// 	  	//stores the user in session storage and angular binding
	// 	  	var jsonArray = response.data;
	//   		$scope.user = {
	//   			name: jsonArray[0].name,
	//   			email: jsonArray[0].email,
	//   			user_id: jsonArray[0].user_id,
	//   			role: jsonArray[0].role
	//   		};
	// 	  	sessionStorage.user = JSON.stringify($scope.user);
	// 	    }, function myError(response) {
	// 	  });
	// }
}
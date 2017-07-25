//handles loading in the user information and updating it
auraCreate.userManagement = function($scope, $http){
	//load in a specific user from the database with a token
	$scope.loadUser = function(){
		//Google oAuth token
		$scope.userToken = localStorage.getItem("userToken");

		$http({
		    method : "GET",
		    url : $scope.queryUser,
		    headers: {
        		'Accept': 'application/json',
        		"X-Aura-API-Key": $scope.auraAPIKey
		    }
		  }).then(function mySucces(response) {
			  	//stores the user in session storage and angular binding
			  	// var jsonArray = response.data.data;
		  		// $scope.user = {
		  		// 	name: jsonArray[0].name,
		  		// 	email: jsonArray[0].email,
		  		// 	user_id: jsonArray[0].user_id,
		  		// 	role: jsonArray[0].role
		  		// };
		  		$scope.user = {
		  			name: "Wynston Ramsay",
		  			email: "wynstonramsay@gmail.com",
		  			user_id: "wcr723",
		  			role: "Admin"
		  		}
				$scope.loadOrganizations();
		    }, function myError(response) {
		  });
	}

	//when the user requests to sign out, switch to log-in page
	$scope.signOut = function(){
		onGoogleSignOut(); //sign out of Google oAuth
		document.location.href = "index.html";
	}
}
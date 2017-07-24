//-------------------------------Main Angular Controller---------------------------------------
loginAppModule.controller('loginController', function($scope, $http){
	$scope.init = function(){
	}

	//authenticates a user's login info
	$scope.signIn = function(){
		$scope.toAuraCreate();
	}

	//directes the user to the Aura Create Web Application after a successful login
	$scope.toAuraCreate = function(){
		document.location.href = "https:://10.0.1.1/auraCreate.html";
	}

	//GOOGLE oAuTH handling
	function googleAuth(googleUser) {
		alert("hi");
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
    }
});
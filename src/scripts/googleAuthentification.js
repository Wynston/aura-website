//loads in google auth api on page load
function onLoadGoogleAuth(){
	gapi.load('auth2', function() {
		gapi.auth2.init();
	});
}

//Google oAuth signin
function onGoogleSignIn(googleUser){
	// Useful data for your client-side scripts:
	var profile = googleUser.getBasicProfile();

	//Storing the google auth token, user information, then signs into Aura Create
	angular.element(document.getElementById('MAIN')).scope().userToken =  googleUser.getAuthResponse().id_token;
	angular.element(document.getElementById('MAIN')).scope().userInfo = {
		fullName: profile.getName(),
		firstName: profile.getGivenName(),
		lastName: profile.getFamilyName(),
		profileImage: profile.getImageUrl(),
		email: profile.getEmail()
	};
	angular.element(document.getElementById('MAIN')).scope().signIn();
};

//signs out of Google auth
function googleAuthSignOut(){
	var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    	auth2.disconnect();
    });
}
//loads in google auth api on page load
function onLoadGoogleAuth() {
	gapi.load('auth2', function() {
		gapi.auth2.init();
	});
}

//Google oAuth signin
function onGoogleSignIn(googleUser){
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

	localStorage.setItem("userToken", id_token);
	angular.element(document.getElementById('MAIN')).scope().signIn();
};

//signs out of Google auth
function onGoogleSignOut(){
	//sign out of google auth
	var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    	auth2.disconnect();
      console.log('User signed out.');
    });
}
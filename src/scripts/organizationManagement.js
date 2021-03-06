//controls the loading, creating, editing, and deleting of a users organizations
auraCreate.organizationManagement = function($scope, $http){

	//loads in the organizations of a user
	$scope.loadOrganizations = function(){
		$http({
		    method : "GET",
		    url : $scope.queryOrgs,
		    headers: {
        		'Accept': 'application/json',
        		"X-Aura-API-Key": $scope.auraAPIKey
		    }
		  }).then(function mySuccess(response) {
			  	//loops over every organization in the response and adds it to session storage and binding
			  	var jsonArray = response.data.data;
			  	$scope.organizationsArray = [];
			  	for(var i = 0; i < jsonArray.length; i++){
			  		$scope.organization = {
			  			name: jsonArray[i].attributes.name,
			  			organization_id: jsonArray[i].attributes.organization_id,
			  			description: jsonArray[i].attributes.desc
			  		};
			  		$scope.organizationsArray[i] = $scope.organization;
			  	}
			  	sessionStorage.organizationsArray = JSON.stringify($scope.organizationsArray);
			  	$scope.changeView("dashboard", $scope.organizationsArray[0]);
		    }, function myError(response) {
		    	alertFailure("ERROR: failed to load organizations for " + $scope.userName);
		  });
	}

	//adds an organization to the database for a user
	$scope.addOrganization = function(name, desc){
		$http({
        method: 'PUT',
        url: $scope.queryOrgs,
        data: {name: name, desc: desc},
        headers: {
        	"X-Aura-API-Key": $scope.auraAPIKey
		}
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: the organization " + name + " has been successfully created!");
			$scope.loadOrganizations();
		}, function myError(response) {
		    alertFailure("ERROR: failed to create the organization " + name + ".");
		});
	}

	//removes an organization and all of its beacons, objects, and assets from the database and storage bucket
	$scope.removeOrganization = function(organization){
		bootbox.confirm({
		    title: "Delete " + organization.name + "?",
		    message: "Are you sure you want to permanently delete " + organization.name + "?",
		    buttons: {
		        cancel: {
		            label: '<i class="fa fa-times"></i> Cancel',
		            className: 'btn-danger'
		        },
		        confirm: {
		            label: '<i class="fa fa-check"></i> Confirm',
		            className: 'btn-success'
		        }
		    },
		    callback: function (result) {
		        if(result){
		        	//Delete the organization and any beacon, object, and media associated
					$http({
				        method: 'Delete',
				        url: $scope.queryOrgs + "/" + organization.organization_id,
				        headers: {
				        	"X-Aura-API-Key": $scope.auraAPIKey
						}
					}).then(function mySuccess(response) {
						alertSuccess("SUCCESS: " + beacon.beacon_name + " has been successfully deleted!");
						$scope.loadOrganizations();
					}, function myError(response){
					    alertFailure("ERROR: failed to delete " + beacon.beacon_name + ".");
					});
		        }
		    }
		});
	}

	//changes the current organization to the given organization and reloads depending on the current view
	$scope.changeCurOrg = function(org){
		$('#orgList > li.active').removeClass('active');
		$('#orgList > #' + org.name).addClass('active');
		//reload depending on the user's current view with the new organization
		switch($scope.curView){
			case "beacon":
				$scope.changeView('beaconsList', org);
				break;
			case "object":
				$scope.changeView('objectsList', org);
				break;
			case "beaconsList":
				$scope.changeView('beaconsList', org);
				break;
			case "objectsList":
				$scope.changeView('objectsList', org);
				break;
			case "orgSettings":
				$scope.changeView('orgSettings', org);
				break;
			case "dashboard":
				$scope.changeView('dashboard', org);
				break;
			default: 
				break;
		}
	}
}
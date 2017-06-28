//handles the creating, and deletion of assets
auraCreate.assetManagement = function($scope, $http){
	//adds an asset to a obect
	$scope.addAssets = function(){
		$http({
        method: 'PUT',
        url: 'https://website-155919.appspot.com/api/v1.0/arobj',
        data: {
        	name: $scope.curObj.name, 
        	desc: $scope.curObj.description,
        	beacon_id: $scope.curObj.beacon_id, 
        	arobj_id: $scope.curObj.arobj_id, 
        	organization_id: $scope.curObj.organization_id,
        	altitude: $scope.curObj.altitude, 
        	latitude: $scope.curObj.latitude, 
        	longitude: $scope.curObj.longitude,
        	thumbnail: $scope.curObj.thumbnail,
        	contents: $scope.updatedAssets
        },
        headers: {
        	"X-Aura-API-Key": $scope.auraAPIKey
		}
		}).then(function mySuccess(response){
			alertSuccess("SUCCESS: " + $scope.uploadCount +  " assets have been successfully added to " + $scope.curObj.name + "!");
			$scope.displayObject($scope.curObj);
		}, function myError(response) {
			alertFailure("ERROR: failed to create the asset/s for " + $scope.curObj.name + ".");
		});
	}

	//deletes an asset from an objects assets and from firebase
	$scope.removeAsset = function(asset){
		bootbox.confirm({
		    title: "Delete " + asset.name + "?",
		    message: "Are you sure you want to permanently delete " + asset.name + "?",
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
		        	//remove the asset thumbnail from firebase

					//remove the asset url from firebase

					//Delete the asset by updating the object its associated with
					$http({
				        method: 'Put',
				        url: 'https://website-155919.appspot.com/api/v1.0/arobj/' + $scope.curObj.arobj_id,
				        headers: {
				        	"X-Aura-API-Key": $scope.auraAPIKey
						}
					}).then(function mySuccess(response) {
						    alertSuccess("SUCCESS: " + asset.name + " has been successfully deleted!");
					}, function myError(response) {
							alertFailure("ERROR: failed to delete " + asset.name + ".");
					});
		        }
		    }
		});
	}

	//adds the asset to the scope in preparation to be added to the server
	$scope.updateAssets = function(assetName, assetID, assetURL, thumbnailURL, type){
		switch(type){
			case "image":
				break;
			case "audio":
				//replace url
				thumbnailURL = $scope.genericAudioThumbnail;
				break;
			case "video":
				break;
			case "3d":
				break;
		}
		var newAsset = {
			name: assetName,
			value: assetURL,
			content_type: type,
			arobj_id: $scope.curObj.arobj_id,
			content_id: assetID,
			thumbnail: thumbnailURL
		}
		$scope.updatedAssets = $scope.curObj.assets;
		$scope.updatedAssets[$scope.updatedAssets.length] = newAsset;
		$scope.uploadCount ++;
		if($scope.uploadCount == $scope.files.length){
			$scope.addAssets();
		}
	}

	//helper function to scopify assets for deletion purposes
    $scope.setAssets = function(){
    	$scope.curAssets = $scope.curObj.assets;
    }
}
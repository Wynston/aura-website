//AuraBox local module controller
auraCreate.auraBox = function($scope, $http){

	//displays the local hosted webcam view from the AuraBox
	$scope.displayAuraBoxWebcamModal = function(){
		$("#AuraBoxWebcamModal").modal();
	}

	//syncs a beacon's object assets to local from firebase
	$scope.syncBeacon = function(beacon){
		var assetsToSync = [];
		for(var i = 0; i < $scope.objectsArray[i].length; i++){
			if(beacon.beacon_id == $scope.objectsArray[i].beacon_id){
				for(var j = 0; j < $scope.objectsArray[i].assets[j]; j++){
					assetsToSync.push($scope.objectsArray[i].assets[j].value);
				}
			}
		}
		$http({
        method: 'POST',
        url: "http://10.0.1.1",
        data: assetsToSync
		}).then(function mySuccess(response) {
			alertSuccess("SUCCESS: the beacon " + beacon.beacon_name + " has been locally synced!");
		}, function myError(response) {
		    alertFailure("Error: failed to sync the beacon " + beacon.beacon_name + ".\n" + response.statusText);
		});
	}
}

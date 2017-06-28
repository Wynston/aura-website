//handles the loading of stats
auraCreate.statManagement = function($scope, $http){
	//loads in stats about an organization to be displayed
    $scope.loadStats = function(){
		$scope.statsArray = [];
		for(var i = 0; i < willStats.latlong.length; i++){
			$scope.stat = {
				latitude: willStats.latlong[i].lat,
				longitude: willStats.latlong[i].long
			}
			$scope.statsArray[i] = $scope.stat;
		}
    	sessionStorage.statsArray = JSON.stringify($scope.statsArray);
    }
}
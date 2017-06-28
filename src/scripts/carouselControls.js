//controller for bootstrap carousel
auraCreate.carouselControls = function($scope){
	//helps the carousel notify the controller what the current organization is
	$scope.carouselViewController = function(view){
		var index = $('div.active').index();
		$scope.changeView(view, $scope.organizationsArray[index]);
	}

	//when a new organization is selected reload the current view of that organization
	$scope.carouselRight = function(){
		var index = $('div.active').index() + 1;
		if(index < $scope.organizationsArray.length){
			$scope.curOrgSlide = index + 1;
			$scope.changeView($scope.curView, $scope.organizationsArray[index]);
		}
		else{
			$scope.curOrgSlide = 1;
			$scope.changeView($scope.curView, $scope.organizationsArray[0]);
		}
	}

	//when a new organization is selected reload the current view of that organization
	$scope.carouselLeft = function(){
		var index = $('div.active').index() - 1;
		if(index >= 0){
			$scope.curOrgSlide = index + 1;
			$scope.changeView($scope.curView, $scope.organizationsArray[index]);
		}
		else{
			$scope.curOrgSlide = $scope.organizationsArray.length;
			$scope.changeView($scope.curView, $scope.organizationsArray[$scope.organizationsArray.length - 1]);
		}
	}

	//increments the current slide tracker for assets
	$scope.assetSlideRight = function(){
		if($scope.curAssetSlide < $scope.assets.length){
			$scope.curAssetSlide = $scope.curAssetSlide + 1;
		}
		else{
			$scope.curAssetSlide = 1;
		}
	}

	//decrements the current slide tracker for assets
	$scope.assetSlideLeft = function(){
		if($scope.curAssetSlide > 1){
			$scope.curAssetSlide = $scope.curAssetSlide - 1;
		}
		else{
			$scope.curAssetSlide = $scope.assets.length;
		}
	}
}
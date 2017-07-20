//controls the bootstrap modal content
auraCreate.auraBox = function($scope, $http){

	//displays the local hosted webcam view from the AuraBox
	$scope.displayAuraBoxWebcamModal = function(){
		$("#AuraBoxWebcamModal").modal();
	}
}

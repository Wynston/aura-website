//controls the content displayed on the dashboard
auraCreate.dashboard = function($scope){
	//load google charts once angular has loaded
	google.charts.load('current', {'packages':['corechart', 'controls']});
	$scope.chartsInitialized = false;


	// Load google charts api before displaying anything
	$scope.initDashboard = function(){
		google.charts.setOnLoadCallback(setTimeout($scope.drawCharts, 1000));
	}
	
	//draws all the pie charts for the dashboard
	$scope.drawCharts = function(){
		//initializes data if they do not exist
		if(!($scope.chartsInitialized)){

			//initializes the charts once angular and google charts has loaded
			$scope.beaconsByTypeChart = new google.visualization.PieChart(document.getElementById('beaconsByTypeChart'));
			$scope.objectsByBeaconChart = new google.visualization.PieChart(document.getElementById('objectsByBeaconChart'));
			$scope.assetsByTypeChart = new google.visualization.PieChart(document.getElementById('assetsByTypeChart'));

			$scope.chartsInitialized = true;
		}

		$scope.drawBeaconsByTypeChart();
		$scope.drawObjectsByBeaconChart();
		$scope.drawAssetsByTypeChart();
	}

	//draws a pie chart displaying the number of beacons by each type
	$scope.drawBeaconsByTypeChart = function(){
		var data = new google.visualization.DataTable();

        data.addColumn('string', 'Type');
        data.addColumn('number', 'Tally');
		for(var i = 0; i < $scope.beaconTypes.length; i++){
			data.addRow([$scope.beaconTypes[i].type, $scope.beaconTypes[i].tally]);
		}

		var options = $scope.pieChartOptions;
		options.title = "Beacons Per Type";

        $scope.beaconsByTypeChart.draw(data, options);
	}

	//draws a pie chart displaying the number of objects assocaited with each beacon
	$scope.drawObjectsByBeaconChart = function(){
		var data = new google.visualization.DataTable();

        data.addColumn('string', 'Beacon');
        data.addColumn('number', 'numObjects');

  		var objPerBeacon = $scope.tallyObjectsPerBeacon();

  		//adds the data to the chart one beacon at a time
		for(var i = 0; i < $scope.beaconsArray.length; i++){
			data.addRow([$scope.beaconsArray[i].beacon_name, objPerBeacon[i]]);
		}

		var options = $scope.pieChartOptions;
		options.title = "Objects Per Beacon";

        $scope.objectsByBeaconChart.draw(data, options);
	}

	//draws a pie chart displaying the number of assets by file type
	$scope.drawAssetsByTypeChart = function(){
		var data = new google.visualization.DataTable();

        data.addColumn('string', 'Type');
        data.addColumn('number', 'Tally');

  		var assetTypeTally = $scope.tallyAssetsByType();

  		//adds the data to the chart one beacon at a time
		for(var i = 0; i < $scope.assetTypes.length; i++){
			data.addRow([$scope.assetTypes[i], assetTypeTally[i]]);
		}

		var options = $scope.pieChartOptions;
		options.title = "Assets Per Type";

        $scope.assetsByTypeChart.draw(data, options);
	}

	//tallys each asset content type
	$scope.tallyAssetsByType = function(){
		var assetTypeTally = [0,0,0];
		for(var i = 0; i < $scope.objectsArray.length; i++){
			assetTypeTally[0] += $scope.objectsArray[i].numImage;
			assetTypeTally[1] += $scope.objectsArray[i].numAudio;
			assetTypeTally[2] += $scope.objectsArray[i].numVideo;
		}
		return assetTypeTally;
	}

	//returns an array of integers that tally the amount of objects per beacon
	$scope.tallyObjectsPerBeacon = function(){
		//tallys the number of objects for each beacon
        var objPerBeacon = [];

        //instantiates the array to 0
		for(var i = 0; i < $scope.beaconsArray.length; i++){
			objPerBeacon[i] = 0;
		}

		//checks each objects and tally's the proper beacon
  		for(var i = 0; i < $scope.objectsArray.length; i++){
  			inner:
  			//compares the object's beacon_id with each beacon's id until there is a match
  			for(var j = 0; j < $scope.beaconsArray.length; j++){
  				if($scope.objectsArray[i].beacon_id == $scope.beaconsArray[j].beacon_id){
  					objPerBeacon[j] ++;
  					break inner;
  				}

  			}
  		}
		return objPerBeacon;
	}
}
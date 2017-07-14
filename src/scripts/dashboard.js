//controls the content displayed on the dashboard
auraCreate.dashboard = function($scope){
	// Load google charts api before displaying anything
	$scope.initDashboard = function(){
		$(document).ready(function() {
			google.charts.load('current', {'packages':['corechart', 'controls']});
			google.charts.setOnLoadCallback($scope.drawCharts);
		});
	}
	
	//draws all the pie charts for the dashboard
	$scope.drawCharts = function(){
		$scope.drawBeaconsByTypeChart();
		$scope.drawObjectsByBeaconChart();
		$scope.drawAssetsByTypeChart();
	}

	//draws a pie chart displaying the number of beacons by each type
	$scope.drawBeaconsByTypeChart = function(){
		data = new google.visualization.DataTable();
        data.addColumn('string', 'Type');
        data.addColumn('number', 'Tally');
		for(var i = 0; i < $scope.beaconTypes.length; i++){
			data.addRow([$scope.beaconTypes[i].type, $scope.beaconTypes[i].tally]);
		}

		var options = $scope.pieChartOptions;
		options.title = "Beacons Per Type"

        var chart = new google.visualization.PieChart(document.getElementById('beaconsByTypeChart'));
        chart.draw(data, options);
	}

	//draws a pie chart displaying the number of objects assocaited with each beacon
	$scope.drawObjectsByBeaconChart = function(){
		data = new google.visualization.DataTable();
        data.addColumn('string', 'Beacon');
        data.addColumn('number', 'numObjects');

  		var objPerBeacon = $scope.tallyObjectsPerBeacon();

  		//adds the data to the chart one beacon at a time
		for(var i = 0; i < $scope.beaconsArray.length; i++){
			data.addRow([$scope.beaconsArray[i].beacon_name, objPerBeacon[i]]);
		}

		var options = $scope.pieChartOptions;
		options.title = "Objects Per Beacon"

        var chart = new google.visualization.PieChart(document.getElementById('objectsByBeaconChart'));
        chart.draw(data, options);
	}

	//draws a pie chart displaying the number of assets by file type
	$scope.drawAssetsByTypeChart = function(){
		data = new google.visualization.DataTable();
        data.addColumn('string', 'Beacon');
        data.addColumn('number', 'numObjects');

  		var assetTypeTally = $scope.tallyAssetsByType();

  		//adds the data to the chart one beacon at a time
		for(var i = 0; i < $scope.assetTypes.length; i++){
			data.addRow([$scope.assetTypes[i], assetTypeTally[i]]);
		}

		var options = $scope.pieChartOptions;
		options.title = "Assets Per Type"

        var chart = new google.visualization.PieChart(document.getElementById('assetsByTypeChart'));
        chart.draw(data, options);
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
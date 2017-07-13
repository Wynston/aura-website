//controls the content displayed on the dashboard
auraCreate.dashboard = function($scope){
	// Load google charts api before displaying anything
	$scope.initDashboard = function(){
		$(document).ready(function() {
			google.charts.load('current', {'packages':['corechart']});
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
        data.addColumn('number', 'Total');
        data.addRows($scope.beaconTypes.length);
		var type = [];
		for(var i = 0; i < $scope.beaconTypes.length; i++){
			data.setCell(i, 0, $scope.beaconTypes[i].type);
			data.setCell(i, 1, $scope.beaconTypes[i].tally);
		}

        var options = {
          title: 'Beacons by type',
          is3D: true,
          backgroundColor: '#222',
          titleTextStyle: {
		        color: '#FFFFFF'
		    },
		    legend: {
		        textStyle: {
		            color: '#FFFFFF'
		        }
		    }
        };
        var chart = new google.visualization.PieChart(document.getElementById('beaconsByTypeChart'));
        chart.draw(data, options);
	}

	//draws a pie chart displaying the number of objects assocaited with each beacon
	$scope.drawObjectsByBeaconChart = function(){

	}

	//draws a pie chart displaying the number of assets by file type
	$scope.drawAssetsByTypeChart = function(){

	}

}
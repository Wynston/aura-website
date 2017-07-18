//config file that allows certain types and fields to be easily updated and changed
auraCreate.config = function($scope){
	//Database url https://website-155919.appspot.com/api/v1.0/
	//aura api key
	$scope.auraAPIKey = "dGhpc2lzYWRldmVsb3BlcmFwcA==";

	//google cloud storage urls
	$scope.queryUser = "https://website-155919.appspot.com/api/v1.0/user";
	$scope.queryOrgs = "https://website-155919.appspot.com/api/v1.0/organization";
	$scope.queryBeaconsByOrg = "https://website-155919.appspot.com/api/v1.0/newbeacon?filter[organization_id]=";
	$scope.queryBeacons = "https://website-155919.appspot.com/api/v1.0/newbeacon";
	$scope.queryObjectsByOrg = "https://website-155919.appspot.com/api/v1.0/arobj?filter[organization_id]=";
	$scope.queryObjects = "https://website-155919.appspot.com/api/v1.0/arobj";

	//firebase bucket and gs urls
	$scope.storageBucket = {
		storageBucket: "https://firebasestorage.googleapis.com/v0/b/auraalert-21339.appspot.com"
	};
	$scope.fireBaseGS = "gs://auraalert-21339.appspot.com/";

	//firebase custom metadata
	$scope.FBMetaData = {
		customMetadata: {
			'AuraAPIKey': $scope.auraAPIKey
		}
	};

	//images
	$scope.genericAudioThumbnail= "images/auraheadphone150.jpg";
	$scope.loaderGif = "images/load.gif";

	//initates scope variables
	$scope.curOrg;
	$scope.curBeacon;
	$scope.curObj;
	$scope.curAsset;
	$scope.curAssetIndex;
	$scope.curGalleryIndex;

	//valid beacon types and a tally object
	$scope.beaconTypes = [
		{type: "Airport", tally: 0},
		{type: "Art", tally: 0},
		{type: "Coffee-shop", tally: 0},
		{type: "Gallery", tally: 0},
		{type: "Landmark", tally: 0},
		{type: "Manufacturing", tally: 0},
		{type: "Museum", tally: 0},
		{type: "Office", tally: 0},
		{type: "Other", tally: 0},
		{type: "Park", tally: 0},
		{type: "Parking", tally: 0},
		{type: "Retail", tally: 0},
		{type: "Restaurant", tally: 0},
		{type: "Security", tally: 0},
		{type: "Trail", tally: 0},
		{type: "Zoo", tally: 0}
	];

	//media carousel filters, all preset to true
	$scope.galleryFilter = {
		image: true,
		audio: true,
		video: true,
		threeD: true
	}

	//asset content types
	$scope.assetTypes = ["Image", "Audio", "Video"];

	$scope.pieChartOptions = {
		width: '100%',
    	height: '100%',
        is3D: true,
        colors: ['rgb(233, 39, 49)', 'rgb(248, 174, 71)', 'rgb(31, 177, 240)', 
        		'rgb(112, 187, 77)', 'rgb(248, 236, 64)', 'rgb(22, 118, 183)',
        		'rgb(104, 54, 144)', 'rgb(75, 0, 130)', 'rgb(185, 44, 98)',
        		'rgb(0, 255, 0)'
        ],
        pieSliceText: 'label',
        titleTextStyle: {
        	fontSize: "50",
  			bold: true,
        },
        tooltip: {
        	ignoreBounds: true
        },
        backgroundColor: {
        	fill: '#222',
        	stroke: '#111',
        	strokeWidth: '2'
        },
        titleTextStyle: {
	    	color: '#FFFFFF'
	    },
	    legend: {
	    	position: "bottom",
	        textStyle: {
	            color: '#FFFFFF'
	        }
	    }
	};
}
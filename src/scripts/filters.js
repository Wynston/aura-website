//-------------------------------------custom filters begins-------------------------------------

//filters an object list by beacon
app.filter('filterByBeacon', function() {

	return function(objectsArray, beaconsFilter) {
	    var filteredObjects = [];
	    angular.forEach(objectsArray, function(obj) {
	      if(beaconsFilter == 'All') {
	        filteredObjects.push(obj);
	      }
	      else{
	      	if(obj.beacon_name == beaconsFilter){
    			filteredObjects.push(obj);
    		}
    		else{
    			//object is not associated to the beacon
    		}
	      }
	    });
	    return filteredObjects;
  	}
});

//remove duplicate items from a dropdown menu
app.filter('removeDuplicates', function() {
	return function(objectsArray) {
	    var filteredItems = [];
	    angular.forEach(objectsArray, function(obj) {
	    	var duplicate = false;
	    	for(var i = 0; i < filteredItems.length; i++){
	    		if(filteredItems[i].beacon_name == obj.beacon_name){
	    			duplicate = true;
	    			break;
	    		}
	    		else{
	    			//not a duplicate in this comparison
	    		}
	    	}
	    	if(duplicate){
	    		//don't add it to the list
	    	}
	    	else{
	    		//add it to the list since it is not a duplicate
	    		filteredItems.push(obj);
	    	}
	    });
	    return filteredItems.sort(function(a, b){
		    if(a.beacon_name < b.beacon_name) return -1;
		    if(a.beacon_name > b.beacon_name) return 1;
		    return 0;
		});
  	}
});

//-------------------------------------end of custom filters-------------------------------------
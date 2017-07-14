//handles file input parsing and compression of files
auraCreate.fileUpload = function($scope){
	//updates the current files to be uploaded
	//	NOTE: JS array methods don't work with FileList objects
    $scope.uploadFile = function(files){
        if($scope.files.length == 0){
        	$scope.files = files;
        }
        else{
        	//concant both arrays
        	var temp1 = [];
        	for(var i = 0; i < $scope.files.length; i++){
        		temp1[i] = $scope.files[i];
        	}
        	for(var i = 0; i < files.length; i++){
        		temp1[$scope.files.length + i] = files[i];
        	}
        	//remove duplicates
        	var temp2 = [];
			for(var i = 0; i < temp1.length; i++){
				//searching for a duplicate
				var cur = temp1[i];
				var duplicate = false;
				for(var j = 0; j < temp2.length; j++){
					if(cur.name == temp2[j].name){
						duplicate = true;
					}
				}
				if(duplicate == true){
					//don't add the element
				}
				else{
					//no duplicate case, add to array
					temp2[temp2.length] = cur;
				}
			}
        	$scope.files = temp2;
        }
        $scope.safeApply();
    }; 

    //removes a file from the currently upload files
    //	NOTE: JS array methods don't work with FileList objects
    $scope.removeFile = function(index){
		var temp = []
		//element to remove is the first 
		if(index == 0){
			for(var i = 0; i < $scope.files.length - 1; i++){
				temp[i] = $scope.files[i + 1];
			}
		}
		//element to remove is the last
		else if(index == $scope.files.length - 1){
			for(var i = 0; i < $scope.files.length - 1; i++){
				temp[i] = $scope.files[i];
			}
		}
		//element to remove is in the middle
		else{
			//copy elements before the index
			for(var i = 0; i < index; i++){
				temp[i] = $scope.files[i];
			}
			//copy elements after the index and shift left
			for(var i = index + 1; i < $scope.files.length; i++){
				temp[i - 1] = $scope.files[i];
			}
		}
		$scope.files = temp;
    }

    //changes the thumbnail label to the selected file name
    $scope.updateThumbnailLabel = function(event){
    	//slice the C:fakepath from the src and display it to the user
    	var thumb = document.getElementById("thumbnailSelect");
  		var thumbURL = (thumb.value).slice(12);
    	$scope.curThumbnail = thumbURL;
    	$scope.$apply();
    }

	//scales a thumbnail to about 150px by 150px to be easily stored in firebase
	$scope.thumbnailResize = function(name, desc){
		var filesToUpload = document.getElementById('thumbnailSelect').files;
	    var file = filesToUpload[0];

	    // Create an image
	    var img = document.createElement("img");
	    // Create a file reader
	    var reader = new FileReader();
	    // Set the image once loaded into file reader
	    reader.onload = function(e)
	    {
	        img.src = e.target.result;
	        img.onload = function(){
	        	var canvas = document.createElement("canvas");
		        var ctx = canvas.getContext("2d");
		        ctx.drawImage(img, 0, 0);

		        //thumbnail size is 150px by 150px
		        var width = 150;
		        var height = 150;
		        
		        canvas.width = width;
		        canvas.height = height;
		        var ctx = canvas.getContext("2d");
		        ctx.drawImage(img, 0, 0, width, height);

		        var dataurl = canvas.toDataURL("image/jpg");  
		        $scope.uploadThumbnail(name, desc, dataurl); 
	        }
	    }
	    // Load files into file reader
	    reader.readAsDataURL(file);
	}

	//helper function to loop through input files 
	$scope.multiFileUpload = function(){
		for (var i = 0; i < $scope.files.length; i++) {
			//file extension of the input files
			var type = JSON.stringify($scope.files[i].name);
			type = (type.split('.').pop()).toLowerCase();
			type = type.slice(0, type.length - 1);

			//resize if its an image file then upload
			if(type == "jpg" || type == "png" || type == "gif"){
				$scope.resizeAsset($scope.files[i], $scope.fileNames[i], "image");
			}
			//audio upload
			else if(type == "mp3" || type == "wav" || type == "ogg"){
				$scope.uploadFBAsset( $scope.fileNames[i], $scope.files[i], "", "audio");
			}
			//video upload
			else if(type == "mp4" || type == "avi" || type == "mpg" || type == "mv4" || type == "webm"){
				$scope.captureVideoThumbnail($scope.files[i], $scope.fileNames[i], "video");
			}
			//if no cases are present then the file type is invalid
			else{
				alertFailure("ERROR: " + type + " is not supported.");
			}
		}
	}

	//resize an asset to be 750px and creates a 150px by 150px thumbnail version of itself
	$scope.resizeAsset = function(file, fileName, type){
		// Create an image/video and a thumbnail copy
		var asset;
		switch(type){
			case "image":
				asset = document.createElement("img");
				break;
		}
	    var assetThumbnail = document.createElement("img");
	    // Create a file reader
	    var reader = new FileReader();
	    // Set the image once loaded into file reader
	    reader.onload = function(e){
	        asset.src = e.target.result;
	        assetThumbnail.src = e.target.result;
	        asset.onload = function(){
	        	assetThumbnail.onload = function(){
	        		//canvas for the main asset
	        		var canvas1 = document.createElement("canvas");
			        var ctx1 = canvas1.getContext("2d");
			        ctx1.drawImage(asset, 0, 0);

			        //canvas for the asset thumbnail
			        var canvas2 = document.createElement("canvas");
			        var ctx2 = canvas2.getContext("2d");
			        ctx2.drawImage(assetThumbnail, 0, 0);

			        //width and height for the main asset
			        //  Note: Scale height proportional to width of 750px
			        var oldHeight = asset.height;
			        var oldWidth = asset.width;
			        var width1;
			        var height1;

			        //scaling for the main asset
			        var scaleFactor  = 750 / oldWidth;
			        width1 = oldWidth * scaleFactor;
			        height1 = oldHeight * scaleFactor;

			        //width and height for the asset thumbnail 
			        	//thumbnails are 150px by 150px
			        var width2 = 150;
			        var height2 = 150;

			        //draws the scaled asset on the canvas
			        canvas1.width = width1;
			        canvas1.height = height1;
			        var ctx1 = canvas1.getContext("2d");
			        ctx1.drawImage(asset, 0, 0, width1, height1);

			        //draws the scaled asset on the canvas
			        canvas2.width = width2;
			        canvas2.height = height2;
			        var ctx2 = canvas2.getContext("2d");
			        ctx2.drawImage(assetThumbnail, 0, 0, width2, height2);

			        //taking the base64 url for the asset and its thumbnail
			        var assetURL
			       	switch(type){
			       		case "image":
			       			assetURL = canvas1.toDataURL("image/jpg"); 
			       			break;
			       	}
			        var thumbnailURL = canvas2.toDataURL("image/jpg");

			        $scope.uploadFBAsset(fileName, assetURL, thumbnailURL, type);

			        // clean up
			        asset.remove();
			        assetThumbnail.remove();
			        canvas1.remove();
			        canvas2.remove();
	        	}
	        }
	    }
	    //Load files into file reader
	    reader.readAsDataURL(file);
	}

	//creates a thumbnail from a video file and requests them to be uploaded to firebase (Thumbnail size of 150px by 150px)
	$scope.captureVideoThumbnail = function(file, fileName, type){
		// Create a file reader
	    var reader = new FileReader();
	    // Set the image once loaded into file reader
		reader.onload = function(e){
			//create video element and set it to 1 second for image capture
			var video = document.createElement('video');
			video.preload = 'auto';
			video.src = e.target.result;
			video.onloadeddata = function() {
				var canvas = document.createElement("canvas");
				//determine aspect ratio and scales the image accordingly
				var ratio = (video.videoWidth / video.videoHeight);
				switch(ratio){
					//4:3 aspect ratio
					case (4/3):
						canvas.getContext('2d').drawImage(video, 0, 0, 200, 150);
						break;
					//16:9 aspect ratio
					case (16/9):
						canvas.getContext('2d').drawImage(video, 0, 0, 300, 150);
						break;
					//3:2 aspect ratio
					case (3/2):
						canvas.getContext('2d').drawImage(video, 0, 0, 225, 150);
						break;
					//21:9 aspect ratio
					case (21/9):
						canvas.getContext('2d').drawImage(video, 0, 0, 350, 150);
						break;
					default:
						canvas.getContext('2d').drawImage(video, 0, 0);
						break;
				}

				//place the video in the canvas and capture the instance
		    	var thumbnailURL = canvas.toDataURL("image/jpg");
		    	$scope.uploadFBAsset(fileName, file, thumbnailURL, type);

		    	// //clean up
		    	video.remove();
		    	canvas.remove();
			}
		}
		reader.readAsDataURL(file);
	}
}
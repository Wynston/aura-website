//------------------Start of Custom Alert System-------------------------

//shows a success alert of a given message
function alertSuccess(msg){
	console.log(msg);
	$('#alert').html('<div class="alert alert-success alert-dismissable fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span>'+msg+'</span></div>');
	
	//automatically fades out
	$("#alert").fadeTo(2000, 500).slideUp(500, function(){
	    $("#alert").slideUp(500);
	});
}

//shows a fail alert of a given message
function alertFailure(msg){
	console.log(msg);
	$('#alert').html('<div class="alert alert-danger alert-dismissable fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><span>'+msg+'</span></div>');
	
	//automatically fades out
	$("#alert").fadeTo(2000, 500).slideUp(500, function(){
	    $("#alert").slideUp(500);
	});
}

//------------------End of Custom Alert System---------------------------
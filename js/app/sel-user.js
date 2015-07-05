var selectedNames =["杨玉芳1","杨玉芳2","杨玉芳3"];
function addUser(name){
	for(var i=0;i<selectedNames.length;i++){
		if(name==selectedNames[i]){
			return;
		}
	}
	selectedNames.push(name);
	$('#selectedUser').append('<div class="alert alert-info span4"> <a class="close" data-dismiss="alert" href="#">×</a>' + name + '</div>');
	$('a[data-dismiss="alert"]:last').click(function() {
		var text = $(this).parent().text();
		var username = text.substring(2, text.length);
		for (var i = 0; i < selectedNames.length; i++) {
			if (selectedNames[i] == username) {
				selectedNames.splice(i, 1);
				 $('.table img[name="'+username+'"]').attr('style','');
				break;
			}
		}

	});
}
function removeUser(name){
	for(var i=0;i<selectedNames.length;i++){
		if(name==selectedNames[i]){
			selectedNames.splice(i,1);
			break;
		}
	}
	$('.alert-info').each(function(index,element){
		var text = $(this).text();
		var alertName = text.substring(2, text.length);
		 
		if(alertName==name){
			$(this).remove();
			 return;
		}
	});
}
$(".table img").toggle(function() {
	$(this).css("border", "2px solid green");
	var name = $(this).attr('name');
	addUser(name);
	
}, function() {
	$(this).attr('style', '');
	var name = $(this).attr('name');
	removeUser(name)
})
 
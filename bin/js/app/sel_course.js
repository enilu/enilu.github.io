var selectedNames = new Array();
	
 

	
		//将已选中的课程加入已选择列表selectedNames中
		console.log(selectedNames);
		console.log($('a[data-dismiss="alert"]'));
	 $('a[data-dismiss="alert"]').each(function(index,element){
					  var text = $(this).parent().text();
		 var courseName = text.substring(2,text.length-1); 
		 selectedNames.push(courseName);
		 });
	console.log(selectedNames);
	 $('input').click(function(){
	 	var courseName = $(this).attr('coursename');
			for(var i=0;i<selectedNames.length;i++){
				if(selectedNames[i]== courseName){
					return;	
			}
		}
		selectedNames.push(courseName);
		 
		$('#selectedCourse').append('<div class="alert alert-info span4"> <a class="close" data-dismiss="alert" href="#">×</a>'+courseName+'</div>'); 
	 });

	 $('a[data-dismiss="alert"]').click(function(){
		 var text = $(this).parent().text();
		 var courseName = text.substring(2,text.length-1); 
		 for(var i=0;i<selectedNames.length;i++){			 
			if(selectedNmaes[i]==courseName){
					selectedNames.splice(i,1);
					break;
			}	 
		 }
		 
	 }); 
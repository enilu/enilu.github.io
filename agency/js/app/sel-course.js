var selectedNames = new Array();
// $(document).ready(function() {
// 将已选中的课程加入已选择列表selectedNames中 
$('a[data-dismiss="alert"]').each(function(index, element) {
	var text = $(this).parent().text();
	var courseName = text.substring(2, text.length);
	selectedNames.push(courseName);
});
console.log(selectedNames);

$('input[name="course"]').change(function() {
	 
	var courseName = $(this).attr('coursename');
	//取消选中
	if($(this).attr('checked')!='checked'){
		for (var i = 0; i < selectedNames.length; i++) {
			if (selectedNames[i] == courseName) {
				selectedNames.splice(i, 1);
				break;
			}
		}
		
		$('.alert-info').each(function(index,element){
			var text = $(this).text();
			var alertName = text.substring(2, text.length);
			console.log(alertName);
			if(alertName==courseName){
				$(this).remove();
				 return;
			}
		});
		
		return ;
	}
	//选中

	for (var i = 0; i < selectedNames.length; i++) {
		if (selectedNames[i] == courseName) {
			return;
		}
	}
	selectedNames.push(courseName);

	$('#selectedCourse').append('<div class="alert alert-info span4"> <a class="close" data-dismiss="alert" href="#">×</a>' + courseName + '</div>');
	/**
	 * 为新选择的课程注册移出事件
	 */
	$('a[data-dismiss="alert"]:last').click(function() {
		var text = $(this).parent().text();
		var courseName = text.substring(2, text.length);
		for (var i = 0; i < selectedNames.length; i++) {
			if (selectedNames[i] == courseName) {
				selectedNames.splice(i, 1);
				break;
			}
		}

	});
});
//为已选择的课程注册移出事件
$('a[data-dismiss="alert"]').click(function() {
	var text = $(this).parent().text();
	var courseName = text.substring(2, text.length);
	for (var i = 0; i < selectedNames.length; i++) {
		if (selectedNames[i] == courseName) {
			selectedNames.splice(i, 1);
			break;
		}
	}

});
// });

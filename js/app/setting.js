$('.textarea_editor').wysihtml5();
	$('.btnUpdate').click(function(){
		$(this).hide();
		var text = $(this).prev().text();		 
		$(this).prev().hide();
		$(this).prev().prev().show();
		$(this).prev().prev().prev().val(text).show();
		 
	});
	$('.btnOk').click(function(){
		$(this).hide();
		$(this).prev().hide();
		var text = $(this).prev().val();
		$(this).next().html(text).show();
		$(this).next().next().show();
	});
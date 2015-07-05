
    $("input[type='file']").change(function(evt){ 
        var files = evt.target.files;  
 
        for (var i = 0, f; f = files[i]; i++) { 
 
          if (!f.type.match('image.*')) { 
            continue; 
          } 
 
          var reader = new FileReader(); 
 
          reader.onload = (function(theFile) { 
            return function(e) {                                 
             $("#imgView img").attr("src",e.target.result);  //预览图片的位置                  
            }; 
          })(f); 
 
          reader.readAsDataURL(f); 
        } 
    }); 
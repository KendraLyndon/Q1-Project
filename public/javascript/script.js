$(document).ready(function(){
  var link = $('a');
  link.on('mouseenter',function(){
    // $(this).css('color','#0001F0');
    $(this).css('color','#E32643');
    $(this).css('font-size',55)
  });
  link.on('mouseleave',function(){
    // $(this).css('color','#525AFF');
    $(this).css('color','#9E0D18');
    $(this).css('font-size',45);
  })
})

//'#005AFF'

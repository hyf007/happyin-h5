'use strict';

var display = [];
var Time = [];
$(function(){
	$('.helpcenter-title-box').on('click',function(e){
		e.preventDefault();
		var index = $(this).parent().index();
		clearTimeout(Time[index]);
		if(display[index] == null || display[index] == 1) {
			display[index] = 0;
			$(this).parent().find('.hidden-content-box').css({'height': '87px', 'border': '1px solid #dddddd', 'border-top': 'none'});
			$(this).css({'border-bottom-right-radius': 0, 'border-bottom-left-radius': 0});
			$(this).find('.triangle').css({'transform': 'rotate(90deg)', '-webkit-transform': 'rotate(90deg)'});
		}else {
			display[index] = 1;
			$(this).parent().find('.hidden-content-box').css({'height': '0'});
			$(this).find('.triangle').css({'transform': 'rotate(0deg)', '-webkit-transform': 'rotate(0deg)'});
			var $that = $(this);
			Time[index] = setTimeout(function(){
				$that.parent().find('.hidden-content-box').css({'border': 'none'});
				$that.css({'border-bottom-right-radius': '5px', 'border-bottom-left-radius': '5px'});
			},450)
		}
		//console.log(display);
		//console.log(Time);
	})
});
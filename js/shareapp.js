/**
 * Created by Administrator on 2016/4/27.
 */
'use strict';

var screenWidth = $(window).width();  //屏幕宽度
var screenHeight = $(window).height(); //屏幕高度

$(function(){
	var per = screenWidth/320;
	$('html').css('font-size', (0.625 * per) * 100 + '%');
});

//获取查询字符串参数
function getQueryStringArgs() {
	var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
		args = {},
		items = qs.length ? qs.split("&") : [],
		item = null,
		name = null,
		value = null,
		i = 0,
		len = items.length;
	for (i = 0; i < len; i++) {
		item = items[i].split('=');
		name = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);
		if (name.length) {
			args[name] = value;
		}
	}
	return args;
}

$(function() {
	$('.shareapp-btn').on('touchstart', function () {
		$('.shareapp-btn-box').css({
			'-webkit-transform': 'scale3d(0.97,0.97,1)',
			'transform': 'scale3d(0.97,0.97,1)'
		});
	}).on('touchend', function () {
		$('.shareapp-btn-box').css({'-webkit-transform': 'scale3d(1,1,1)', 'transform': 'scale3d(1,1,1)'});
		//todo
	});
});




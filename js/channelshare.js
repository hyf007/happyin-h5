'use strict';


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


var ua = navigator.userAgent;
var environment = {
	isIos: (ua.indexOf('Mac') > -1 && ua.indexOf('Mobile') > -1),
	isAndroid: (ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('Android ') > -1 && ua.indexOf('AppleWebKit') > -1),
	isWinPhone: (ua.indexOf('Windows Phone') > -1)
};

var downloadHref = '';
var phone = '';
if(getQueryStringArgs().channel == 'toutiao'){
	if(environment.isAndroid){
		downloadHref = 'http://happyin-10041765.file.myqcloud.com/apk/toutiao-release-1.0.7.apk';
		phone = '_a';
	}
	if(environment.isIos){
		downloadHref = 'https://api.happyin.com.cn/Catalog/Stat/adClick?d=59d40fe4&t=59d40fe4-5ba5-4a1b-a195-1dd238901b90';
		phone = '_i';
	}
}else {
	downloadHref = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.happyin.print';
}


//var microDownloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.happyin.print';	//微下载地址
function toDownload(){
	$.ajax({
		url: location.protocol + '//' + location.host + '/Catalog/Stat/shareDow',
		dataType: 'text',
		data: {
			target: getQueryStringArgs().channel + '' + phone
		},
		success: function(d){
			//console.log(d);
			location.href = downloadHref;
		},
		error: function(e){
			//console.log(e);
			location.href = downloadHref;
		}
	});
}

function forStat() {
	$.ajax({
		url: location.protocol + '//' + location.host + '/Catalog/Stat/shareStat',
		dataType: 'text',
		data: {
			stat: 1,
			target: getQueryStringArgs().channel + '' + phone
		},
		success: function(d){

		},
		error: function(e){

		}
	});
}


$(function(){
	forStat();

	$('.banner-btn').on('click',function(){
		toDownload();
	});
	$('.fcs-back-productbtn').on('click',function(){
		toDownload();
	});

	$('.fcs-btn-receive').on('touchstart',function(){
		$('.fcs-receivebtn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
	}).on('touchend',function(){
		$('.fcs-receivebtn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
	}).on('click',function(){
		toDownload();
	});
});




'use strict';

var screenWidth = $(window).width();  //屏幕宽度
var screenHeight = $(window).height(); //屏幕高度

var ua = navigator.userAgent;
//alert(ua);
var environment = {
	isWeixin: (/MicroMessenger/i).test(ua),
	isLogin: getQueryStringArgs().code,
	isQq: (/QQ/i).test(ua),
	isIos: (ua.indexOf('Mac') > -1 && ua.indexOf('Mobile') > -1),
	isAndroid: (ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('Android ') > -1 && ua.indexOf('AppleWebKit') > -1),
	isWeibo: (ua.indexOf('Weibo') > -1),
	isWinPhone: (ua.indexOf('Windows Phone') > -1)
};

//各平台登陆appId
var appId = {
	'isQq': '101308522',
	'isWeixin': 'wx59fc01b1ef6fcfe5',
	'isWeibo': '3366847509'
};

var microDownloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.happyin.print';	//微下载地址

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

$(function(){
	var per = screenWidth/320;
	$('html').css('font-size', (0.625 * per) * 100 + '%');

	$('.banner-btn').on('click',function(){
		location.href = microDownloadUrl;
	});

	if (environment.isWeixin) {
		getJsSdkData();
	}

	$('.fcs-btn-receive').on('touchstart',function(){
		$('.fcs-receivebtn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
	}).on('touchend',function(){
		$('.fcs-receivebtn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
	}).on('click',function(){
		location.href = microDownloadUrl;
	});

	$('.fcs-banner-btn').on('touchend',function(){
		location.href = microDownloadUrl;
	});
});


//微信jssdk
function getJsSdkData() {
	var weixinShareJson = {
		'title': '对不起！让您花钱洗了这么多年照片',
		'desc': '终身免费手机照片冲印APP',
		'link': location.protocol + '//' + location.host + '/order/freecouponshare.html?target=appShare',
		'imgUrl': 'http://happyin-10041765.file.myqcloud.com/admin/images/logo.jpg'
	};


	$.ajax({
		url: location.protocol + '//' + location.host + '/Catalog/User/getJSSDK',
		dataType: 'json',
		data: {
			url: location.href,
			platform: 2
		},
		success: function (d) {
			console.log(d);

			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: appId.isWeixin, // 必填，公众号的唯一标识
				timestamp: d.timestamp, // 必填，生成签名的时间戳
				nonceStr: d.noncestr, // 必填，生成签名的随机串
				signature: d.signature, // 必填，签名，见附录1
				jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});

			wx.ready(function() {

				// 分享给朋友
				wx.onMenuShareAppMessage({
					title: weixinShareJson.title,
					desc: weixinShareJson.desc,
					link: weixinShareJson.link,
					imgUrl: weixinShareJson.imgUrl,
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});

				// 分享到朋友圈
				wx.onMenuShareTimeline({
					title: weixinShareJson.title,
					link: weixinShareJson.link,
					imgUrl: weixinShareJson.imgUrl,
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});

				// 分享到QQ
				wx.onMenuShareQQ({
					title: weixinShareJson.title,
					desc: weixinShareJson.desc,
					link: weixinShareJson.link,
					imgUrl: weixinShareJson.imgUrl,
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});

				// 分享到腾讯微博
				wx.onMenuShareWeibo({
					title: weixinShareJson.title,
					desc: weixinShareJson.desc,
					link: weixinShareJson.link,
					imgUrl: weixinShareJson.imgUrl,
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});

				// 分享到Q-zone
				wx.onMenuShareQZone({
					title: weixinShareJson.title,
					desc: weixinShareJson.desc,
					link: weixinShareJson.link,
					imgUrl: weixinShareJson.imgUrl,
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
			})
		},
		error: function(e){
			console.log(e);
		}
	});
}


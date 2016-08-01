'use strict';

var ua = navigator.userAgent;
var environment = {
	isWeixin: (/MicroMessenger/i).test(ua),
	isLogin: getQueryStringArgs().code,
	isQq: (/QQ/i).test(ua),
	isIos: (ua.indexOf('Mac') > -1 && ua.indexOf('Mobile') > -1),
	isAndroid: (ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('Android ') > -1 && ua.indexOf('AppleWebKit') > -1),
	isWeibo: (ua.indexOf('Weibo') > -1),
	isWinPhone: (ua.indexOf('Windows Phone') > -1)
};

var microDownloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.happyin.print';	//微下载地址
function toMicroDownload(){
	$.ajax({
		url: location.protocol + '//' + location.host + '/Catalog/Stat/shareDow',
		dataType: 'text',
		data: {
			target: getQueryStringArgs().target
		},
		success: function(d){
			location.href = microDownloadUrl;
		},
		error: function(e){
			location.href = microDownloadUrl;
		}
	});
}

//各平台登陆appId
var appId = {
	'isQq': '101308522',
	'isWeixin': 'wx59fc01b1ef6fcfe5',
	'isWeibo': '3366847509',
	'isWeixinTest': 'wx207054e35ea10f5a'
};

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

//获取cookie用于快速登陆
var loginToken = $.cookie('LoginToken')==undefined? '': $.cookie('LoginToken');

//统计
function forStat() {
	$.ajax({
		url: location.protocol + '//' + location.host + '/Catalog/Stat/shareStat',
		dataType: 'text',
		data: {
			stat: 1,
			target: getQueryStringArgs().target
		},
		success: function(d){

		},
		error: function(e){

		}
	});
}

//注册环节
function webRegister(type){
	forStat();
	console.log('loginToken:'+loginToken);
	//alert('type:' + type + ';code:' + getQueryStringArgs().code + ';ident:' + getQueryStringArgs().ident + ';token:'+loginToken);
	$.ajax({
		url: location.protocol + '//' + location.host + '/Catalog/User/webRegister',
		dataType: 'json',
		data: {
			type: type,
			code: getQueryStringArgs().code,
			ident: getQueryStringArgs().ident,
			token: loginToken
		},
		success: function(d){
			//alert('成功');
			//alert(JSON.stringify(d));
			console.log(d);
			if (d.c == 200 && d.p.result != false) {
				buildDom(d.p);
				$.cookie('LoginToken', d.p.token,{expires:30});
			}else if(d.c == 200 && d.p.result == false){
				$.cookie('LoginToken', '',{expires:-1});
				location.href = redirectUrl;
			}else{
				$.cookie('LoginToken', '',{expires:-1});
				location.href = redirectUrl;
			}

		},
		error: function(e){
			//alert('失败');
			//alert(JSON.stringify(e));
			$.cookie('LoginToken', '',{expires:-1});
			location.href = redirectUrl;
		}
	})
}

//显示剩余的图片
function showOtherImg() {
	$('.cp-back-title').find('img').eq(1).attr('src','images/coupon/coupon_backimg_title.jpg');
	for(var i = 1; i< 5; i++) {
		$('.cp-back-spread').find('img').eq(i-1).attr('src','images/coupon/coupon_backimg_bottom0'+ i +'.jpg');
	}
	$('.cp-back-spread').find('img').eq(4).attr('src','images/coupon/coupon_backimg_bottomline.jpg');
}

//微信jssdk
function getJsSdkData() {
	var weixinShareJson = {
		'title': '对不起！让您花钱洗了这么多年照片',
		'desc': '终身免费手机照片冲印APP',
		'link': location.protocol + '//' + location.host + '/order/coupon.html?ident=' + getQueryStringArgs().ident + '&target=' + getQueryStringArgs().target,
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

/*function fnResize(){
	var screenWidth = $(window).width();  //屏幕宽度
	var screenHeight = $(window).height(); //屏幕高度
	var per = screenWidth/320;
	$('html').css('font-size', (0.625 * per) * 100 + '%');
}*/

var redirectUrl = '';
$(function () {
	$('.banner-btn').on('click',function(){
		toMicroDownload();
	});
	//回调地址
	redirectUrl = location.protocol + '//' + location.host + '/order/coupon.html?ident=' + getQueryStringArgs().ident + '&target=' + getQueryStringArgs().target;

	/*//rem适应布局
	fnResize();
	window.addEventListener("resize", function() {
		fnResize()
	}, false);*/

	//QQ登陆
	if(environment.isQq && environment.isWeixin == false) {
		if (!environment.isLogin && loginToken == '') {
			location.href = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + appId.isQq + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&state=STATE';
		}else {
			var type = 2;
			webRegister(type);
		}

	//weixin登陆 测试环境
	}else if(environment.isWeixin && location.host == 'dev.happyin.com.cn') {
		getJsSdkData();
		if (!environment.isLogin && loginToken == '') {
			location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId.isWeixinTest + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
		}else {
			var type = 0;
			webRegister(type);
		}

	//weixin登陆 正式环境
	}else if(environment.isWeixin && location.host == 'api.happyin.com.cn') {
		getJsSdkData();
		if (!environment.isLogin && loginToken == '') {
			location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId.isWeixin + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
		}else {
			var type = 0;
			webRegister(type);
		}

	//weibo登陆
	}else if(environment.isWeibo) {
		if (!environment.isLogin && loginToken == '') {
			location.href = 'https://api.weibo.com/oauth2/authorize?client_id='+appId.isWeibo+'&redirect_uri='+ redirectUrl +'&response_type=code';
		}else {
			//alert(getQueryStringArgs().code);
			var type = 1;
			webRegister(type);
		}

	//普通浏览器打开
	}else {
		location.href = location.protocol + '//' + location.host + '/as/1';
	}
});

function buildDom(data){
	if (data.self_received != undefined) {			//如果已领取
		var resultText = data.self_received;
		setResult(resultText.title,resultText.count,resultText.unit,resultText.code);
	}else {
		if(data.all_received == true) {				//如果全领完
			$('.cp-back-end').css('display','block');
		}else {										//可领取
			$('.cp-back-receive').css('display','block');
		}
	}

	showOtherImg();
	setFriendsList(data);	//加载好友列表

	$('.cp-btn-receive').on('touchstart',function(){
		$('.cp-receivebtn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
	}).on('touchend',function() {
		$('.cp-receivebtn-box').css({'-webkit-transform': 'scale3d(1,1,1)', 'transform': 'scale3d(1,1,1)'});
	}).on('click',function(){
		var inputTelephone = $('.cp-input').val();
		var reg = /1[345678]{1}\d{9}$/;
		if(reg.test(inputTelephone)) {
			$.ajax({
				url: location.protocol + '//' + location.host + '/Catalog/User/webRegister',
				dataType: 'json',
				type: 'POST',
				data: {
					ident: getQueryStringArgs().ident,
					token: data.token,
					telephone: inputTelephone
				},
				success: function(d){
					console.log(d);
					if (d.c == 200) {
						if (d.p.phone_illegal != undefined && d.p.phone_illegal === true) {
							alertSomething('请输入正确的手机号');
							$('.cp-input').val('').blur();
						}else if(d.p.phone_same != undefined && d.p.phone_same === true){
							alertSomething('手机号重复领取');
							$('.cp-input').val('').blur();
						}else {
							$('.cp-input').val('').blur();
							$('.cp-back-receive').css('display','none');
							if(d.p.all_received == true) {
								$('.cp-back-end').css('display','block');
								$('.cp-back-title').css('display','none');
								$("html,body").animate({scrollTop:0}, 500);
							}else {
								if(d.p.result) {
									setResult(d.p.result.title,d.p.result.count,d.p.result.unit,d.p.result.code);
									$('.cp-back-title').css('display','none');
									$("html,body").animate({scrollTop:0}, 500);
								}else if(d.p.self_received) {
									setResult(d.p.self_received.title,d.p.self_received.count,d.p.self_received.unit,d.p.self_received.code);
									$('.cp-back-title').css('display','none');
									$("html,body").animate({scrollTop:0}, 500);
								}
							}
							setFriendsList(d.p);
						}
					}
				},
				error: function(e){
					//alert(JSON.stringify(e));
					alertSomething('领取失败，请稍后重试。');
					$('.cp-input').val('').blur();
				}
			})

		}else if(!reg.test(inputTelephone) && inputTelephone != ''){
			alertSomething('请输入正确的手机号');
			$('.cp-input').val('').blur();
		}
	});
}


function setFriendsList(data) {
	//创建好友列表
	$('.cp-back-friends').css('display','none');
	if (data.list != '' && data.list != undefined) {
		var friendsUlHTML = '';
		for(var i=0; i<data.list.length; i++) {
			var index = data.list[i];
			friendsUlHTML += '<li class="clearfix">' +
				'<div class="cp-friendimg-box">' +
				'<img alt="" src="images/userdefaultimg.png">' +
				'<img alt="" src="'+ index.avatar +'">' +
				'<div class="cp-friendimg-cover"></div>' +
				'</div>' +
				'<div class="cp-friendtext-box">' +
				'<div class="clearfix">' +
				'<p class="cp-friend-name">'+ index.name +'</p>' +
				'<p class="cp-friend-date">'+ index.add_time +'</p>' +
				'</div>' +
				'<p class="cp-friend-content">手气不错，抽到'+ index.desc.replace('抵扣','') +'优惠券</p>' +
				'</div>' +
				'<p class="cp-friend-num">'+ index.count + index.unit + '</p>' +
				'</li>';
		}
		$('.cp-friends-ul').html(friendsUlHTML);
		$('.cp-back-friends').css('display','block');
	}
}

function setResult(title,count,unit,code) {
	$('.cp-resulttext-title').html(title);
	var countStr = ''+count;
	$('.cp-resulttext-number').html(count).css('left',16.5-(countStr.length*1.5) + 'rem');
	$('.cp-resulttext-unit').html(unit).css('left',17.5+(countStr.length*1.5) + 'rem');
	$('.cp-resulttext-code').html('兑换码: ' + code);
	$('.cp-back-result').css('display','block');

	$('.cp-btn-result').on('touchstart',function(){
		$('.cp-resultbtn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
	}).on('touchend',function(){
		$('.cp-resultbtn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
	}).on('click',function(){
		toMicroDownload();
	})
}

function alertSomething(content) {
	$('body').bind('touchmove', function (e) {
		e.preventDefault();
	});
	$('.alert-content').html(content);
	$('.alert-btn').on('touchend',function(e){
		e.preventDefault();
		$('body').unbind('touchmove');
		$('.alert-backcover').css('opacity','0');
		setTimeout(function(){
			$('.alert-backcover').hide();
		},300);
	});
	$('.alert-backcover').show();
	setTimeout(function(){
		$('.alert-backcover').css('opacity','1');
	},1);
}

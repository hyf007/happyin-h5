'use strict';

var screenWidth = $(window).width();  //屏幕宽度
var screenHeight = $(window).height(); //屏幕高度

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

var appId;
// QQ
if (environment.isQq) {
	appId = '100585261';
}
if (environment.isWeixin) {
	appId = 'wxea7a5f9ccf96e433';
}

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

//var redirectUrl =  location.protocol + '//' + location.host + location.pathname;
var redirectUrl = 'http://app.himoca.com/order/coupon.html';
//var redirectUrl = 'http://www.himoca.com/';
$(function () {
	var per = screenWidth/320;
	$('html').css('font-size', (0.625 * per) * 100 + '%');



	//QQ登陆
	if(environment.isQq) {
		alert(redirectUrl);
		alert(appId);
		if (!environment.isLogin) {
			//alert(2);
			location.href = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&state=STATE';
		}else if(environment.isLogin) {
			alert(getQueryStringArgs().code);
		}

	}
	//微信登陆
	if(environment.isWeixin) {
		//alert(redirectUrl);
		//alert(appId);
		if (!environment.isLogin) {
			//alert(2);
			location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
		}else if(environment.isLogin) {
			//alert(getQueryStringArgs().code);
			//location.href = 'http://app.himoca.com:9967/Catalog/User/webRegister?type=0&code=' + getQueryStringArgs().code;
			$.ajax({
				url: 'http://app.himoca.com/Catalog/User/webRegister',
				dataType: 'json',
				data: {
					type: 0,
					code: getQueryStringArgs().code,
					ident: 'a1871a'
				},
				success: function(d){
					//alert('成功');
					//alert(JSON.stringify(d));
					console.log(d);
					if (d.c == 200) {
						buildDom(d.p);
					}

				},
				error: function(e){
					alert('失败');
					alert(JSON.stringify(e));
				}
			})

		}

	}
});

//var inputTelephone = 13811708195;
function buildDom(data){
	if (data.list != '') {
		for(var i=0; i<data.list.length; i++) {
			var index = data.list[i];
			$('.cp-friends-ul').append('' +
				'<li class="clearfix">' +
					'<div class="cp-friendimg-box">' +
						'<img alt="" src="'+ index.avatar +'">' +
						'<div class="cp-friendimg-cover"></div>' +
					'</div>' +
					'<div class="cp-friendtext-box">' +
						'<p class="cp-friend-nameanddate">'+ index.name +' <i>0000.0.0 00:00</i></p>' +
						'<p class="cp-friend-content">'+ index.desc +'</p>' +
					'</div>' +
					'<p class="cp-friend-num">'+ index.count +'张</p>' +
				'</li>');
		}
		$('.cp-friends-list').css('display','block');
	}


	$('.cp-btn').on('touchstart',function(){
		$('.cp-btn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
	}).on('touchend',function(){
		$('.cp-btn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
		var inputTelephone = $('.cp-input').val();
		alert(inputTelephone);
		$.ajax({
			url: 'http://app.himoca.com/Catalog/User/webRegister',
			dataType: 'json',
			type: 'POST',
			data: {
				ident: 'a1871a',
				token: data.token,
				telephone: inputTelephone
			},
			success: function(d){
				alert(JSON.stringify(d));
			},
			error: function(e){
				alert(JSON.stringify(e));
			}

		})

	});
}
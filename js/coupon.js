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
	appId = 'wx207054e35ea10f5a';
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
var redirectUrl = 'http://happyin.marujunyy.cn/order/coupon.html' + location.search;
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
			$.ajax({
				url: location.protocol + '//' + location.host + '/Catalog/User/webRegister',
				dataType: 'json',
				data: {
					type: 0,
					code: getQueryStringArgs().code,
					ident: getQueryStringArgs().ident
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

function buildDom(data){
	if (data.self_received != false) {			//如果已领取
		var resultText = data.self_received;
		setResult(resultText.count,resultText.unit,resultText.code);
	}else {
		if(data.all_received == true) {
			$('.cp-back-end').css('display','block');
		}else {
			$('.cp-back-receive').css('display','block');
		}
	}

	if (data.list != '') {
		for(var i=0; i<data.list.length; i++) {
			var index = data.list[i];
			$('.cp-friends-ul').append('' +
				'<li class="clearfix">' +
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
						'<p class="cp-friend-content">'+ index.desc +'</p>' +
					'</div>' +
					'<p class="cp-friend-num">'+ index.count +'张</p>' +
				'</li>');
		}
		$('.cp-back-friends').css('display','block');
	}


	$('.cp-btn-receive').on('touchstart',function(){
		$('.cp-receivebtn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
	}).on('touchend',function(){
		$('.cp-receivebtn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
		var inputTelephone = $('.cp-input').val();
		var reg = /^\d{11}$/;
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
						$('.cp-back-receive').css('display','none');
						setResult(d.p.count,d.p.unit,d.p.code);
					}
				},
				error: function(e){
					alert(JSON.stringify(e));
				}
			})

		}else if(!reg.test(inputTelephone) && inputTelephone != ''){
			alert('请输入正确的11位数字');
			$('.cp-input').val('');
		}
	});
}

function setResult(count,unit,code) {
	$('.cp-resulttext-number').html(count);
	$('.cp-resulttext-unit').html(unit);
	$('.cp-resulttext-content').html('无使用门槛' + count + unit + '说免费就免费');
	$('.cp-resulttext-code').html('兑换码: ' + code);
	$('.cp-back-result').css('display','block');

	$('.cp-btn-result').on('touchstart',function(){
		$('.cp-resultbtn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
	}).on('touchend',function(){
		$('.cp-resultbtn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
		//todo
	});
}
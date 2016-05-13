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

var appId;
// QQ
if (environment.isQq) {
	appId = '100585261';
}
if (environment.isWeixin) {
	appId = 'wx59fc01b1ef6fcfe5';
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

var loginToken = $.cookie('LoginToken')==undefined? '': $.cookie('LoginToken');

function webRegister(type){
	console.log('loginToken:'+loginToken);
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

function showOtherImg() {
	$('.cp-back-title').find('img').eq(1).attr('src','images/coupon/coupon_backimg_title.jpg');
	for(var i = 1; i< 5; i++) {
		$('.cp-back-spread').find('img').eq(i-1).attr('src','images/coupon/coupon_backimg_bottom0'+ i +'.jpg');
	}
	$('.cp-back-spread').find('img').eq(4).attr('src','images/coupon/coupon_backimg_bottomline.jpg');
}

//var redirectUrl =  location.protocol + '//' + location.host + location.pathname;
//var redirectUrl = location.protocol + '//' + location.host + '/order/coupon.html?ident=' + getQueryStringArgs().ident + '&target=' + getQueryStringArgs().target;
var redirectUrl = '';
$(function () {
	redirectUrl = 'http://happyin.marujunyy.cn/order/coupon.html?ident=' + getQueryStringArgs().ident + '&target=' + getQueryStringArgs().target;
	var per = screenWidth/320;
	$('html').css('font-size', (0.625 * per) * 100 + '%');

	$('.loadcover').on('touchstart',function(e){
		e.preventDefault();
	});



	if(environment.isQq && environment.isWeixin == false) {		//QQ登陆
		showOtherImg();
		if (!environment.isLogin) {
			location.href = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&state=STATE';
		}else if(environment.isLogin) {

		}

	}else if(environment.isWeixin) {					//weixin登陆
		if (!environment.isLogin && loginToken == '') {
			location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
		}else {
			//$('.loadcover').remove();
			var type = 0;
			webRegister(type);
		}
	}else if(environment.isWeibo) {						//weibo登陆
		showOtherImg();
	}else {												//普通浏览器打开
		location.href = location.protocol + '//' + location.host + '/order/freecouponshare.html';
	}
});

function buildDom(data){
	if (data.self_received != undefined) {			//如果已领取
		var resultText = data.self_received;
		setResult(resultText.count,resultText.unit,resultText.code);
	}else {
		if(data.all_received == true) {				//如果全领完
			$('.cp-back-end').css('display','block');
		}else {										//可领取
			$('.cp-back-receive').css('display','block');
		}
	}

	showOtherImg();
	setFriendsList(data);

	$('.cp-btn-receive').on('touchstart',function(){
		$('.cp-receivebtn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
	}).on('touchend',function(){
		$('.cp-receivebtn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
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
							$('.cp-input').val('');
						}else if(d.p.phone_same != undefined && d.p.phone_same === true){
							alertSomething('手机号重复领取');
							$('.cp-input').val('');
						}else {
							$('.cp-back-receive').css('display','none');
							if(d.p.all_received == true) {
								$('.cp-back-end').css('display','block');
								$('.cp-back-title').css('display','none');
								$("html,body").animate({scrollTop:0}, 500);
							}else {
								if(d.p.result) {
									setResult(d.p.result.count,d.p.result.unit,d.p.result.code);
									$('.cp-back-title').css('display','none');
									$("html,body").animate({scrollTop:0}, 500);
								}else if(d.p.self_received) {
									setResult(d.p.self_received.count,d.p.self_received.unit,d.p.self_received.code);
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
					$('.cp-input').val('');
				}
			})

		}else if(!reg.test(inputTelephone) && inputTelephone != ''){
			alertSomething('请输入正确的手机号');
			$('.cp-input').val('');
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
				'<p class="cp-friend-content">手气不错，抽到相框抵扣券</p>' +
				'</div>' +
				'<p class="cp-friend-num">'+ index.count + index.unit + '</p>' +
				'</li>';
		}
		$('.cp-friends-ul').html(friendsUlHTML);
		$('.cp-back-friends').css('display','block');
	}
}

function setResult(count,unit,code) {
	var countStr = ''+count;
	$('.cp-resulttext-number').html(count).css('left',16.5-(countStr.length*1.5) + 'rem');
	$('.cp-resulttext-unit').html(unit).css('left',17.5+(countStr.length*1.5) + 'rem');
	$('.cp-resulttext-code').html('兑换码: ' + code);
	$('.cp-back-result').css('display','block');

	$('.cp-btn-result').on('touchstart',function(){
		$('.cp-resultbtn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
	}).on('touchend',function(){
		$('.cp-resultbtn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
		//todo
	});
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

'use strict';

var dataArray = [
	{
		"Q":"关于网页授权回调域名的说明",
		"A":"1、在微信公众号请求用户网页授权之前，开发者需要先到公众平台官网中的开发者中心页配置授权回调域名。请注意，这里填写的是域名（是一个字符串），而不是URL，因此请勿加 http:// 等协议头；"
	},
	{
		"Q":"关于网页授权的两种scope的区别说明",
		"A":"1、以snsapi_base为scope发起的网页授权，是用来获取进入页面的用户的openid的，并且是静默授权并自动跳转到回调页的。用户感知的就是直接进入了回调页（往往是业务页面）"
	},
	{
		"Q":"关于网页授权access_token和普通access_token的区别",
		"A":"1、微信网页授权是通过OAuth2.0机制实现的，在用户授权给公众号后，公众号可以获取到一个网页授权特有的接口调用凭证（网页授权access_token），通过网页授权access_token可以进行授权后接口调用，如获取用户基本信息；"
	},
	{
		"Q":"关于UnionID机制",
		"A":"1、请注意，网页授权获取用户基本信息也遵循UnionID机制。即如果开发者有在多个公众号，或在公众号、移动应用之间统一用户帐号的需求，需要前往微信开放平台（open.weixin.qq.com）绑定公众号后，才可利用UnionID机制来满足上述需求。"
	}
];

var display = [];
var Time = [];
var contentBoxHeight = [];
$(function(){
	FastClick.attach(document.body);
	for (var i = 0; i< dataArray.length; i++) {
		$('.helpcenter-ul').append('' +
			'<li class="helpcenter-li">' +
				'<a class="helpcenter-title-box">' +
					'<div class="triangle"></div>' +
					'<p class="helpcenter-title">'+ dataArray[i].Q +'</p>' +
				'</a>' +
				'<div class="hidden-content-box">' +
					'<div class="helpcenter-content-box">' +
						'<p class="helpcenter-content">'+ dataArray[i].A +'</p>' +
					'</div>' +
				'</div>' +
			'</li>')
	}
	$('.hidden-content-box').each(function(index,domEle){
		var conHeight = $(domEle).height();
		contentBoxHeight.push(conHeight);
		$(domEle).css("height","0");
	});
	$('.helpcenter-title-box').on('click',function(e){
		e.preventDefault();
		var index = $(this).parent().index();
		clearTimeout(Time[index]);
		if(display[index] == null || display[index] == 1) {
			display[index] = 0;
			$(this).parent().find('.hidden-content-box').css({'height': contentBoxHeight[index], 'border': '1px solid #dddddd', 'border-top': 'none'});
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
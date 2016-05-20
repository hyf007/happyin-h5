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

var login_uid = '';
var user_info = '';
var user_vip;

function connectWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		callback(WebViewJavascriptBridge)
	} else {
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			callback(WebViewJavascriptBridge)
		}, false)
	}
}

connectWebViewJavascriptBridge(function(bridge) {
	bridge.init();

	$(function(){
		bridge.callHandler('UserInfo',{},function(d){
			if(typeof d === 'string') {
				var d = JSON.parse(d);
			}
			//alert(JSON.stringify(d));
			login_uid = d.uid;
			user_vip = d.vip;
			if(user_vip){
				$('.freecoupon-back-isnotvip').hide();
				$('.freecoupon-back-isvip').show();
			}else {
				$('.freecoupon-back-isvip').hide();
				$('.freecoupon-back-isnotvip').show();
			}
			toGetShareLimit();
		});
	});

	function toGetShareLimit() {
		$.ajax({
			url: location.protocol + '//' + location.host + '/Catalog/Coupon/myCoupon',
			dataType: 'json',
			data: {
				type: 0,
				login_uid: login_uid
			},
			success: function(d){
				console.log(d);
				//alert(JSON.stringify(d));
				var shareLimit = d.p.shareFree_limit;
				//var info = d.p.share.info;
				$('.freecoupon-btn').on('touchstart',function(){
					$('.freecoupon-btn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
				}).on('touchend',function(){
					$('.freecoupon-btn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
					toShareFreeCoupon(shareLimit);
				});
			},
			error: function(e){
				//alert(JSON.stringify(e));
			}
		})
	}

	function toShareFreeCoupon(shareLimit) {
		bridge.callHandler('Share',{'share': true,'share_limit': shareLimit},function(d){
			if(typeof d === 'string') {
				var d = JSON.parse(d);
			}
			//alert(JSON.stringify(d));
			user_info = d.user_info;
			if (!!d.result == true && user_vip == false) {
				toCheckSuccess();
			}else {

			}
		});
	}

	function toCheckSuccess() {
		var paramsJson = {};
		paramsJson.type = 3;
		paramsJson.login_uid = login_uid;
		paramsJson.ident = user_info;
		var url = location.protocol + '//' + location.host + '/Catalog/User/verifyShare';
		bridge.callHandler('CallInterface',{'url': url,'params': paramsJson},function(d){
			if(typeof d === 'string') {
				var d = JSON.parse(d);
			}
			if (d.success === true) {
				toAlert(d.result, d.payload);
			}
		});
	}

	function toAlert(result,payload) {
		var alertResult = true;
		bridge.callHandler('AlertInfo',{'info': result, 'payload': payload, 'result': alertResult},function(d){
		});
		if(alertResult === true) {
			bridge.callHandler('PopView',{},function(d){
			});
		}else {

		}
	}
});




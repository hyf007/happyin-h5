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
	//旧的API
	if (window.WebViewJavascriptBridge) {
		return callback(WebViewJavascriptBridge)
	} else {
		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			WebViewJavascriptBridge.init();
			callback(WebViewJavascriptBridge)
		}, false)
	}

	//新的API
	if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
	if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

connectWebViewJavascriptBridge(function(bridge) {
	//bridge.init();

	$(function(){
		bridge.callHandler('UserInfo',{},function(d){
			if(typeof d === 'string') {
				var d = JSON.parse(d);
			}
			//alert(JSON.stringify(d));
			login_uid = d.uid;
			user_vip = d.vip;

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
				//var p = JSON.stringify(d);
				//$('body').append('<p style="width: 100%;">'+ p +'</p>');
				var shareLimit = d.p.shareFree_limit;
				var receiveState;
				$('html').css('background','#ffd600');
				if(!user_vip){
					$('.freecoupon-title').show();
					$('.freecoupon-back-isvip').hide();
					$('.freecoupon-back-isnotvip').show();
					receiveState = true;
				}else {
					receiveState = d.p.receive_state;
					$('.freecoupon-title').show();
					if(receiveState){
						$('.freecoupon-back-isvip').hide();
						$('.freecoupon-back-isnotvip').show();
					}else {
						$('.freecoupon-back-isnotvip').hide();
						$('.freecoupon-back-isvip').show();
					}
				}


				//var info = d.p.share.info;
				$('.freecoupon-btn').on('touchstart',function(){
					$('.freecoupon-btn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
				}).on('touchend',function(){
					$('.freecoupon-btn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
					toShareFreeCoupon(shareLimit,receiveState);
				});
			},
			error: function(e){
				//alert(JSON.stringify(e));
			}
		})
	}

	function toShareFreeCoupon(shareLimit,receiveState) {
		bridge.callHandler('Share',{'share': true,'share_limit': shareLimit},function(d){
			if(typeof d === 'string') {
				var d = JSON.parse(d);
			}
			//alert(JSON.stringify(d));
			user_info = d.user_info;
			if (!!d.result == true && receiveState == true) {
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




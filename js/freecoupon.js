/**
 * Created by Administrator on 2016/4/27.
 */
'use strict';



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
		$('.freecoupon-btn').on('touchstart',function(){
			$('.freecoupon-btn-box').css({'-webkit-transform':'scale3d(0.97,0.97,1)','transform':'scale3d(0.97,0.97,1)'});
		}).on('touchend',function(){
			$('.freecoupon-btn-box').css({'-webkit-transform':'scale3d(1,1,1)','transform':'scale3d(1,1,1)'});
			toShareFreeCoupon();
		});
		$.ajax({

		})
	});

	function toShareFreeCoupon() {
		bridge.callHandler('ShareFreeCoupon',{'share': true},function(d){

		});
	}
});
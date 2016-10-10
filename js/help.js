'use strict';

var dataArray = [
	{
		"Q":"怎样获得免费冲印券？",
		"A":'点击首页第一个"终身免费冲印"，“分享领取本月冲印券”本月就可以免费冲印20张照片，每月1号可以重新领取。'
	},
	{
		"Q":"免费冲印券要怎样使用？",
		"A":"选完照片类商品放入购物车，我们会自动帮你选择最省钱的那张优惠券，如果您有多张优惠券也可以自行选择。"
	},
	{
		"Q":"什么时候能发货？",
		"A":"我们会在48小时内发货，部分定制商品会在48小时内发货，发货时Happyin将会给您发推送通知，并且在快递配送时也会提醒您，请务必开启Happyin的推送权限以便您第一时间接到通知。"
	},
	{
		"Q":"照片上传失败怎么办？",
		"A":"信号不稳定或者网速太慢可能会造成上传失败，建议您换个WIFI或者使用4G网络上传。"
	},
	{
		"Q":"我的订单显示照片未上传是什么意思？",
		"A":"如果您在上传完成之前删掉了相册里的照片，会导致订单照片缺失，请添加我们的客服微信号：happyin520，将您的订单号码发送给我们。"
	},
	{
		"Q":"我在朋友圈领取的冲印券要怎么用？",
		"A":"您在朋友圈中输入的手机号就是您的兑换口令，请在帐户页或帐户-优惠券中点击黄色框输入手机号或口令领取优惠券。"
	},
	{
		"Q":"还没解决？联系我们",
		"A":"请联系我们的客服。<br>工作时间：10:00 - 22:00（周一至周五）<br>客服电话：13968141803（客服小快）<p style='text-indent: 5em;'>13671333828（客服小乐）</p>"
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
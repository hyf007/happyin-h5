/**
 * Created by Poko on 2016/4/6.
 */
'use strict';

var pokoConsole = true;
var version = 2;

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

var imgDownloadDomain;

//各平台登陆appId
var appId = {
	'isQq': '101308522',
	'isWeixin': 'wx59fc01b1ef6fcfe5',
	'isWeibo': '3366847509'
};

// 获取查询字符串参数
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

function flexSlider() {
	$(".flexslider").flexslider({
		animation: 'slide',				//滑动
		slideshow: true,				//自动播放
		animationSpeed: 300,			//图片切换300ms
		slideshowSpeed: '3000',			//自动播放间隔
		directionNav: false,			//不显示左右按钮
		keyboard: false					//不允许键盘控制
	});
}

//调换尺寸 功能废弃
function refreshSize() {
	var refreshCheck = 0;
	$('.ps-refresh-btn').on('click',function(e){
		e.preventDefault();
		if (refreshCheck == 0) {
			$('.ps-size-box').css({'-webkit-transform':'translate3d(0,-1.4rem,0)','transform':'translate3d(0,-1.4rem,0)'});
			refreshCheck=1;
		}else if(refreshCheck == 1) {
			$('.ps-size-box').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
			refreshCheck=0;
		}

	})
}

//调整下载按钮尺寸 功能废弃
function flexDownloadBtn() {
	var psBoxHeight = $('.ps-box').height();
	var psDownloadbtnBoxHeight = $('.ps-downloadbtn-box').height();
	if (psBoxHeight > (screenHeight-psDownloadbtnBoxHeight)) {
		$('.ps-box').css({'padding-bottom': '8rem'});
	}
}

//alert优化
function alertSomething(content) {
	$('body').bind('touchmove', function (e) {
		e.preventDefault();
	});
	$('.alert-content').html(content);
	$('.alert-btn').on('touchend',function(e) {
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

// 根据需要返回2倍图大小
function getRetinaImgSize(size) {
	if(window.devicePixelRatio >= 2) {
		return size*2;
	} else {
		return size;
	}
}

var addImgIndex = 0;
function addImg(d,mark) {
	if(addImgIndex < d.p.list.images.length) {
		var proImgsrc = d.p.list.images[addImgIndex];
		var proImgwidth = parseInt(getRetinaImgSize(screenWidth)>=828? 828:getRetinaImgSize(screenWidth));
		var proImgheight = parseInt(proImgwidth*0.859375+1);
		var proImgsize = '_' + proImgwidth + 'x' + proImgheight;
		var proImgorisrc = 'http://'+ imgDownloadDomain +'/' + proImgsrc.split('.')[0] + '.' + proImgsrc.split('.')[1];
		var proImgtruesrc = 'http://'+ imgDownloadDomain +'/' + proImgsrc.split('.')[0] + proImgsize + '.' + proImgsrc.split('.')[1];


		var oImg = new Image();
		oImg.alt = '';
		if(mark == 0) {
			oImg.src = proImgtruesrc;
		}else {
			oImg.src = proImgorisrc;
		}
		$(oImg).attr('width','100%');
		$(oImg).load(function(){
			$('.slides').append('<li class="ps-li"></li>').find('li').last().append(this);
			addImgIndex++;
			addImg(d,0);
		});
		$(oImg).error(function(){
			addImgIndex++;
			addImg(d,0);
		})
	}else {
		flexSlider();
		$('.flexslider').css('opacity','1');
	}
}

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

function buildDom(){
	if (screenWidth >= 768) {
		var per = 768/320;
		$('html').css({'font-size': (0.625 * per) * 100 + '%', 'max-width': '768px', 'margin': '0 auto'});
	}else {
		var per = screenWidth/320;
		$('html').css('font-size', (0.625 * per) * 100 + '%');
	}

	forStat();
	$.ajax ({
		//url: 'http://119.29.77.36:9967/Catalog/Catalog/detail',
		url: location.protocol + '//' + location.host + '/Catalog/Catalog/detail',
		dataType: 'json',
		data: {
			product_id: getQueryStringArgs().productId
		},
		success: function(d){
			if (pokoConsole) {
				console.log(d);
			}

			if (d.c == 200) {
				//颜色
				$('.ps-info-box').css('background',d.p.list.color);

				//商品名称
				$('.ps-enname').html(d.p.list.title3);
				$('.ps-chname').html(d.p.list.name);

				//尺寸
				if (!!d.p.list.cm.height) {
					var proCm = d.p.list.cm.length + 'x' + d.p.list.cm.width + 'x' + d.p.list.cm.height + ' cm';
				}else {
					var proCm = d.p.list.cm.length + 'x' + d.p.list.cm.width + ' cm';
				}

				var proInch = d.p.list.inch.length + 'x' + d.p.list.inch.width + 'x' + d.p.list.inch.height + ' inch';
				$('.ps-size').html(proCm);

				//价格
				var proPrice = d.p.list.price.split('.');
				if (proPrice[1] == '00') {
					$('.ps-cost').find('i').html(proPrice[0]);
				}else {
					$('.ps-cost').find('i').html(d.p.list.price);
				}
				$('.ps-cost-unit').html(d.p.list.unit_str);

				//描述
				$('.ps-desc').html(d.p.list.desc);

				if (d.p.list.images.length > 1) {
					$('.ps-cover-back').append('' +
						'<div class="flexslider">' +
							'<ul class="slides clearfix"></ul>' +
						'</div>'
					);


					addImg(d,0);
					/*for (var i = 0; i< d.p.list.images.length; i++) {
						//$('.slides').append('<li class="ps-li"><img alt="" src="' + proImgtruesrc + '" width="100%"></li>');
					}*/

				}else {
					for (var i = 0; i< d.p.list.images.length; i++) {
						var proImgsrc = d.p.list.images[i];
						var proImgwidth = parseInt(getRetinaImgSize(screenWidth)>=828? 828:getRetinaImgSize(screenWidth));
						var proImgheight = parseInt(proImgwidth * 0.859375+1);
						var proImgsize = '_' + proImgwidth + 'x' + proImgheight;
						var proImgtruesrc = 'http://'+ imgDownloadDomain +'/' + proImgsrc.split('.')[0] + proImgsize + '.' + proImgsrc.split('.')[1];
						$('.ps-cover-back').html('<img alt="" src="' + proImgtruesrc + '" width="100%">');
					}
				}

				if (environment.isWeixin) {
					var shareImgUrl = 'http://'+ imgDownloadDomain +'/' + d.p.list.images[0].split('.')[0] + '_300x300.' + d.p.list.images[0].split('.')[1];
					getJsSdkData(shareImgUrl);
				}


				//refreshSize();
				//flexDownloadBtn();
			}else if(d.c == 404) {
				alertSomething('该商品已下架 (e:20003)');
			}else {
				alertSomething('获取失败，请稍后再试。(e:20001)');
			}
		},
		error: function(e){
			alertSomething('获取失败，请稍后再试。(e:20002)');
		}
	})
}


//微信jssdk
function getJsSdkData(imgUrl) {
	var weixinShareJson = {
		'title': '我在Happyin上发现了一件商品，很符合你的气质',
		'desc': '终身免费手机照片冲印APP',
		'link': location.protocol + '//' + location.host + '/order/productshare.html?productId=' + getQueryStringArgs().productId + '&target=' + getQueryStringArgs().target,
		'imgUrl': imgUrl
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

$(function(){
	$('.banner-btn').on('click',function(e){
		e.preventDefault();
		toMicroDownload();
	});

	$.ajax({
		url:location.protocol + '//' + location.host + '/Catalog/System/getDomainInfo',
		dataType: 'json',
		data:{
			version: version,
			platform: 2
		},
		success: function(d){
			imgDownloadDomain = d.p.download_domain;
			buildDom();
		},
		error: function(){

		}
	});

});




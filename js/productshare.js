/**
 * Created by Poko on 2016/4/6.
 */
'use strict';

var pokoConsole = true;

var screenWidth = $(window).width();  //屏幕宽度
var screenHeight = $(window).height(); //屏幕高度

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

function flexSlider() {
	$(".flexslider").flexslider({
		animation: 'slide',
		slideshow: false,
		slideshowSpeed: '3000',
		directionNav: false,
		keyboard: false
	});
}

function refreshSize() {
	var refreshCheck = 0;
	$('.ps-refresh-btn').on('click',function(){
		if (refreshCheck == 0) {
			$('.ps-size-box').css({'-webkit-transform':'translate3d(0,-1.4rem,0)','transform':'translate3d(0,-1.4rem,0)'});
			refreshCheck=1;
		}else if(refreshCheck == 1) {
			$('.ps-size-box').css({'-webkit-transform':'translate3d(0,0,0)','transform':'translate3d(0,0,0)'});
			refreshCheck=0;
		}

	})
}

$(function(){
	var per = screenWidth/320;
	$('html').css('font-size', (0.625 * per) * 100 + '%');

	$.ajax ({
		url: 'http://119.29.77.36:9967/Catalog/Catalog/detail',
		dataType: 'json',
		data: {
			product_id: getQueryStringArgs().productId
		},
		success: function(d){
			if (pokoConsole) {
				console.log(d);
			}

			if (d.c == 200) {
				$('.ps-name').html(d.p.list.name);

				var proCm = d.p.list.cm.length + 'x' + d.p.list.cm.width + 'x' + d.p.list.cm.height + ' cm';
				var proInch = d.p.list.inch.length + 'x' + d.p.list.inch.width + 'x' + d.p.list.inch.height + ' inch';
				$('.ps-size-box').find('p').eq(0).html(proCm).parent().find('p').eq(1).html(proInch);

				var proPrice = d.p.list.price.split('.')[0];
				$('.ps-cost').find('i').html(proPrice);

				$('.ps-desc').html(d.p.list.desc);

				if (d.p.list.images.length > 1) {
					$('.ps-cover-back').append('' +
						'<div class="flexslider">' +
							'<ul class="slides clearfix"></ul>' +
						'</div>'
					);
					for (var i = 0; i< d.p.list.images.length; i++) {
						var proImgsrc = d.p.list.images[i];
						var proImgwidth = parseInt(screenWidth*2);
						var proImgheight = parseInt(proImgwidth*0.75);
						var proImgsize = '_' + proImgwidth + 'x' + proImgheight;
						var proImgtruesrc = 'http://hipubdev-10006628.file.myqcloud.com/' + proImgsrc.split('.')[0] + proImgsize + '.' + proImgsrc.split('.')[1];

						$('.slides').append('' +
							'<li class="ps-li">' +
								'<img alt="" src="'+ proImgtruesrc +'" width="100%">' +
							'</li>')
					}
					flexSlider();
				}else {
					for (var i = 0; i< d.p.list.images.length; i++) {
						var proImgsrc = d.p.list.images[i];
						var proImgwidth = parseInt(screenWidth * 2);
						var proImgheight = parseInt(proImgwidth * 0.75);
						var proImgsize = '_' + proImgwidth + 'x' + proImgheight;
						var proImgtruesrc = 'http://hipubdev-10006628.file.myqcloud.com/' + proImgsrc.split('.')[0] + proImgsize + '.' + proImgsrc.split('.')[1];
						$('.ps-cover-back').append('<img alt="" src="' + proImgtruesrc + '" width="100%">');
					}
				}

				refreshSize();
			}else {
				$('body').css('display','none');
				alert('获取失败，请稍后再试。(e:20001)');
			}
		},
		error: function(e){
			$('body').css('display','none');
			alert('获取失败，请稍后再试。(e:20002)');
		}
	})
});






﻿'use strict';

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

function checkTel(str, str2) {
	var s = str +' ';
	var arr = s.split(str2);
	if(arr.length < 2) {return str;}
	if(arr[1][0] == ':' || arr[1][0] == '：' || arr[1][0] == '/'){
		var n = [];
		for(var i=1; i<arr[1].length; i++){
			if( (!isNaN(arr[1][i]) && arr[1][i] != ' ') || (arr[1][i] == '-' && !isNaN(arr[1][i+1]) && arr[1][i+1] != ' ') ){
				n.push(arr[1][i]);
			} else {
				var result = ''+arr[0] + str2 + '：<a href="tel:'+n.join('')+'">'+n.join('')+'</a>' + str.slice(arr[0].length+n.length+3, str.length);
				return result;
			}
		}
	}
}


$(function(){
	$('.log-body').css('min-height',(screenHeight-54) + 'px');
	$.ajax({
		//url: 'js/data/logistics_data.json',
		url: location.protocol + '//' + location.host + '/Catalog/Express/traces',
		dataType: 'json',
		data: {
			order_id: getQueryStringArgs().orderId
		},
		success: function(d){
			if (pokoConsole) {
				console.log(d);
			}

			if (d.c == 200) {
				$('.user-name').html(d.p.shipping_firstname);	//姓名
				$('.user-tel').html(d.p.telephone);		//电话
				$('.user-state').find('i').eq(0).html(d.p.shipping_country).parent().find('i').eq(1).html(d.p.shipping_city);	//国家and城市
				$('.user-address').html(d.p.shipping_address_1);	//地址

				var orderDateTime = d.p.date_added.split(' ');
				var orderDate = orderDateTime[0].split('-').join('.');
				var orderTime = orderDateTime[1];
				$('.order-date').html(orderDate);	//日期
				$('.order-time').html(orderTime);	//时间
				$('.order-status').find('i').html(d.p.status);	//物流状态
				$('.order-number').find('i').html(d.p.shipping_id);	//物流单号
				$('.order-company').html(d.p.company);	//货运公司

				if (d.p.payload) {
					for(var i=0; i< d.p.payload.length; i++) {
						var index = i;
						$('.log-ul-box').append(
							'<li class="log-li-box">' +
							'<div class="log-div-box">' +
							'<div class="log-extra-bar"></div>' +
							'<div class="log-icon"></div>' +
							'<div class="log-text FZLTTHJW">' +
							'<p class="log-info-now">'+ checkTel(d.p.payload[index].AcceptStation,'电话') +'</p>' +
							'<p class="log-time-now">'+ d.p.payload[index].AcceptTime.split('-').join('.') +'</p>' +
							'</div>' +
							'</div>' +
							'<div class="vertical-bars"><span></span><span></span></div>' +
							'</li>'
						)
					}
					$('.log-div-box').each(function(index,domEle){
						$(domEle).find('.log-icon').css('background-image','url("images/icon_0'+ Math.abs((d.p.payload.length-(index+1))%7) +'.png")');
						var domHeight = $(domEle).height();
						if (domHeight > 50) {
							$(domEle).find('.log-extra-bar').css('height',(domHeight-50) + 'px');
						}
					});
				}else {
					$('.log-ul-box').css('display','none');
					$('.log-no-info').css('display','block');
				}
			$('.whitecover').css('display','none');
			}else {
				alertSomething('获取失败，请稍后再试。(e:10001)');
			}
		},
		error: function(e){
			console.log(e);
			alertSomething('获取失败，请稍后再试。(e:10002)');
		}
	})
});

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


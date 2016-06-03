'use strict';

$(function(){
	var dateValue = $('#search-date').val();
	$.ajax({
		url: location.protocol + '//' + location.host + '/Console/Mobile/SearchDate',
		dataType: 'json',
		data: {},
		success: function(d){
			alert(d);
		},
		error: function(e){
			alert(JSON.stringify(e));
		}
	})
});

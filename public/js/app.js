(function(){
		 $('.popup__link_registr').click(function(e){
		 	e.preventDefault();
	 	$('.flipper-container').addClass('flipp');
	 });
		 $('.popup__link_enter').click(function(e){
		 	e.preventDefault();
	 	$('.flipper-container').removeClass('flipp');
	 });
})();


// модуль валидации
var validation = (function() {
	'use strict';

	var init = function() {
		_setUpListners();
	};
	var _setUpListners = function() {
		//$('input').on('keydown',function(){
		//})
	};

// функция валидации формы
var validateForm = function(form) {
	var 
			elements = form.find('input'),
			valid = true;
// Проверяем все input
	$.each(elements, function(index, val){
		var
				element = $(val),
				val = element.val();
		if((val.length === 0)) {
			console.log('не валидна');
			valid = false;
		}
	})
	return valid;
};

var clearForm = function(form) {
	
	var 
			elements = form.find('input');

	$.each(elements, function(index, val){
		var
				element = $(val),
				val = element.val();
		element.val('');
		});
	};
	return {
		init: init,
		validateForm: validateForm,
		clearForm: clearForm
	};
})();
validation.init();


//Регистрация нового пользователя
var registration = (function() {
	'use strict';

	var init = function() {
		_setUpListners();
	};

	var _setUpListners = function() {
		$('#registration').on('click', _submitForm);
	};

	var _submitForm = function(ev){
		ev.preventDefault();
		var form = $(this).parent(),
				url = '/reg/',
				data = 
				{
	    		login: form.find('input[name = "login"]').val(),
	    		email: form.find('input[name = "email"]').val(),
	    		pass: form.find('input[name = "pass"]').val(),
	   		},
				servAns = _ajaxForm(form, url, data);
				if(servAns){
					console.log('выводим ответ от сервера');
					servAns.done(function(ans) {
						console.log(ans);
				})
			}	
	}
	var _ajaxForm = function (form, url, data){
		//если валидация прошла успешно, отправляем запрос на сервер
		if (!validation.validateForm(form)) return false;
		console.log('всё хорошо');
		// готовим данные 
	  data=JSON.stringify(data);
	  console.log(data);
	  // отправляем
		return $.ajax({
			url: '/reg/',
			type: 'POST',
			contentType: 'application/json',
			data: data
		});
		//validation.clearForm(form);
	}

	return {

		init: init
	};
})();
registration.init();

//Логин
var login = (function() {
	'use strict';

	var init = function() {
		_setUpListners();
	};

	var _setUpListners = function() {
		$('#login').on('click', _submitForm);
	};

	var _submitForm = function(ev){
		ev.preventDefault();
		var form = $(this).parent(),
				url = ' ',
				data = 
				{
	    		email: $('input[name = "email"]').val(),
	    		pass: $('input[name = "pass"]').val(),
	   		},
				servAns = _ajaxForm(form, url, data);
				if(servAns){
					console.log('выводим ответ от сервера');
					servAns.done(function(ans) {
					console.log(ans);
				})
			}	
	}
	var _ajaxForm = function (form, url, data){
		//если валидация прошла успешно, отправляем запрос на сервер
		if (!validation.validateForm(form)) return false;
		console.log('всё хорошо');
		// готовим данные 
	  data=JSON.stringify(data);
	  console.log(data);
	  // отправляем
		
		//validation.clearForm(form);
	}

	return {

		init: init
	};
})();
login.init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG5cdFx0ICQoJy5wb3B1cF9fbGlua19yZWdpc3RyJykuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHQgXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0IFx0JCgnLmZsaXBwZXItY29udGFpbmVyJykuYWRkQ2xhc3MoJ2ZsaXBwJyk7XHJcblx0IH0pO1xyXG5cdFx0ICQoJy5wb3B1cF9fbGlua19lbnRlcicpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0IFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCBcdCQoJy5mbGlwcGVyLWNvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCdmbGlwcCcpO1xyXG5cdCB9KTtcclxufSkoKTtcclxuXHJcblxyXG4vLyDQvNC+0LTRg9C70Ywg0LLQsNC70LjQtNCw0YbQuNC4XHJcbnZhciB2YWxpZGF0aW9uID0gKGZ1bmN0aW9uKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0fTtcclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdC8vJCgnaW5wdXQnKS5vbigna2V5ZG93bicsZnVuY3Rpb24oKXtcclxuXHRcdC8vfSlcclxuXHR9O1xyXG5cclxuLy8g0YTRg9C90LrRhtC40Y8g0LLQsNC70LjQtNCw0YbQuNC4INGE0L7RgNC80YtcclxudmFyIHZhbGlkYXRlRm9ybSA9IGZ1bmN0aW9uKGZvcm0pIHtcclxuXHR2YXIgXHJcblx0XHRcdGVsZW1lbnRzID0gZm9ybS5maW5kKCdpbnB1dCcpLFxyXG5cdFx0XHR2YWxpZCA9IHRydWU7XHJcbi8vINCf0YDQvtCy0LXRgNGP0LXQvCDQstGB0LUgaW5wdXRcclxuXHQkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGluZGV4LCB2YWwpe1xyXG5cdFx0dmFyXHJcblx0XHRcdFx0ZWxlbWVudCA9ICQodmFsKSxcclxuXHRcdFx0XHR2YWwgPSBlbGVtZW50LnZhbCgpO1xyXG5cdFx0aWYoKHZhbC5sZW5ndGggPT09IDApKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCfQvdC1INCy0LDQu9C40LTQvdCwJyk7XHJcblx0XHRcdHZhbGlkID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fSlcclxuXHRyZXR1cm4gdmFsaWQ7XHJcbn07XHJcblxyXG52YXIgY2xlYXJGb3JtID0gZnVuY3Rpb24oZm9ybSkge1xyXG5cdFxyXG5cdHZhciBcclxuXHRcdFx0ZWxlbWVudHMgPSBmb3JtLmZpbmQoJ2lucHV0Jyk7XHJcblxyXG5cdCQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oaW5kZXgsIHZhbCl7XHJcblx0XHR2YXJcclxuXHRcdFx0XHRlbGVtZW50ID0gJCh2YWwpLFxyXG5cdFx0XHRcdHZhbCA9IGVsZW1lbnQudmFsKCk7XHJcblx0XHRlbGVtZW50LnZhbCgnJyk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBpbml0LFxyXG5cdFx0dmFsaWRhdGVGb3JtOiB2YWxpZGF0ZUZvcm0sXHJcblx0XHRjbGVhckZvcm06IGNsZWFyRm9ybVxyXG5cdH07XHJcbn0pKCk7XHJcbnZhbGlkYXRpb24uaW5pdCgpO1xyXG5cclxuXHJcbi8v0KDQtdCz0LjRgdGC0YDQsNGG0LjRjyDQvdC+0LLQvtCz0L4g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXHJcbnZhciByZWdpc3RyYXRpb24gPSAoZnVuY3Rpb24oKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0X3NldFVwTGlzdG5lcnMoKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdCQoJyNyZWdpc3RyYXRpb24nKS5vbignY2xpY2snLCBfc3VibWl0Rm9ybSk7XHJcblx0fTtcclxuXHJcblx0dmFyIF9zdWJtaXRGb3JtID0gZnVuY3Rpb24oZXYpe1xyXG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciBmb3JtID0gJCh0aGlzKS5wYXJlbnQoKSxcclxuXHRcdFx0XHR1cmwgPSAnL3JlZy8nLFxyXG5cdFx0XHRcdGRhdGEgPSBcclxuXHRcdFx0XHR7XHJcblx0ICAgIFx0XHRsb2dpbjogZm9ybS5maW5kKCdpbnB1dFtuYW1lID0gXCJsb2dpblwiXScpLnZhbCgpLFxyXG5cdCAgICBcdFx0ZW1haWw6IGZvcm0uZmluZCgnaW5wdXRbbmFtZSA9IFwiZW1haWxcIl0nKS52YWwoKSxcclxuXHQgICAgXHRcdHBhc3M6IGZvcm0uZmluZCgnaW5wdXRbbmFtZSA9IFwicGFzc1wiXScpLnZhbCgpLFxyXG5cdCAgIFx0XHR9LFxyXG5cdFx0XHRcdHNlcnZBbnMgPSBfYWpheEZvcm0oZm9ybSwgdXJsLCBkYXRhKTtcclxuXHRcdFx0XHRpZihzZXJ2QW5zKXtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCfQstGL0LLQvtC00LjQvCDQvtGC0LLQtdGCINC+0YIg0YHQtdGA0LLQtdGA0LAnKTtcclxuXHRcdFx0XHRcdHNlcnZBbnMuZG9uZShmdW5jdGlvbihhbnMpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYW5zKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHRcclxuXHR9XHJcblx0dmFyIF9hamF4Rm9ybSA9IGZ1bmN0aW9uIChmb3JtLCB1cmwsIGRhdGEpe1xyXG5cdFx0Ly/QtdGB0LvQuCDQstCw0LvQuNC00LDRhtC40Y8g0L/RgNC+0YjQu9CwINGD0YHQv9C10YjQvdC+LCDQvtGC0L/RgNCw0LLQu9GP0LXQvCDQt9Cw0L/RgNC+0YEg0L3QsCDRgdC10YDQstC10YBcclxuXHRcdGlmICghdmFsaWRhdGlvbi52YWxpZGF0ZUZvcm0oZm9ybSkpIHJldHVybiBmYWxzZTtcclxuXHRcdGNvbnNvbGUubG9nKCfQstGB0ZEg0YXQvtGA0L7RiNC+Jyk7XHJcblx0XHQvLyDQs9C+0YLQvtCy0LjQvCDQtNCw0L3QvdGL0LUgXHJcblx0ICBkYXRhPUpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG5cdCAgY29uc29sZS5sb2coZGF0YSk7XHJcblx0ICAvLyDQvtGC0L/RgNCw0LLQu9GP0LXQvFxyXG5cdFx0cmV0dXJuICQuYWpheCh7XHJcblx0XHRcdHVybDogJy9yZWcvJyxcclxuXHRcdFx0dHlwZTogJ1BPU1QnLFxyXG5cdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG5cdFx0XHRkYXRhOiBkYXRhXHJcblx0XHR9KTtcclxuXHRcdC8vdmFsaWRhdGlvbi5jbGVhckZvcm0oZm9ybSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cclxuXHRcdGluaXQ6IGluaXRcclxuXHR9O1xyXG59KSgpO1xyXG5yZWdpc3RyYXRpb24uaW5pdCgpO1xyXG5cclxuLy/Qm9C+0LPQuNC9XHJcbnZhciBsb2dpbiA9IChmdW5jdGlvbigpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRfc2V0VXBMaXN0bmVycygpO1xyXG5cdH07XHJcblxyXG5cdHZhciBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JCgnI2xvZ2luJykub24oJ2NsaWNrJywgX3N1Ym1pdEZvcm0pO1xyXG5cdH07XHJcblxyXG5cdHZhciBfc3VibWl0Rm9ybSA9IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgZm9ybSA9ICQodGhpcykucGFyZW50KCksXHJcblx0XHRcdFx0dXJsID0gJyAnLFxyXG5cdFx0XHRcdGRhdGEgPSBcclxuXHRcdFx0XHR7XHJcblx0ICAgIFx0XHRlbWFpbDogJCgnaW5wdXRbbmFtZSA9IFwiZW1haWxcIl0nKS52YWwoKSxcclxuXHQgICAgXHRcdHBhc3M6ICQoJ2lucHV0W25hbWUgPSBcInBhc3NcIl0nKS52YWwoKSxcclxuXHQgICBcdFx0fSxcclxuXHRcdFx0XHRzZXJ2QW5zID0gX2FqYXhGb3JtKGZvcm0sIHVybCwgZGF0YSk7XHJcblx0XHRcdFx0aWYoc2VydkFucyl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygn0LLRi9Cy0L7QtNC40Lwg0L7RgtCy0LXRgiDQvtGCINGB0LXRgNCy0LXRgNCwJyk7XHJcblx0XHRcdFx0XHRzZXJ2QW5zLmRvbmUoZnVuY3Rpb24oYW5zKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhhbnMpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cdFxyXG5cdH1cclxuXHR2YXIgX2FqYXhGb3JtID0gZnVuY3Rpb24gKGZvcm0sIHVybCwgZGF0YSl7XHJcblx0XHQvL9C10YHQu9C4INCy0LDQu9C40LTQsNGG0LjRjyDQv9GA0L7RiNC70LAg0YPRgdC/0LXRiNC90L4sINC+0YLQv9GA0LDQstC70Y/QtdC8INC30LDQv9GA0L7RgSDQvdCwINGB0LXRgNCy0LXRgFxyXG5cdFx0aWYgKCF2YWxpZGF0aW9uLnZhbGlkYXRlRm9ybShmb3JtKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0Y29uc29sZS5sb2coJ9Cy0YHRkSDRhdC+0YDQvtGI0L4nKTtcclxuXHRcdC8vINCz0L7RgtC+0LLQuNC8INC00LDQvdC90YvQtSBcclxuXHQgIGRhdGE9SlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcblx0ICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHQgIC8vINC+0YLQv9GA0LDQstC70Y/QtdC8XHJcblx0XHRcclxuXHRcdC8vdmFsaWRhdGlvbi5jbGVhckZvcm0oZm9ybSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cclxuXHRcdGluaXQ6IGluaXRcclxuXHR9O1xyXG59KSgpO1xyXG5sb2dpbi5pbml0KCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

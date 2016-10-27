(function(){

			 // устанавливаем высоту для flipp
			$('.flipper').height($('.front').height());

			// центрируем popup
			var trY = ($('.welcome').height()+$('.flipper-container').height())/2;
			$('.flipper-container').css('transform','translate(-50%, -' +trY+'px)');

			// анимация popup
			// при нажатии на "зарегистрироваться"
		 $('.popup__link_registr').click(function(e){
			e.preventDefault();
			$('.back-pass').addClass('hide');
			$('.back-reg').removeClass('hide');
		 	$('.flipper-container').addClass('flipp');
	 });
		 // при нажатии на "войти"
		 $('.popup__link_enter').click(function(e){
		 	e.preventDefault();
	 		$('.flipper-container').removeClass('flipp');
	 });
		 // при нажатии на "забыли пароль"
		 $('.popup__link_forget-pass').click(function(e){
			 e.preventDefault();
			 $('.back-pass').removeClass('hide');
			 $('.back-reg').addClass('hide');
		 	$('.flipper-container').addClass('flipp');
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
			 //pass = form.find('[type=password]'),
			valid = true;

	$.each(elements, function(index, val){
		var
				element = $(val),
				val = element.val();
		if((val.length === 0)) {
			console.log('есть пустые поля');
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


//Отпавка данных из формы
var submitForm = (function() {
	'use strict';

	var init = function() {
		_setUpListners();
	};
// Слушаем события
	var _setUpListners = function() {
		// Регистрация пользователя
		$('#registration').on('click', _submitFormRegistr);
		// Вход
		$('#login').on('click', _submitFormLogin);
		// Восстановление пароля
		$('#recover').on('click', _submitFormRecover);
	};

	var _submitFormRegistr = function(ev){
		console.log('reg');
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
	var _submitFormLogin = function(ev){
		console.log('login');
		ev.preventDefault();
		var form = $(this).parent(),
				url = '',
				data = 
				{
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
	var _submitFormRecover = function(ev){
		console.log('recover');
		ev.preventDefault();
		var form = $(this).parent(),
				url = ' ',
				data = 
				{
	    		email: form.find('input[name = "email"]').val(),
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
		if (!validation.validateForm(form)){
			form.find('.popup__error').slideDown(300);
			return false;
		} 
		console.log('всё хорошо');
		// готовим данные 
	  data=JSON.stringify(data);
	  console.log(data);
	  // отправляем
		return $.ajax({
			url: url,
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
submitForm.init();


//Логин
var recover = (function() {
	'use strict';

	var init = function() {
		_setUpListners();
	};

	var _setUpListners = function() {
		$('#recover').on('click', _submitForm);
	};

	var _submitForm = function(ev){
		ev.preventDefault();
		var form = $(this).parent(),
				url = ' ',
				data = 
				{
	    		email: form.find('input[name = "email"]').val(),
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
		if (!validation.validateForm(form)){
			$('.popup__error').slideDown(300);
			return false;
		} 
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
recover.init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdCAvLyDRg9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDQstGL0YHQvtGC0YMg0LTQu9GPIGZsaXBwXHJcblx0XHRcdCQoJy5mbGlwcGVyJykuaGVpZ2h0KCQoJy5mcm9udCcpLmhlaWdodCgpKTtcclxuXHJcblx0XHRcdC8vINGG0LXQvdGC0YDQuNGA0YPQtdC8IHBvcHVwXHJcblx0XHRcdHZhciB0clkgPSAoJCgnLndlbGNvbWUnKS5oZWlnaHQoKSskKCcuZmxpcHBlci1jb250YWluZXInKS5oZWlnaHQoKSkvMjtcclxuXHRcdFx0JCgnLmZsaXBwZXItY29udGFpbmVyJykuY3NzKCd0cmFuc2Zvcm0nLCd0cmFuc2xhdGUoLTUwJSwgLScgK3RyWSsncHgpJyk7XHJcblxyXG5cdFx0XHQvLyDQsNC90LjQvNCw0YbQuNGPIHBvcHVwXHJcblx0XHRcdC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwIFwi0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPXCJcclxuXHRcdCAkKCcucG9wdXBfX2xpbmtfcmVnaXN0cicpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdCQoJy5iYWNrLXBhc3MnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcuYmFjay1yZWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0IFx0JCgnLmZsaXBwZXItY29udGFpbmVyJykuYWRkQ2xhc3MoJ2ZsaXBwJyk7XHJcblx0IH0pO1xyXG5cdFx0IC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwIFwi0LLQvtC50YLQuFwiXHJcblx0XHQgJCgnLnBvcHVwX19saW5rX2VudGVyJykuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHQgXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0IFx0XHQkKCcuZmxpcHBlci1jb250YWluZXInKS5yZW1vdmVDbGFzcygnZmxpcHAnKTtcclxuXHQgfSk7XHJcblx0XHQgLy8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAgXCLQt9Cw0LHRi9C70Lgg0L/QsNGA0L7Qu9GMXCJcclxuXHRcdCAkKCcucG9wdXBfX2xpbmtfZm9yZ2V0LXBhc3MnKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdFx0IGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0ICQoJy5iYWNrLXBhc3MnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQgJCgnLmJhY2stcmVnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCBcdCQoJy5mbGlwcGVyLWNvbnRhaW5lcicpLmFkZENsYXNzKCdmbGlwcCcpO1xyXG5cdCB9KTtcclxufSkoKTtcclxuXHJcblxyXG4vLyDQvNC+0LTRg9C70Ywg0LLQsNC70LjQtNCw0YbQuNC4XHJcbnZhciB2YWxpZGF0aW9uID0gKGZ1bmN0aW9uKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0fTtcclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdC8vJCgnaW5wdXQnKS5vbigna2V5ZG93bicsZnVuY3Rpb24oKXtcclxuXHRcdC8vfSlcclxuXHR9O1xyXG5cclxuLy8g0YTRg9C90LrRhtC40Y8g0LLQsNC70LjQtNCw0YbQuNC4INGE0L7RgNC80YtcclxudmFyIHZhbGlkYXRlRm9ybSA9IGZ1bmN0aW9uKGZvcm0pIHtcclxuXHR2YXIgXHJcblx0XHRcdGVsZW1lbnRzID0gZm9ybS5maW5kKCdpbnB1dCcpLFxyXG5cdFx0XHQgLy9wYXNzID0gZm9ybS5maW5kKCdbdHlwZT1wYXNzd29yZF0nKSxcclxuXHRcdFx0dmFsaWQgPSB0cnVlO1xyXG5cclxuXHQkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGluZGV4LCB2YWwpe1xyXG5cdFx0dmFyXHJcblx0XHRcdFx0ZWxlbWVudCA9ICQodmFsKSxcclxuXHRcdFx0XHR2YWwgPSBlbGVtZW50LnZhbCgpO1xyXG5cdFx0aWYoKHZhbC5sZW5ndGggPT09IDApKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCfQtdGB0YLRjCDQv9GD0YHRgtGL0LUg0L/QvtC70Y8nKTtcclxuXHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9KVxyXG5cdHJldHVybiB2YWxpZDtcclxufTtcclxuXHJcbnZhciBjbGVhckZvcm0gPSBmdW5jdGlvbihmb3JtKSB7XHJcblx0XHJcblx0dmFyIFxyXG5cdFx0XHRlbGVtZW50cyA9IGZvcm0uZmluZCgnaW5wdXQnKTtcclxuXHJcblx0JC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpbmRleCwgdmFsKXtcclxuXHRcdHZhclxyXG5cdFx0XHRcdGVsZW1lbnQgPSAkKHZhbCksXHJcblx0XHRcdFx0dmFsID0gZWxlbWVudC52YWwoKTtcclxuXHRcdGVsZW1lbnQudmFsKCcnKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXQsXHJcblx0XHR2YWxpZGF0ZUZvcm06IHZhbGlkYXRlRm9ybSxcclxuXHRcdGNsZWFyRm9ybTogY2xlYXJGb3JtXHJcblx0fTtcclxufSkoKTtcclxudmFsaWRhdGlvbi5pbml0KCk7XHJcblxyXG5cclxuLy/QntGC0L/QsNCy0LrQsCDQtNCw0L3QvdGL0YUg0LjQtyDRhNC+0YDQvNGLXHJcbnZhciBzdWJtaXRGb3JtID0gKGZ1bmN0aW9uKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0fTtcclxuLy8g0KHQu9GD0YjQsNC10Lwg0YHQvtCx0YvRgtC40Y9cclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdC8vINCg0LXQs9C40YHRgtGA0LDRhtC40Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXHJcblx0XHQkKCcjcmVnaXN0cmF0aW9uJykub24oJ2NsaWNrJywgX3N1Ym1pdEZvcm1SZWdpc3RyKTtcclxuXHRcdC8vINCS0YXQvtC0XHJcblx0XHQkKCcjbG9naW4nKS5vbignY2xpY2snLCBfc3VibWl0Rm9ybUxvZ2luKTtcclxuXHRcdC8vINCS0L7RgdGB0YLQsNC90L7QstC70LXQvdC40LUg0L/QsNGA0L7Qu9GPXHJcblx0XHQkKCcjcmVjb3ZlcicpLm9uKCdjbGljaycsIF9zdWJtaXRGb3JtUmVjb3Zlcik7XHJcblx0fTtcclxuXHJcblx0dmFyIF9zdWJtaXRGb3JtUmVnaXN0ciA9IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGNvbnNvbGUubG9nKCdyZWcnKTtcclxuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgZm9ybSA9ICQodGhpcykucGFyZW50KCksXHJcblx0XHRcdFx0dXJsID0gJy9yZWcvJyxcclxuXHRcdFx0XHRkYXRhID0gXHJcblx0XHRcdFx0e1xyXG5cdCAgICBcdFx0bG9naW46IGZvcm0uZmluZCgnaW5wdXRbbmFtZSA9IFwibG9naW5cIl0nKS52YWwoKSxcclxuXHQgICAgXHRcdGVtYWlsOiBmb3JtLmZpbmQoJ2lucHV0W25hbWUgPSBcImVtYWlsXCJdJykudmFsKCksXHJcblx0ICAgIFx0XHRwYXNzOiBmb3JtLmZpbmQoJ2lucHV0W25hbWUgPSBcInBhc3NcIl0nKS52YWwoKSxcclxuXHQgICBcdFx0fSxcclxuXHRcdFx0XHRzZXJ2QW5zID0gX2FqYXhGb3JtKGZvcm0sIHVybCwgZGF0YSk7XHJcblx0XHRcdFx0aWYoc2VydkFucyl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygn0LLRi9Cy0L7QtNC40Lwg0L7RgtCy0LXRgiDQvtGCINGB0LXRgNCy0LXRgNCwJyk7XHJcblx0XHRcdFx0XHRzZXJ2QW5zLmRvbmUoZnVuY3Rpb24oYW5zKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGFucyk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVx0XHJcblx0fVxyXG5cdHZhciBfc3VibWl0Rm9ybUxvZ2luID0gZnVuY3Rpb24oZXYpe1xyXG5cdFx0Y29uc29sZS5sb2coJ2xvZ2luJyk7XHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyIGZvcm0gPSAkKHRoaXMpLnBhcmVudCgpLFxyXG5cdFx0XHRcdHVybCA9ICcnLFxyXG5cdFx0XHRcdGRhdGEgPSBcclxuXHRcdFx0XHR7XHJcblx0ICAgIFx0XHRlbWFpbDogZm9ybS5maW5kKCdpbnB1dFtuYW1lID0gXCJlbWFpbFwiXScpLnZhbCgpLFxyXG5cdCAgICBcdFx0cGFzczogZm9ybS5maW5kKCdpbnB1dFtuYW1lID0gXCJwYXNzXCJdJykudmFsKCksXHJcblx0ICAgXHRcdH0sXHJcblx0XHRcdFx0c2VydkFucyA9IF9hamF4Rm9ybShmb3JtLCB1cmwsIGRhdGEpO1xyXG5cdFx0XHRcdGlmKHNlcnZBbnMpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ9Cy0YvQstC+0LTQuNC8INC+0YLQstC10YIg0L7RgiDRgdC10YDQstC10YDQsCcpO1xyXG5cdFx0XHRcdFx0c2VydkFucy5kb25lKGZ1bmN0aW9uKGFucykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYW5zKTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHRcclxuXHR9XHJcblx0dmFyIF9zdWJtaXRGb3JtUmVjb3ZlciA9IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGNvbnNvbGUubG9nKCdyZWNvdmVyJyk7XHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyIGZvcm0gPSAkKHRoaXMpLnBhcmVudCgpLFxyXG5cdFx0XHRcdHVybCA9ICcgJyxcclxuXHRcdFx0XHRkYXRhID0gXHJcblx0XHRcdFx0e1xyXG5cdCAgICBcdFx0ZW1haWw6IGZvcm0uZmluZCgnaW5wdXRbbmFtZSA9IFwiZW1haWxcIl0nKS52YWwoKSxcclxuXHQgICBcdFx0fSxcclxuXHRcdFx0XHRzZXJ2QW5zID0gX2FqYXhGb3JtKGZvcm0sIHVybCwgZGF0YSk7XHJcblx0XHRcdFx0aWYoc2VydkFucyl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygn0LLRi9Cy0L7QtNC40Lwg0L7RgtCy0LXRgiDQvtGCINGB0LXRgNCy0LXRgNCwJyk7XHJcblx0XHRcdFx0XHRzZXJ2QW5zLmRvbmUoZnVuY3Rpb24oYW5zKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhhbnMpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cdFxyXG5cdH1cclxuXHR2YXIgX2FqYXhGb3JtID0gZnVuY3Rpb24gKGZvcm0sIHVybCwgZGF0YSl7XHJcblx0XHQvL9C10YHQu9C4INCy0LDQu9C40LTQsNGG0LjRjyDQv9GA0L7RiNC70LAg0YPRgdC/0LXRiNC90L4sINC+0YLQv9GA0LDQstC70Y/QtdC8INC30LDQv9GA0L7RgSDQvdCwINGB0LXRgNCy0LXRgFxyXG5cdFx0aWYgKCF2YWxpZGF0aW9uLnZhbGlkYXRlRm9ybShmb3JtKSl7XHJcblx0XHRcdGZvcm0uZmluZCgnLnBvcHVwX19lcnJvcicpLnNsaWRlRG93bigzMDApO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9IFxyXG5cdFx0Y29uc29sZS5sb2coJ9Cy0YHRkSDRhdC+0YDQvtGI0L4nKTtcclxuXHRcdC8vINCz0L7RgtC+0LLQuNC8INC00LDQvdC90YvQtSBcclxuXHQgIGRhdGE9SlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcblx0ICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHQgIC8vINC+0YLQv9GA0LDQstC70Y/QtdC8XHJcblx0XHRyZXR1cm4gJC5hamF4KHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdHR5cGU6ICdQT1NUJyxcclxuXHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0ZGF0YTogZGF0YVxyXG5cdFx0fSk7XHJcblx0XHQvL3ZhbGlkYXRpb24uY2xlYXJGb3JtKGZvcm0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHJcblx0XHRpbml0OiBpbml0XHJcblx0fTtcclxufSkoKTtcclxuc3VibWl0Rm9ybS5pbml0KCk7XHJcblxyXG5cclxuLy/Qm9C+0LPQuNC9XHJcbnZhciByZWNvdmVyID0gKGZ1bmN0aW9uKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0fTtcclxuXHJcblx0dmFyIF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24oKSB7XHJcblx0XHQkKCcjcmVjb3ZlcicpLm9uKCdjbGljaycsIF9zdWJtaXRGb3JtKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3N1Ym1pdEZvcm0gPSBmdW5jdGlvbihldil7XHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyIGZvcm0gPSAkKHRoaXMpLnBhcmVudCgpLFxyXG5cdFx0XHRcdHVybCA9ICcgJyxcclxuXHRcdFx0XHRkYXRhID0gXHJcblx0XHRcdFx0e1xyXG5cdCAgICBcdFx0ZW1haWw6IGZvcm0uZmluZCgnaW5wdXRbbmFtZSA9IFwiZW1haWxcIl0nKS52YWwoKSxcclxuXHQgICBcdFx0fSxcclxuXHRcdFx0XHRzZXJ2QW5zID0gX2FqYXhGb3JtKGZvcm0sIHVybCwgZGF0YSk7XHJcblx0XHRcdFx0aWYoc2VydkFucyl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygn0LLRi9Cy0L7QtNC40Lwg0L7RgtCy0LXRgiDQvtGCINGB0LXRgNCy0LXRgNCwJyk7XHJcblx0XHRcdFx0XHRzZXJ2QW5zLmRvbmUoZnVuY3Rpb24oYW5zKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhhbnMpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cdFxyXG5cdH1cclxuXHR2YXIgX2FqYXhGb3JtID0gZnVuY3Rpb24gKGZvcm0sIHVybCwgZGF0YSl7XHJcblx0XHQvL9C10YHQu9C4INCy0LDQu9C40LTQsNGG0LjRjyDQv9GA0L7RiNC70LAg0YPRgdC/0LXRiNC90L4sINC+0YLQv9GA0LDQstC70Y/QtdC8INC30LDQv9GA0L7RgSDQvdCwINGB0LXRgNCy0LXRgFxyXG5cdFx0aWYgKCF2YWxpZGF0aW9uLnZhbGlkYXRlRm9ybShmb3JtKSl7XHJcblx0XHRcdCQoJy5wb3B1cF9fZXJyb3InKS5zbGlkZURvd24oMzAwKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSBcclxuXHRcdGNvbnNvbGUubG9nKCfQstGB0ZEg0YXQvtGA0L7RiNC+Jyk7XHJcblx0XHQvLyDQs9C+0YLQvtCy0LjQvCDQtNCw0L3QvdGL0LUgXHJcblx0ICBkYXRhPUpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG5cdCAgY29uc29sZS5sb2coZGF0YSk7XHJcblx0ICAvLyDQvtGC0L/RgNCw0LLQu9GP0LXQvFxyXG5cdFx0XHJcblx0XHQvL3ZhbGlkYXRpb24uY2xlYXJGb3JtKGZvcm0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHJcblx0XHRpbml0OiBpbml0XHJcblx0fTtcclxufSkoKTtcclxucmVjb3Zlci5pbml0KCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

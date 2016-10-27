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
		if (!validation.validateForm(form)){
			return false;
		} 
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
login.init();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdCAvLyDRg9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDQstGL0YHQvtGC0YMg0LTQu9GPIGZsaXBwXHJcblx0XHRcdCQoJy5mbGlwcGVyJykuaGVpZ2h0KCQoJy5mcm9udCcpLmhlaWdodCgpKTtcclxuXHJcblx0XHRcdC8vINGG0LXQvdGC0YDQuNGA0YPQtdC8IHBvcHVwXHJcblx0XHRcdHZhciB0clkgPSAoJCgnLndlbGNvbWUnKS5oZWlnaHQoKSskKCcuZmxpcHBlci1jb250YWluZXInKS5oZWlnaHQoKSkvMjtcclxuXHRcdFx0JCgnLmZsaXBwZXItY29udGFpbmVyJykuY3NzKCd0cmFuc2Zvcm0nLCd0cmFuc2xhdGUoLTUwJSwgLScgK3RyWSsncHgpJyk7XHJcblxyXG5cdFx0XHQvLyDQsNC90LjQvNCw0YbQuNGPIHBvcHVwXHJcblx0XHRcdC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwIFwi0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPXCJcclxuXHRcdCAkKCcucG9wdXBfX2xpbmtfcmVnaXN0cicpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdCQoJy5iYWNrLXBhc3MnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQkKCcuYmFjay1yZWcnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0IFx0JCgnLmZsaXBwZXItY29udGFpbmVyJykuYWRkQ2xhc3MoJ2ZsaXBwJyk7XHJcblx0IH0pO1xyXG5cdFx0IC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwIFwi0LLQvtC50YLQuFwiXHJcblx0XHQgJCgnLnBvcHVwX19saW5rX2VudGVyJykuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHQgXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0IFx0XHQkKCcuZmxpcHBlci1jb250YWluZXInKS5yZW1vdmVDbGFzcygnZmxpcHAnKTtcclxuXHQgfSk7XHJcblx0XHQgLy8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAgXCLQt9Cw0LHRi9C70Lgg0L/QsNGA0L7Qu9GMXCJcclxuXHRcdCAkKCcucG9wdXBfX2xpbmtfZm9yZ2V0LXBhc3MnKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdFx0IGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0ICQoJy5iYWNrLXBhc3MnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHQgJCgnLmJhY2stcmVnJykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdCBcdCQoJy5mbGlwcGVyLWNvbnRhaW5lcicpLmFkZENsYXNzKCdmbGlwcCcpO1xyXG5cdCB9KTtcclxufSkoKTtcclxuXHJcblxyXG4vLyDQvNC+0LTRg9C70Ywg0LLQsNC70LjQtNCw0YbQuNC4XHJcbnZhciB2YWxpZGF0aW9uID0gKGZ1bmN0aW9uKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcclxuXHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0fTtcclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdC8vJCgnaW5wdXQnKS5vbigna2V5ZG93bicsZnVuY3Rpb24oKXtcclxuXHRcdC8vfSlcclxuXHR9O1xyXG5cclxuLy8g0YTRg9C90LrRhtC40Y8g0LLQsNC70LjQtNCw0YbQuNC4INGE0L7RgNC80YtcclxudmFyIHZhbGlkYXRlRm9ybSA9IGZ1bmN0aW9uKGZvcm0pIHtcclxuXHR2YXIgXHJcblx0XHRcdGVsZW1lbnRzID0gZm9ybS5maW5kKCdpbnB1dCcpLFxyXG5cdFx0XHQgLy9wYXNzID0gZm9ybS5maW5kKCdbdHlwZT1wYXNzd29yZF0nKSxcclxuXHRcdFx0dmFsaWQgPSB0cnVlO1xyXG5cclxuXHRcclxuXHQkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGluZGV4LCB2YWwpe1xyXG5cdFx0dmFyXHJcblx0XHRcdFx0ZWxlbWVudCA9ICQodmFsKSxcclxuXHRcdFx0XHR2YWwgPSBlbGVtZW50LnZhbCgpO1xyXG5cdFx0aWYoKHZhbC5sZW5ndGggPT09IDApKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCfQtdGB0YLRjCDQv9GD0YHRgtGL0LUg0L/QvtC70Y8nKTtcclxuXHRcdFx0dmFsaWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9KVxyXG5cdHJldHVybiB2YWxpZDtcclxufTtcclxuXHJcbnZhciBjbGVhckZvcm0gPSBmdW5jdGlvbihmb3JtKSB7XHJcblx0XHJcblx0dmFyIFxyXG5cdFx0XHRlbGVtZW50cyA9IGZvcm0uZmluZCgnaW5wdXQnKTtcclxuXHJcblx0JC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpbmRleCwgdmFsKXtcclxuXHRcdHZhclxyXG5cdFx0XHRcdGVsZW1lbnQgPSAkKHZhbCksXHJcblx0XHRcdFx0dmFsID0gZWxlbWVudC52YWwoKTtcclxuXHRcdGVsZW1lbnQudmFsKCcnKTtcclxuXHRcdH0pO1xyXG5cdH07XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXQsXHJcblx0XHR2YWxpZGF0ZUZvcm06IHZhbGlkYXRlRm9ybSxcclxuXHRcdGNsZWFyRm9ybTogY2xlYXJGb3JtXHJcblx0fTtcclxufSkoKTtcclxudmFsaWRhdGlvbi5pbml0KCk7XHJcblxyXG5cclxuLy/QoNC10LPQuNGB0YLRgNCw0YbQuNGPINC90L7QstC+0LPQviDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y9cclxudmFyIHJlZ2lzdHJhdGlvbiA9IChmdW5jdGlvbigpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRfc2V0VXBMaXN0bmVycygpO1xyXG5cdH07XHJcblxyXG5cdHZhciBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0JCgnI3JlZ2lzdHJhdGlvbicpLm9uKCdjbGljaycsIF9zdWJtaXRGb3JtKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3N1Ym1pdEZvcm0gPSBmdW5jdGlvbihldil7XHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyIGZvcm0gPSAkKHRoaXMpLnBhcmVudCgpLFxyXG5cdFx0XHRcdHVybCA9ICcvcmVnLycsXHJcblx0XHRcdFx0ZGF0YSA9IFxyXG5cdFx0XHRcdHtcclxuXHQgICAgXHRcdGxvZ2luOiBmb3JtLmZpbmQoJ2lucHV0W25hbWUgPSBcImxvZ2luXCJdJykudmFsKCksXHJcblx0ICAgIFx0XHRlbWFpbDogZm9ybS5maW5kKCdpbnB1dFtuYW1lID0gXCJlbWFpbFwiXScpLnZhbCgpLFxyXG5cdCAgICBcdFx0cGFzczogZm9ybS5maW5kKCdpbnB1dFtuYW1lID0gXCJwYXNzXCJdJykudmFsKCksXHJcblx0ICAgXHRcdH0sXHJcblx0XHRcdFx0c2VydkFucyA9IF9hamF4Rm9ybShmb3JtLCB1cmwsIGRhdGEpO1xyXG5cdFx0XHRcdGlmKHNlcnZBbnMpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ9Cy0YvQstC+0LTQuNC8INC+0YLQstC10YIg0L7RgiDRgdC10YDQstC10YDQsCcpO1xyXG5cdFx0XHRcdFx0c2VydkFucy5kb25lKGZ1bmN0aW9uKGFucykge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhhbnMpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cdFxyXG5cdH1cclxuXHR2YXIgX2FqYXhGb3JtID0gZnVuY3Rpb24gKGZvcm0sIHVybCwgZGF0YSl7XHJcblx0XHQvL9C10YHQu9C4INCy0LDQu9C40LTQsNGG0LjRjyDQv9GA0L7RiNC70LAg0YPRgdC/0LXRiNC90L4sINC+0YLQv9GA0LDQstC70Y/QtdC8INC30LDQv9GA0L7RgSDQvdCwINGB0LXRgNCy0LXRgFxyXG5cdFx0aWYgKCF2YWxpZGF0aW9uLnZhbGlkYXRlRm9ybShmb3JtKSl7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0gXHJcblx0XHRjb25zb2xlLmxvZygn0LLRgdGRINGF0L7RgNC+0YjQvicpO1xyXG5cdFx0Ly8g0LPQvtGC0L7QstC40Lwg0LTQsNC90L3Ri9C1IFxyXG5cdCAgZGF0YT1KU09OLnN0cmluZ2lmeShkYXRhKTtcclxuXHQgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdCAgLy8g0L7RgtC/0YDQsNCy0LvRj9C10LxcclxuXHRcdHJldHVybiAkLmFqYXgoe1xyXG5cdFx0XHR1cmw6ICcvcmVnLycsXHJcblx0XHRcdHR5cGU6ICdQT1NUJyxcclxuXHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0ZGF0YTogZGF0YVxyXG5cdFx0fSk7XHJcblx0XHQvL3ZhbGlkYXRpb24uY2xlYXJGb3JtKGZvcm0pO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHJcblx0XHRpbml0OiBpbml0XHJcblx0fTtcclxufSkoKTtcclxucmVnaXN0cmF0aW9uLmluaXQoKTtcclxuXHJcbi8v0JvQvtCz0LjQvVxyXG52YXIgbG9naW4gPSAoZnVuY3Rpb24oKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0X3NldFVwTGlzdG5lcnMoKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdCQoJyNsb2dpbicpLm9uKCdjbGljaycsIF9zdWJtaXRGb3JtKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3N1Ym1pdEZvcm0gPSBmdW5jdGlvbihldil7XHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyIGZvcm0gPSAkKHRoaXMpLnBhcmVudCgpLFxyXG5cdFx0XHRcdHVybCA9ICcgJyxcclxuXHRcdFx0XHRkYXRhID0gXHJcblx0XHRcdFx0e1xyXG5cdCAgICBcdFx0ZW1haWw6IGZvcm0uZmluZCgnaW5wdXRbbmFtZSA9IFwiZW1haWxcIl0nKS52YWwoKSxcclxuXHQgICAgXHRcdHBhc3M6IGZvcm0uZmluZCgnaW5wdXRbbmFtZSA9IFwicGFzc1wiXScpLnZhbCgpLFxyXG5cdCAgIFx0XHR9LFxyXG5cdFx0XHRcdHNlcnZBbnMgPSBfYWpheEZvcm0oZm9ybSwgdXJsLCBkYXRhKTtcclxuXHRcdFx0XHRpZihzZXJ2QW5zKXtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCfQstGL0LLQvtC00LjQvCDQvtGC0LLQtdGCINC+0YIg0YHQtdGA0LLQtdGA0LAnKTtcclxuXHRcdFx0XHRcdHNlcnZBbnMuZG9uZShmdW5jdGlvbihhbnMpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGFucyk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVx0XHJcblx0fVxyXG5cdHZhciBfYWpheEZvcm0gPSBmdW5jdGlvbiAoZm9ybSwgdXJsLCBkYXRhKXtcclxuXHRcdC8v0LXRgdC70Lgg0LLQsNC70LjQtNCw0YbQuNGPINC/0YDQvtGI0LvQsCDRg9GB0L/QtdGI0L3Qviwg0L7RgtC/0YDQsNCy0LvRj9C10Lwg0LfQsNC/0YDQvtGBINC90LAg0YHQtdGA0LLQtdGAXHJcblx0XHRpZiAoIXZhbGlkYXRpb24udmFsaWRhdGVGb3JtKGZvcm0pKXtcclxuXHRcdFx0JCgnLnBvcHVwX19lcnJvcicpLnNsaWRlRG93bigzMDApO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9IFxyXG5cdFx0Y29uc29sZS5sb2coJ9Cy0YHRkSDRhdC+0YDQvtGI0L4nKTtcclxuXHRcdC8vINCz0L7RgtC+0LLQuNC8INC00LDQvdC90YvQtSBcclxuXHQgIGRhdGE9SlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcblx0ICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHQgIC8vINC+0YLQv9GA0LDQstC70Y/QtdC8XHJcblx0XHRcclxuXHRcdC8vdmFsaWRhdGlvbi5jbGVhckZvcm0oZm9ybSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cclxuXHRcdGluaXQ6IGluaXRcclxuXHR9O1xyXG59KSgpO1xyXG5sb2dpbi5pbml0KCk7XHJcblxyXG4vL9Cb0L7Qs9C40L1cclxudmFyIHJlY292ZXIgPSAoZnVuY3Rpb24oKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0X3NldFVwTGlzdG5lcnMoKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdCQoJyNyZWNvdmVyJykub24oJ2NsaWNrJywgX3N1Ym1pdEZvcm0pO1xyXG5cdH07XHJcblxyXG5cdHZhciBfc3VibWl0Rm9ybSA9IGZ1bmN0aW9uKGV2KXtcclxuXHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgZm9ybSA9ICQodGhpcykucGFyZW50KCksXHJcblx0XHRcdFx0dXJsID0gJyAnLFxyXG5cdFx0XHRcdGRhdGEgPSBcclxuXHRcdFx0XHR7XHJcblx0ICAgIFx0XHRlbWFpbDogZm9ybS5maW5kKCdpbnB1dFtuYW1lID0gXCJlbWFpbFwiXScpLnZhbCgpLFxyXG5cdCAgIFx0XHR9LFxyXG5cdFx0XHRcdHNlcnZBbnMgPSBfYWpheEZvcm0oZm9ybSwgdXJsLCBkYXRhKTtcclxuXHRcdFx0XHRpZihzZXJ2QW5zKXtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCfQstGL0LLQvtC00LjQvCDQvtGC0LLQtdGCINC+0YIg0YHQtdGA0LLQtdGA0LAnKTtcclxuXHRcdFx0XHRcdHNlcnZBbnMuZG9uZShmdW5jdGlvbihhbnMpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGFucyk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVx0XHJcblx0fVxyXG5cdHZhciBfYWpheEZvcm0gPSBmdW5jdGlvbiAoZm9ybSwgdXJsLCBkYXRhKXtcclxuXHRcdC8v0LXRgdC70Lgg0LLQsNC70LjQtNCw0YbQuNGPINC/0YDQvtGI0LvQsCDRg9GB0L/QtdGI0L3Qviwg0L7RgtC/0YDQsNCy0LvRj9C10Lwg0LfQsNC/0YDQvtGBINC90LAg0YHQtdGA0LLQtdGAXHJcblx0XHRpZiAoIXZhbGlkYXRpb24udmFsaWRhdGVGb3JtKGZvcm0pKXtcclxuXHRcdFx0JCgnLnBvcHVwX19lcnJvcicpLnNsaWRlRG93bigzMDApO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9IFxyXG5cdFx0Y29uc29sZS5sb2coJ9Cy0YHRkSDRhdC+0YDQvtGI0L4nKTtcclxuXHRcdC8vINCz0L7RgtC+0LLQuNC8INC00LDQvdC90YvQtSBcclxuXHQgIGRhdGE9SlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcblx0ICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHQgIC8vINC+0YLQv9GA0LDQstC70Y/QtdC8XHJcblx0XHRcclxuXHRcdC8vdmFsaWRhdGlvbi5jbGVhckZvcm0oZm9ybSk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cclxuXHRcdGluaXQ6IGluaXRcclxuXHR9O1xyXG59KSgpO1xyXG5yZWNvdmVyLmluaXQoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

(function(){
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
	var _regMail = /^([0-9a-zA-Z_-]+\.)*[0-9a-zA-Z_-]+@[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)*\.[a-z]{2,6}$/;
	var init = function() {
		_setUpListners();
	};
	var _setUpListners = function() {
		$('input').on('keydown',function(){
			$('.popup__error').addClass('hide');
		})
	};

// функция валидации формы
var validateForm = function(form) {
	// находим нужные input
	var elements = form.find('input[type="email"], input[type="password"], input[type="text"]'),
			validFlag = true,
			errorObj ={
				empty: false,
				smallPass: false,
				incorMail: false,
			};
	// проверка на пустые значения

	$.each(elements, function(index, val){
		var element = $(val),
				val = element.val();

		if((val.length === 0)) {
			validFlag = false;
			errorObj.empty = true;
		}
	})
	// проверяем, есть ли в форме поле password
	// если есть, проверяем его длину

		if(elements.is('input[type="password"]')) {
				if(form.find('input[type="password"]').val().length<8){
					validFlag = false;
					errorObj.smallPass = true;
			}
		}
	// проверяем, есть ли в форме поле email
	// если есть, проверяем его корректность
	if(!_regMail.test((form.find('input[type="email"]')).val())) {
					validFlag = false;
					errorObj.incorMail = true;
			}

	return {
		validFlag: validFlag,
		errorObj: errorObj
	}

};

var clearForm = function(form) {
	// находим нужные input
	var elements = form.find('input[type="email"], input[type="password"], input[type="text"]');
	$.each(elements, function(index, val){
		var element = $(val),
				val = element.val();
		// чистим
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
// Регистрация нового пользоваеля
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
						alert(ans.message);
						// очищаем поля
					validation.clearForm(form);
				})
			}
	}

// Авторизация пользователя
	var _submitFormLogin = function(ev){
		console.log('login');
		ev.preventDefault();
		var form = $(this).parent(),
				url = '/login/',
				data = 
				{
					email: form.find('input[name = "email"]').val(),
					pass: form.find('input[name = "pass"]').val(),
				},
				servAns = _ajaxForm(form, url, data);
				if(servAns){
					console.log('выводим ответ от сервера:');
					servAns.done(function(ans) {
					if(ans.status == 'login'){
						 window.location.reload(true);
						}
				});
			}
	};
// Врсстановление пароля
	var _submitFormRecover = function(ev){
		console.log('recover');
		ev.preventDefault();
		var form = $(this).parent(),
				url = '/recover/',
				data = 
				{
					email: form.find('input[name = "email"]').val(),
				},
				servAns = _ajaxForm(form, url, data);
				if(servAns){
					console.log('выводим ответ от сервера:');
					servAns.done(function(ans) {
					alert(ans.message);
					// очищаем поля
					validation.clearForm(form);
				})
			}
	}
// Функция для отправки ajax запроса
	var _ajaxForm = function (form, url, data){
		// для начала проверим, вылидна ли форма
		//если валидация прошла успешно, отправляем запрос на сервер
		//если нет - выводим сообщения об ошибках
		var validForm = validation.validateForm(form);
		console.log(validForm.validFlag);
		if (!validForm.validFlag){
			//если найдены пустые поля, выводим сообщене о пустых полях
			if(validForm.errorObj.empty){
				form.find('.popup__error-empty').removeClass('hide');
			}
			//если пароль короткий
			if(validForm.errorObj.smallPass){
				form.find('.popup__error-pass').removeClass('hide');
			}
			//если email некорректный
			if(validForm.errorObj.incorMail){
				form.find('.popup__error-email').removeClass('hide');
			}
			return false;
		}

		// валидация прошла успешно
		console.log('всё хорошо');
		console.log('запрос на '+url);
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

	}

	return {

		init: init
	};
})();
submitForm.init();


// Фиксирование кнопки добавить в альбомах
var scrollAlbum = function(){
	'use strict';
	
	var init = function() {
		_setUpListners();
	};

	// Слушаем событие скролла
	var _setUpListners = function() {
		$(window).on('scroll', _fixedAdd);
	};
	// Функция при скролле
	var _fixedAdd = function() {
		if(($('html').scrollTop()>=$('.header-album__content').height()) || ($('body').scrollTop()>=$('.header-album__content').height())){

			if (!($('.btn_album-add').hasClass('fixed'))){
	    		$('.btn_album-add').addClass('fixed');
	    	}
	    $('.header-album__about-side_back').removeClass('hide').addClass('fixedHeader');
	    $('.header-album__about-side_front').addClass('hide');
  }
  else{
    		if ($('.btn_album-add').hasClass('fixed')){
	    		$('.btn_album-add').removeClass('fixed');
	    	}
	    	$('.header-album__about-side_back').addClass('hide').removeClass('fixedHeader');
	    	$('.header-album__about-side_front').removeClass('hide');

    	}
	};
	return {
		init: init
	};
	
}();
scrollAlbum.init();




$( document ).ready(function() {

	// Прокрутить страницу до ...
	(function() {

		$(document).on('click', '[data-go]', function(e) {
			e.preventDefault();

			var btn        = $(this);
			var target     = btn.attr('data-go');
			var container  = null;


			function scrollToPosition(position, duration) {
				var position = position || 0;
				var duration = duration || 1000;


				$("body, html").animate({
					scrollTop: position
				}, duration);
			}


			if (target == 'top') {
				scrollToPosition();
			}
		});

	})();



	// drop - элемент с выпадающим блоком
	(function() {
		$(document).on('click', '.drop__trigger', function(e) {
			e.preventDefault();

			var trigger     = $(this);
			var container   = trigger.closest('.drop');
			var content     = container.find('.drop__main');
			var classActive = 'drop--open';

			if(container.hasClass('drop--hover')) return;

			container.toggleClass( classActive );
		});
	})();



	// Кастомный вид для загрузки файлов
	(function() {
		var el = $('.upload');

		if(el.length === 0) return;

		$(document).on('click', '.upload', function(e) {
			var el    = $(this);
			var input = el.children('[type=file]');

			input[0].click();
		});
	})();

});


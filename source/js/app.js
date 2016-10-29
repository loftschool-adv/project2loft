(function(){

			 // устанавливаем высоту для flipp
			$('.flipper').height($('.front').height());

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
	};
	var _submitFormLogin = function(ev){
		console.log('login');
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
				url = '/login/',
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
				url = '',
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
		//validation.clearForm(form);
	}

	return {

		init: init
	};
})();
submitForm.init();

login.init();





$( document ).ready(function() {

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

});
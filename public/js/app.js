// =========== Base module ===========

var BaseModule = function(){

	//====== Объекты,массивы ======
	this.errors = {
  	0 : 'Заполнены не все поля',
  	1 : 'Введите корректный e-mail',
  	2	: 'Длина пароля меньше 8 символов',
  };

  this.RegPatterns = {
  	email : /^([0-9a-zA-Z_-]+\.)*[0-9a-zA-Z_-]+@[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)*\.[a-z]{2,6}$/,
  };

  this.global = {};




  //====== Функции ======


	this.ajaxData = function(form,_type){
		var elem = form.find('input[type != submit],textarea');
		var data = {};
		$.each(elem, function(){
				data[$(this).attr('name')] = $(this).val();
		})
		var format = _type || JSON.stringify(data)
		return format;
	};

	this.ajax = function(form, url, _method){
			var method = _method || 'POST';
			var data = this.ajaxData(form);
			return $.ajax({
				url: url,
				type: method,
				contentType: 'application/json',
				data: data
			});
	}

	this.showError = function(errorIndex,elem,_ms){
		var thisFrom = elem.closest('form');
		var time = _ms || 2000;
		if(typeof(errorIndex) == 'string'){
			elem.text(errorIndex)
		}else{
			elem.text(this.errors[errorIndex]);
		}
		if(thisFrom.find(elem).is(':visible')){
			clearTimeout(this.global.timer);
			this.global.timer = setTimeout(function(){
				elem.text();
				elem.removeClass('show').addClass('hide');
			}, time);
			return;
		}

		
		elem.removeClass('hide').addClass('show');


		this.global.timer = setTimeout(function(){
			elem.text();
			elem.removeClass('show').addClass('hide');
		}, time);

	}

	this.hideError = function(elem){
		elem.removeClass('show').addClass('hide');
	}

	this.validEmail = function(input, patter){
		// Функция проверяет корректность email по регулярному выражению
		// Принимает два аргумента:
		// 1) input в виде массива (jquery).
		// 2) шаблон для проверка.
		// Возвращает true или false
		return patter.test(input.val());
	};

	this.validPass = function(input,length){
		// Функция проверяет длинну пароля
		var len = length || 8;
		if(!(input.val().length < len)){
			return true;
		}
	};
	
	this.validateForm = function(form) {
		// Функция проверяет форму на валидность пароля
		// При ошибках возвращает массив с номерами ошибок,
		// который описан выше.(this.errors)
		// Возвращает пустой массив если все в порядке.
		var thisModule = this;
		var pattern = thisModule.RegPatterns.email;
		var $thisForm = form;
		var elements = $thisForm.find('input');
		var errors = thisModule.errors;
		var output = [];

		$.each(elements, function(){
			if(!$(this).val()){
				output.push(0);
				return false;	
			}
		});

		if(output.length == 0){
			$.each(elements, function(index,elem){
				var $this = $(this);
				var type = $this.attr('type');
				switch(type){
					case 'password' :
						if(!thisModule.validPass($this)){
							output.push(2);
						}
						break;
					case 'email' :
						if(!thisModule.validEmail($this,pattern)){
							output.push(1);
						}
						break;
					case 'login' :
						// Проверка на логин
						break;
					default:
						return true;
				}
			})
		};

		return output;
	};

	this.clearInputs = function(form){
		var elem = form.find('input[type != submit],textarea');
		elem.val('');
	}

	

}
// =========== Login module ===========
// Этот модуль содержит в себе все что связанно с формой авторизации и регистрации.


var loginModule = (function() {

	// Глобальные переменные модуля.
  var base = new BaseModule;
  
  var toSendRequest = function(){
  	var $form = $('.popup__form');
  	var $formLogin = $form.filter('.popup__form-login');
  	var $formReg = $form.filter('.popup__form-registration');
  	var $formRecover = $form.filter('.popup__form-recover');
  	var button = 'input[type = submit]';
  	var popupTime = 5000;


  	// Отправляем ajax на login
  	$formLogin.find(button).on('click', function(e){
  		e.preventDefault();
	  		var $thisForm = $(this).closest('form');
	  		// Параметры для popup
	  		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
	  		var $errorContainer = $thisForm.find('.popup__error');
	  		if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
	  			errorArray.forEach(function(index){
	  				base.showError(index,$errorContainer, popupTime);
	  			});
	  		}else{ // Если массив пустой, выполняем дальше
	  			base.hideError($errorContainer);
	  			servAns = base.ajax($thisForm,'/login/');
	  			servAns.done(function(ans){
	  				if(!ans.status){
	  					base.showError(ans.message,$errorContainer, popupTime);
	  				}else{
	  					window.location.reload(true);
	  				}
	  			});
	  		}
  		
  	})

  	// Отправляем ajax на reg
  	$formReg.find(button).on('click', function(e){
  		e.preventDefault();
	  		var $thisForm = $(this).closest('form');
	  		// Параметры для popup
	  		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
	  		var $errorContainer = $thisForm.find('.popup__error');
	  		if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
	  			errorArray.forEach(function(index){
	  				base.showError(index,$errorContainer, popupTime);
	  			});
	  		}else{ // Если массив пустой, выполняем дальше
	  			base.hideError($errorContainer);
	  			servAns = base.ajax($thisForm,'/reg/');
	  			servAns.done(function(ans){
	  				if(!ans.status){
	  					base.showError(ans.message,$errorContainer, popupTime);
	  				}else{
	  					window.location.reload(true);
	  				}
	  			});
	  		}
  		
  	})

  	// Отправляем ajax на recover

  	// В РАЗРАБОТКЕ

  	$formRecover.find(button).on('click', function(e){
  		e.preventDefault();
	  		var $thisForm = $(this).closest('form');
	  		// Параметры для popup
	  		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
	  		var $errorContainer = $thisForm.find('.popup__error');
	  		if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
	  			errorArray.forEach(function(index){
	  				base.showError(index,$errorContainer, popupTime);
	  			});
	  		}else{ // Если массив пустой, выполняем дальше
	  			base.hideError($errorContainer);
	  			servAns = base.ajax($thisForm,'/recover/');
	  			servAns.done(function(ans){
	  				if(!ans.status){
	  					base.showError(ans.message,$errorContainer, popupTime);
	  				}else{
	  					window.location.reload(true);
	  				}
	  			});
	  		}
  		
  	})

  }

 

  var popupWindowAnimate = function(){
  	// анимация popup
		// при нажатии на "зарегистрироваться"
		var flipp 	= 'flipp';
		var hide 		= 'hide';
		var $flipContainer = $('.flipper-container');
		var $backPass = $('.back-pass');
		var $backReg = $('.back-reg');

		$('.popup__link_registr').click(function(e){
			e.preventDefault();
			$backPass.addClass(hide);
			$backReg.removeClass(hide);
		 	$flipContainer.addClass(flipp);
	 });


		// при нажатии на "войти"
		$('.popup__link_enter').click(function(e){
		 	e.preventDefault();
	 		$flipContainer.removeClass(flipp);
	 });


		// при нажатии на "забыли пароль"
		$('.popup__link_forget-pass').click(function(e){
			e.preventDefault();
			$backPass.removeClass(hide);
			$backReg.addClass(hide);
		 	$flipContainer.addClass(flipp);
	 });
  };


 



  return {
      init: function () {
      	popupWindowAnimate();
      	toSendRequest();
      }

  };
})();
// Создание модуля.
// 1) Cоздаем файл с модулем в папке sourse/js/modules
// 2) Желательно называть файлы с нижнего подчеркивания(Что бы не отходить от традиций)
// 3) Копируем структуру из файла _login или любого другово модуля(но не base).
// 4) в return модуля нужно вставить объект с методом init.
// 5) в метод init записываем функции, которые будут вызываться автоматически при инициализации модуля.
// 6) Что бы получить доступ к библиотеке, в начале модуля нужно ее объявить, напирмер так var base = new BaseModule;
// теперь все свойства и методы библиотеки доступны через точку, напирмер так base.ajaxData(form);
// 7) В библиотеку можно дописывать все что угодно, главное чтобы функция начиналась с this, так модуль base является конструктором.
// 8) Для того чтобы модуль собрался в один файл app.js его нужно прописать в в gulpfile.js.
// Документация по фунциям base, будет чуть позже...



$( document ).ready(function() {
    var base = new BaseModule; // Инициализируем библиотеку. (Пока не нужно)
    // Подключаем модуль для работы с аторизацией, регистрацией и тд. Все что связанно со входом пользователя на сайт
    loginModule.init(); 
})

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

// Открыть/закрыть окно для загрузки изображений
(function(){
	$('.btn_album-add').on('click', function() {
	$('.modal-container').removeClass('hide');

	})
$('.modal__header-close').on('click', function() {
	$('.modal-container').addClass('hide');
})
})();




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


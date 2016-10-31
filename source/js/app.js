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

// Анимация для редактирования футера на странице альбома
(function(){
	$('#btn_album_edit').on('click', function() {

	$('.header-album__content_back, .header-edit-bottom').css('transform','translateY(0)');
	$('.header-album__content_front').fadeOut(500);
	$('.header-edit-overlay').fadeIn(500);
	$('.header-album__about-side_front').fadeOut(500);
	})

	$('#cancel_edit_header').on('click', function(ev) {
		ev.preventDefault();
		$('.header-album__content_back').css('transform','translateY(-100%)');
		$('.header-edit-bottom').css('transform','translateY(100%)');
		$('.header-album__content_front').fadeIn(500);
		$('.header-edit-overlay').fadeOut(500);
		$('.header-album__about-side_front').fadeIn(500);
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


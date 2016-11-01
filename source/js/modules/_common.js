// =========== Common module ===========
// Этот модуль содержит в себе общие скрипты, присущие всем страницам сайта.

var commonModule = (function() {

	// Объявление библиотеки
  var base = new BaseModule;

	
  
// Прокрутить страницу до ...
	var scrollTo = function(e){
		e.preventDefault();

		var btn        = $(this);
		var target     = btn.attr('data-go');
		var container  = null;

		if (target == 'top') {
			base.scrollToPosition();
		}
	}


	// drop - элемент с выпадающим блоком
	var addDrop = function(e) {
		e.preventDefault();

		var trigger     = $(this);
		var container   = trigger.closest('.drop');
		var content     = container.find('.drop__main');
		var classActive = 'drop--open';

		if(container.hasClass('drop--hover')) return;

		container.toggleClass( classActive );
	};


	// Кастомный вид для загрузки файлов
	// Пожалуйста, исправьте эту функцию, не понятно где она используеться и нужно вытащить on click в _setUplistner
	var fileUpload = function(){
		var el = $('.upload');

		if(el.length === 0) return;

		$(document).on('click', '.upload', function(e) {
			var el    = $(this);
			var input = el.children('[type=file]');

			input[0].click();
		});
	}
		




	// Прослушка
	var _setUpListners = function() {
			$(document).on('click', '[data-go]' , scrollTo);
			$(document).on('click', '.drop__trigger', addDrop);
	};




  return {
    init: function () {
    	_setUpListners();
    }

  };
})();
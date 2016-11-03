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
    commonModule.init();
    loginModule.init();
    albumModule.init();
    albumModule.edit.init();
});


// Открыть/закрыть окно для загрузки изображений
(function(){
	$('.btn_album-add').on('click', function() {
	$('.modal, .modal-overlay').removeClass('hide');

	})
$('.modal__header-close,  .btn-cancelLoad').on('click', function(ev) {
	ev.preventDefault();
	$('.modal, .modal-overlay').addClass('hide');
	$(".img-list").empty();
	$('.modal__load-img').show();
})
})();

// Отменить загрузку для одной картинки
$('body').on('click','.img-item',function(e){
		alert("Отменить загрузку?");
		$(this).remove();
});

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


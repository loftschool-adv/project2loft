// =========== Base module ===========

var BaseModule = function(){

	//====== Объекты,массивы ======
	this.errors = {
  	0 : 'Заполнены не все поля',
  	1 : 'Введите корректный e-mail',
  	2	: 'Длина пароля меньше 8 символов',
  	3 : 'Выберите обложку'
  };

  this.RegPatterns = {
  	email : /^([0-9a-zA-Z_-]+\.)*[0-9a-zA-Z_-]+@[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)*\.[a-z]{2,6}$/,
  	link : /^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/
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

	this.clearTmp = function(userId,thisAjax){
    if(thisAjax){
      thisAjax.abort();
    }
    $.ajax({
      url: userId + 'clearTmp/',
      type: "POST",
      data: {clear: 'clearHeader'},
      dataType: 'json'
    });
  }

	this.ajaxDataObj = function(obj,url,method){
		method = method || 'POST'
		var data = JSON.stringify(obj);
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
		return patter.test(input.val());
	};

	this.validPass = function(input,length){
		var len = length || 8;
		if(!(input.val().length < len)){
			return true;
		}
	};

	this.validFiles = function(input,length){
		var len = length || 0;
		if(!(input[0].files.length <= len)){
			return true;
		};
	}
	
	this.validateForm = function(form) {
		var thisModule = this;
		var pattern = thisModule.RegPatterns.email;
		var $thisForm = form;
		var elements = $thisForm.find('textarea,input:not(input[type="submit"])');
		var errors = thisModule.errors;
		var output = [];

		$.each(elements, function(){
			
			if(!$(this).val() && $(this).attr('type') != 'file'){
					output[0] = 0;
			}
		});

		if(output.length == 0){
			$.each(elements, function(){
				var $this = $(this);
				var type = $this.attr('type');
				var nameAttr = $this.attr('name');
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
				};
				switch(nameAttr){
					case 'addAlbumCover' :
						if(!thisModule.validFiles($this)){
							output.push(3);
						}
						break;
				};
			})
		};

		return output;
	};

	this.clearInputs = function(form){
		var elem = form.find('input[type != submit],textarea');
		elem.val('');
	}

	this.scrollToPosition = function(position, duration){
  	var position = position || 0;
		var duration = duration || 1000;


		$("body, html").animate({
				scrollTop: position
		}, duration)
  };

  this.changeClass = function(parent,className,type){
  	if(typeof(parent) == 'string'){
  		var parent = $(parent);
  	}
  	switch(type){
  		case 'add':
  			parent.addClass(className);
  			break;
  		case 'del':
  			parent.removeClass(className);
  			break;

  	}
  };

	

}
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


// Сворачивание блока с комментариями
	var commentsToggle = function(e){
		e.preventDefault();

		var btn       = $(this);
		var container = btn.closest('.comments');
		var comments  = container.find('.comments__list');

		if(container.hasClass('comments--show')) {
			container.removeClass('comments--show');
			comments.slideUp();
		} else {
			container.addClass('comments--show');
			comments.slideDown();
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


	// Разлогин пользователя
	// Нужно доработать
	var logoutUser = function(){
		var obj = {
			req: "logout"
		}
		var data = JSON.stringify(obj);

			var xhr = new XMLHttpRequest;
			var id = window.location.pathname;
			xhr.open('POST', id + 'logout/',true);
			xhr.setRequestHeader('Content-type','application/json');
			xhr.send(data);
			xhr.onreadystatechange = function() {
				if (xhr.readyState != 4) return;
				// Перезагрузка страницы
				if(JSON.parse(xhr.responseText).status == "logout"){
					//window.location.reload(true);
					var site = window.location.protocol+ '//' + window.location.host + '/';
					console.log(window.location.pathname);
					window.location.href = site;
				}
			}
}

	var editUserData = function(){
		console.log(12);
	}



	// Прослушка
	var _setUpListners = function() {
			$(document).on('click', '.comments__toggle' , commentsToggle);
			$(document).on('click', '[data-go]' , scrollTo);
			$(document).on('click', '.drop__trigger', addDrop);
			$('.logout').on('click', logoutUser)
	};




  return {
    init: function () {
    	_setUpListners();
    }

  };
})();
// =========== Login-cover module ===========
// Этот модуль содержит в себе анимацию для блока авторизаци.


var loginCoverModule = (function() {

	// Глобальные переменные модуля.
  var base = new BaseModule;


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
      }

  };
})();
// =========== Header module ===========
// Этот модуль содержит в себе анимации применяемые к шапкам страницы

var headerModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;


	// Открыть редактирование шапки
	var _openEditHeader = function() {
		//переменные
		$this = $(this);
		front = $this.closest('.header__section');
		back = front.next();
		headerBottom = front.parent().siblings().children('.header-bottom-front');
		headerBottomEdit  = headerBottom.prev();

		// Анимация
		back.css('top','0');
		headerBottomEdit.css('transform','translateY(0)');
		front.fadeOut(500);
		$('.header-edit-overlay').fadeIn(500);
		headerBottom.fadeOut(500);
	}


	// Закрыть редактирование шапки
	var _closeEditHeader = function(ev) {
		ev.preventDefault();
		back.css('top','-100%');
		headerBottomEdit.css('transform','translateY(100%)');
		front.fadeIn(500);
		$('.header-edit-overlay').fadeOut(500);
		headerBottom.fadeIn(500);
	}

		var _setUpListners = function() {
			$('.btn_edit-header').on('click', _openEditHeader);
			$('#cancel_edit_header').on('click', _closeEditHeader);
		};


  // Общиие переменные

  return {
  	closeEditHeader: function(){
  		return _closeEditHeader;
  	},
    init: function () {
    	_setUpListners();
    },

  };
})(headerModule);
// =========== Album add module ===========
// Этот модуль содержит в себе скрпиты анимации для добавления альбомов

var albumAddModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;


  // Открыть окно для загрузки изображений
  // !!ПЕРЕНЕСТИ В ДРУГОЙ ФАЙЛ
	

	// Открыть окно для добавления альбомов
  var openUploadAlbum = function(){
    base.changeClass('.modal__add-album, .modal-overlay','hide','del')
  };








  
  var _setUpListners = function(){
		$('.btn_album-main-add').on('click', openUploadAlbum);
  }

  return {
    init: function () {
    	_setUpListners();
    },

  };

})();
//Обрабатывем DragEndDrops
var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();
// Читаем разметку и сохраняем форму
var $form = $('#upload');
var $input = $('#file');
var $save = $('#save');
var $closeUploaderImg = $('.modal__close-img');
var simpleUpload = false;

// Если чтото закинули добавляем класс
if (isAdvancedUpload) {

  var tmpFiles = false;
  var droppedFiles = false;

  $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
    .on('dragover dragenter', function() {
      $form.addClass('is-dragover');
    })
    .on('dragleave dragend drop', function() {
      $form.removeClass('is-dragover');
    })
    .on('drop', function(e) {
      simpleUpload = false;
      droppedFiles = [];
      tmpFiles = e.originalEvent.dataTransfer.files;
      console.log(tmpFiles);

      for (var i = 0; i < tmpFiles.length; i++) {
        console.log(tmpFiles[i].type);
        droppedFiles.push(tmpFiles[i]);
      }

      $form.trigger('submit');
    });

  $input.on('change', function(e) { // drag & drop НЕ поддерживается
    simpleUpload = true;
    $form.trigger('submit');
  });

  /////////////////


}



// Ручная отправка
$form.on('submit', function(e) {
  if ($form.hasClass('is-uploading')) return false;
  $form.addClass('is-uploading').removeClass('is-error');

  if (isAdvancedUpload) {
    e.preventDefault();

    if (simpleUpload) {
      var photos = $input[0].files;

      ajaxUploadImg(photos);
    }


    if (droppedFiles) {
      ajaxUploadImg(droppedFiles);
    }

  }
});

$save.on('click', function () {

  $.ajax({
    type: "POST",
    url: location.href + 'saveImg/',
    data: 'ok',
    cache: false,
    contentType: false,
    processData: false,
    success: function(data) {

    },
    error: function() {
      // Log the error, show an alert, whatever works for you
    }
  });

});

$closeUploaderImg.on('click', function () {

  $.ajax({
    type: "POST",
    url: location.href + 'closeUploaderImg/',
    data: 'ok',
    cache: false,
    contentType: false,
    processData: false,
    success: function(data) {
      droppedFiles = false;
    },
    error: function() {
      // Log the error, show an alert, whatever works for you
    }
  });

});

function ajaxUploadImg(photos) {
  async.eachSeries(photos, function(photo, callbackEach) {

    $('.modal__load-img').hide();
    var li = $('<li/>').addClass('img-item').appendTo($('ul#img-list'));
    var ImgCont = $('<div/>').addClass('img-cont').appendTo(li);

    var ajaxData = new FormData();
    ajaxData.append("photo", photo);

    $.ajax({
      url: location.href + 'addImg/',
      type: $form.attr('method'),
      data: ajaxData,
      dataType: 'json',
      cache: false,
      contentType: false,
      processData: false,
      complete: function(data) {
        $form.removeClass('is-uploading');

        ////////////////////////////////////////////
        ////////////////////////////////////////////
        var src = data.responseText;
        src =String(src).replace(/\\/g, "/");
        src = src.substr(6);
        console.log(src);

        var image =$('<img>', {
          src: '/'+src});

        // Когда картинка загрузится, ставим её на фон
        image.on("load", function(){
          ImgCont.css('background-image', 'url("/'+src+'")');
        });

        ///////////////////////////////////////////
        ////////////////////////////////////////////

        callbackEach();

        //socket.emit('eventServer', {data: 'Hello Server'});
      },
      success: function(data) {

        $form.addClass( data.success == true ? 'is-success' : 'is-error' );

        if (!data.success) $errorMsg.text(data.error);
      },
      error: function() {
        // Log the error, show an alert, whatever works for you
      }
    });

  });
}
// =========== Album module ===========
// Этот модуль содержит в себе скрипты которые используються только на странице альбомов.

var albumModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  // Общиие переменные
  var $form = $('.popup__form');
  var $modalAddAlbum = $('.modal__add-album');
  var button = 'add-album__btn-save';
  var popupTime = 5000;
  var albumCoverInput = $modalAddAlbum.find('input[name="addAlbumCover"]');
  var loader = 'loader';


  // Открыть окно для загрузки изображений
  var openUploadImg = function(){
		base.changeClass('.modal_add-photo, .modal-overlay','hide','del');
		$('input[type="file"]').replaceWith( $('input[type="file"]') = $('input[type="file"]').clone( true ) );
	};

	// Закрыть окно для загрузки изображений
	var closeUpload = function(e){
		e.preventDefault();
		var modal = $(this).closest('.modal');
		base.changeClass(modal,'hide','add');
		base.changeClass('.modal-overlay','hide','add');
		$(".img-list").empty();
		$('.modal__load-img').show();
		$(".slider__item").remove();
		$('.slider__view').css('transition' ,'none');
	};

	// Открыть окно для редактирования фото и отправить ajax при сохранении редактирования

	var openEditPhoto = function(){
		// Открыть окно
		base.changeClass('.modal_edit-photo, .modal-overlay','hide','del');

		// Данные для ajax
		var $formEditImg = $('.modal__form-edit');
  	var button = 'input[type = submit]';
  	var popupTime = 5000;
	// Отправляем ajax на ????
    $('.submit-edit').on('click', function(e){
      e.preventDefault();
      // Параметры для popup
      var errorArray = base.validateForm($formEditImg); // Проверяем текущую форму и выдаем массив индексов ошибок
      var $errorContainer = $formEditImg.find('.popup__error');
      if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
        errorArray.forEach(function(index){
          base.showError(index,$errorContainer, popupTime);
        });
      }else{ 
      	// Если массив пустой, выполняем дальше
        var servAns = base.ajax($formEditImg,'/album/???/');
      }    
	});
};

	// Отмена загрузки для одной картинки
	var _cancelLoad = function(e){


		var cancel_id = JSON.stringify({id: $(this).index()});
		console.log(cancel_id);
		//droppedFiles[cancel_id] = false;
		//ajaxData.append("id", photo);

		$.ajax({
			type: "POST",
			url: location.href + 'closeUploaderOneImg/',
			contentType: 'application/json',
			data: cancel_id,
			timeout: 1000,
			cache: false,
			processData: false,
			success: function(data) {
				//droppedFiles = false;
			},
			error: function() {
				// Log the error, show an alert, whatever works for you
			}
		});

		$(this).remove();
		if($('.img-list li').length == 0){
			$('.modal__load-img').show();
		}
		
};
	// Функция при скролле
	var _fixedAdd = function() {
		var $albumContainer = $('.header-album__content');
		var $albumBtn = $('.btn_album-add');
		var $backSide = $('.header-album__about-side_back');
		var $frontSide = $('.header-album__about-side_front');
		var fixed = 'fixed';
		var hide = 'hide';

		if(($('html').scrollTop()>=$albumContainer.height()) || ($('body').scrollTop()>=$albumContainer.height())){

			if (!($albumBtn.hasClass(fixed))){
		    		base.changeClass($albumBtn,fixed,'add');
		    }
		   $backSide.removeClass(hide).addClass('fixedHeader');
		   base.changeClass($frontSide,hide,'add');
	  }
	  else{
	    		if ($albumBtn.hasClass(fixed)){
		    		base.changeClass($albumBtn,fixed,'del');
		    	}
		    	$backSide.addClass(hide).removeClass('fixedHeader');
		    	base.changeClass($frontSide,hide,'del');

	    	}
	};





// Слайдер
var funcSlider = function() {
	var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd';

	function Slider(options) {
		var gallery     = options.elem;
		var prev        = gallery.find('.slider__control--prev');
		var next        = gallery.find('.slider__control--next');

		var slides         = gallery.find('.slider__item');
		//console.log(slides);
		var activeSlide    = slides.filter('.slider__item--active');
		var slidesCnt      = slides.length;
		var activeSlideIdx = activeSlide.index();

		var isReady    = true;


		function showedSlide(slider, idx) {
			slider
				.eq(idx).addClass('slider__item--active')
				.siblings().removeClass('slider__item--active');
		}

		// function dataChange(direction) {
		// 	activeSlideIdx = (direction === 'next') ? getIdx(activeSlideIdx, 'next') : getIdx(activeSlideIdx, 'prev');
		// }

		function getIdx(currentIdx, dir) {
			if(dir === 'prev') {
				return (currentIdx - 1 < 0) ? slidesCnt - 1 : currentIdx - 1 ;
			}
			if(dir === 'next') {
				return (currentIdx + 1 >= slidesCnt) ? 0 : currentIdx + 1 ;
			}

			return currentIdx;
		}

		function changeSlide(slides, direction, className) {
			var currentSlide    = slides.filter('.slider__item--active');
			var currentSlideIdx = currentSlide.index();
			var newSlideIdx;
			if (direction === 'prev') {
				 newSlideIdx = getIdx(currentSlideIdx, 'prev');
			}
			if (direction === 'next') {
				newSlideIdx = getIdx(currentSlideIdx, 'next');
			}
			$('.slider__view').css('transition' ,'height 1s');
			// Подстраиваем высоту
			$('.slider__view').height(slides.eq(newSlideIdx).children().height());

			slides.eq(newSlideIdx)
				.addClass( className )
				.one(transitionEnd, function() {
					$(this)
						.removeClass( className )
						.addClass('slider__item--active')
						.trigger('changed-slide');
				});

			currentSlide
				.addClass( className )
				.one(transitionEnd, function() {
					$(this).removeClass('slider__item--active ' + className);
				});
		}


		$(document).on('changed-slide', function() {
			isReady = true;
		});




		this.prev = function() {
			if( !isReady ) return;
			isReady = false;

			changeSlide(slides, 'prev', 'slider__item--animate-fade');
			// dataChange('prev');
		};


		this.next = function() {
			if( !isReady ) return;
			isReady = false;

			changeSlide(slides, 'next', 'slider__item--animate-fade');
			// dataChange('next');
		};


		prev.on('click', this.prev);
		next.on('click', this.next);
	} // Slider



	var slider = new Slider({
		elem: $('#slider')
	});
};
// Открыть слайдер

	var openSlider = function(e){
		e.preventDefault();
		base.changeClass('.modal--slider, .modal-overlay','hide','del')
		// находим все картинки из альбома
		var images = $('.photo-card__head'),
				currentImg = $(this).closest('.photo-card__head');

		$('.photo-card__head').each(function(i, img){
				var url = ($(this).css('background-image').split(',')[0]);
				var src = url.substr(5, 39 );
				var cont = $('<div/>').addClass('slider__item').appendTo($('.slider__view'));

				var img = $('<img>').addClass('slider__img').appendTo(cont).attr('src',src);

				if (url==currentImg.css('background-image').split(',')[0]){
					cont.removeClass('slider__item--loading').addClass('slider__item--active');
						$('.slider__view').height(cont.children().height());
					 cont.next().addClass('slider__item--loading');
				}

		})
		funcSlider();
	};

	var _setUpListners = function() {
		$('.btn_edit-photo').on('click', openEditPhoto);
		$('.btn_album-add').on('click', openUploadImg);
		$('.modal__header-close').on('click', closeUpload);
		$(window).on('scroll', _fixedAdd);
		$('body').on('click','.img-item',_cancelLoad);
		$('.loupe').on('click', openSlider);
	};



  return {
  	close: function(){
  		return closeUpload;
  	},
    init: function () {
    	_setUpListners();
    },

  };
})();
function initPopup () {

	// Функция открытия попапа
	function popup(id, action) {
		var body      = $('body');
		var className = 'hide';

		if(action == 'open') {
			body.addClass('no-scroll');

			$('#' + id)
				.removeClass( className )
				.parent()
					.removeClass( className );
		} else if(action == 'close') {

			body.removeClass('no-scroll');

			if(id == 'all') {
				$('.modal')
					.addClass( className )
					.parent()
						.addClass( className );
			} else {
				$('#' + id)
					.addClass( className )
					.parent()
						.addClass( className );
			}
		}
	}


	// Открытие попапов по клику на элементы с атрибутом data-modal
	$(document).on('click', '[data-modal]', function(e) {
			var $el     = $(this);
			var popupId = $el.attr('data-modal');

			popup('all', 'close');
			popup(popupId, 'open');
	});


	// События при клике элемент с атрибутом data-action="close"
	$(document).on('click', '[data-action="close"]', function(e) {
			var btn   = $(this);
			var modal = btn.closest('.modal');

			popup(modal.attr('id'), 'close');
	});

} // initPopup()



initPopup();
// Слайдер
(function() {
	var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd';

	function Slider(options) {
		var gallery     = options.elem;
		var prev        = gallery.find('.slider__control--prev');
		var next        = gallery.find('.slider__control--next');

		var slides         = gallery.find('.slider__item');
		var activeSlide    = slides.filter('.slider__item--active');
		var slidesCnt      = slides.length;
		var activeSlideIdx = activeSlide.index();

		var isReady    = true;


		function showedSlide(slider, idx) {
			slider
				.eq(idx).addClass('slider__item--active')
				.siblings().removeClass('slider__item--active');
		}

		// function dataChange(direction) {
		// 	activeSlideIdx = (direction === 'next') ? getIdx(activeSlideIdx, 'next') : getIdx(activeSlideIdx, 'prev');
		// }

		function getIdx(currentIdx, dir) {
			if(dir === 'prev') {
				return (currentIdx - 1 < 0) ? slidesCnt - 1 : currentIdx - 1 ;
			}
			if(dir === 'next') {
				return (currentIdx + 1 >= slidesCnt) ? 0 : currentIdx + 1 ;
			}

			return currentIdx;
		}

		function changeSlide(slides, direction, className) {
			var currentSlide    = slides.filter('.slider__item--active');
			var currentSlideIdx = currentSlide.index();
			var newSlideIdx;

			if (direction === 'prev') {
				 newSlideIdx = getIdx(currentSlideIdx, 'prev');
			}
			if (direction === 'next') {
				newSlideIdx = getIdx(currentSlideIdx, 'next');
			}

			slides.eq(newSlideIdx)
				.addClass( className )
				.one(transitionEnd, function() {
					$(this)
						.removeClass( className )
						.addClass('slider__item--active')
						.trigger('changed-slide');
				});

			currentSlide
				.addClass( className )
				.one(transitionEnd, function() {
					$(this).removeClass('slider__item--active ' + className);
				});
		}


		$(document).on('changed-slide', function() {
			isReady = true;
		});




		this.prev = function() {
			if( !isReady ) return;
			isReady = false;

			changeSlide(slides, 'prev', 'slider__item--animate-fade');
			// dataChange('prev');
		};


		this.next = function() {
			if( !isReady ) return;
			isReady = false;

			changeSlide(slides, 'next', 'slider__item--animate-fade');
			// dataChange('next');
		};


		prev.on('click', this.prev);
		next.on('click', this.next);
	} // Slider



	var slider = new Slider({
		elem: $('#slider')
	});
})();
// =========== ajax-Login-cover module ===========
// Этот модуль содержит в себе анимацию для блока авторизаци.


var ajaxLoginCoverModule = (function() {

	// Глобальные переменные модуля.
  var base = new BaseModule;
  // Переменные 
  var $form = $('.popup__form');
	var $formLogin = $form.filter('.popup__form-login');
	var $formReg = $form.filter('.popup__form-registration');
	var $formRecover = $form.filter('.popup__form-recover');
	var button = 'input[type = submit]';
	var popupTime = 5000;

	// Кнопки

	var loginBtn = $formLogin.find(button);
	var regBtn = $formReg.find(button);
	var recoverBtn = $formRecover.find(button);



	 	// Отправляем ajax на login
	var login = function(e){
		e.preventDefault();
		var $thisForm = $(this).closest('form');
		var $errorContainer = $thisForm.find('.popup__error');
		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
			if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
  			errorArray.forEach(function(index){
  				base.showError(index,$errorContainer, popupTime);
  			});
  			}else{ // Если массив пустой, выполняем дальше
  			servAns = base.ajax($thisForm,'/login/');
  			servAns.done(function(ans){
  				if(!ans.status){
  					base.showError(ans.message,$errorContainer, popupTime);
  				}else{
  					window.location.reload(true);
  				}
  			});
  		}
  }

  // Отправляем ajax на reg

  var registration = function(e){
		e.preventDefault();
		var $thisForm = $(this).closest('form');
		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
		var $errorContainer = $thisForm.find('.popup__error');
		if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
			errorArray.forEach(function(index){
				base.showError(index,$errorContainer, popupTime);
			});
		}else{ // Если массив пустой, выполняем дальше
			servAns = base.ajax($thisForm,'/reg/');
			servAns.done(function(ans){
				if(!ans.status){
					base.showError(ans.message,$errorContainer, popupTime);
				}else{
					window.location.reload(true);
				}
			});
		}
  }

  // Отправляем ajax на recover

  var recover = function(e){
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
	  			servAns = base.ajax($thisForm,'/recover/');
	  			servAns.done(function(ans){
	  				if(!ans.status){
	  					return base.showError(ans.message,$errorContainer, popupTime);
	  				}else{
	  					base.clearInputs($thisForm);
	  					return base.showError(ans.message,$errorContainer, popupTime);
	  					
	  				}
	  			});
	  		}
  }

  	

  	
  		



 
  var _setUpListners = function(){
  	loginBtn.on('click',login);
  	regBtn.on('click',registration);
  	recoverBtn.on('click',recover)
  }
 



  return {
      init: function () {
      	_setUpListners();
      }

  };
})();
// =========== ajax header module ===========
// Этот модуль содержит в себе ajax применяемые к шапкам страницы

var ajaxHeaderModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  // Общие
  var $headerMain = $('.header-main');
  var $headerAlbum = $('.header-album');
  var $footer = $('.footer');
  var urlPath = window.location.pathname;
  var closeEditHeader = headerModule.closeEditHeader();
  var headerFront = $headerMain.find('.header__section_main-front');
  var headerBack = $headerMain.find('.header__section_main-back');
  var ajaxFlag = false;
  var thisAjax;

  var newBackGround;



  // Кнопки
  var saveBtn = $headerMain.find('.btn--save');
  var uploadAvatar = $headerMain.find('.user-block__photo-edit');
  var uploadBg = $headerMain.find('.header__part--zip_main .upload');
  var uploadBgAlbum = $headerAlbum.find('.upload');
  var cancelBtn = $headerMain.find('#cancel_edit_header');

  var saveBtnAlbum = $headerAlbum.find('.btn--save');



  //Классы

  var classCancel = 'cancel';

   // Дефолные стили

  var headerBgStyle = $headerMain.attr('style');
  var footerBgStyle = $footer.attr('style');




   // Функции


  // Заблокировать выбор файла
  var lockSelFile = function(e){
  	if(ajaxFlag){
  		e.preventDefault();
  	}
  }


  // Превью аваттарки
  var changeAvatar = function(){
  	if(ajaxFlag){
  		ajaxFlag = false;
  		return;
  	}
  	ajaxFlag = true;
  	var formData = new FormData();
  	var $this = $(this);
  	var blockPhoto = $this.closest('.user-block__photo');
  	var fileInput = $this.find('input[name="photo"]');
  	var photo = fileInput[0].files[0];
  	if(!photo){
  		ajaxFlag = false;
      var frontAvatar = headerFront.find('.user-block__photo').attr('style');
  		blockPhoto.attr('style',frontAvatar);
  		return;
  	}

  	blockPhoto.addClass('loader');
  	formData.append("userAvatar",photo);

  	thisAjax = $.ajax({
      url: urlPath + 'changePhoto/',
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function(res){
      	ajaxFlag = false;
        blockPhoto.removeClass('loader');
        blockPhoto.css({
        	'background-image': 'url('+ res.newCover +')'
        })
      }
  	});


  }

  // Превью бекраунда
  var changeBackGround = function(btn,header){
  if(ajaxFlag){
  	return;
  }
  ajaxFlag = true;
  var formData = new FormData();
  var $this = btn;
  var fileInput = $this.find('input[name="bg"]');
  var photo = fileInput[0].files[0];
  var background = '';
  if(!photo){
    //var headerBackground = attr('style');
  	 header.css({
        'background-image' : 'url('+ newBackGround +')'
      });
     $footer.css({
        'background-image' : 'url('+ newBackGround +')'
      });
  	ajaxFlag = false;
  	return;
  }

  if(header == $headerAlbum){
    background = "newAlbomCover";
  }else if(header == $headerMain){
    background = "userBackGround";
  }

  header.find('.preload__container').addClass('active');
  formData.append(background,photo);
  thisAjax = $.ajax({
    url: urlPath + 'changePhoto/',
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function(res){
      header.find('.preload__container').removeClass('active')
      ajaxFlag = false;
      	header.css({
      		'background-image': 'url('+ res.newCover +')'
      	})
        $footer.css({
          'background-image': 'url('+ res.newCover +')'
        })  

    }
  });

  }

  // Скидываем бекраунд и аватар при отмене
  var resetPreview = function(){
  	var blockPhotoBack = headerBack.find('.user-block__photo');
    var frontAvatar = headerFront.find('.user-block__photo').attr('style');
    if(newBackGround){
      $headerMain.css({
        'background-image' : 'url('+ newBackGround +')'
      })
      $footer.css({
        'background-image' : 'url('+ newBackGround +')'
      })
    }else{
      $headerMain.attr('style',headerBgStyle);
      $footer.attr('style',headerBgStyle)
    }    
  	ajaxFlag = false;
  	$headerMain.removeClass('loader');
  	
  	blockPhotoBack.removeClass('loader');
  	blockPhotoBack.attr('style',frontAvatar);

  	//$headerMain.addClass(classCancel);
    base.clearTmp(urlPath,thisAjax);
  }



  // Отправляем запрос на editUserData
  var requestToServer = function(e){
  e.preventDefault();
  var $headrBack = $headerMain.find('.header__section_main-back');
  var inputName = $headrBack.find('input[name="name"]');
  var inputAbout = $headrBack.find('textarea[name = "desc"]');
  var outputData = {
    userName: inputName.val(),
    userAbout: inputAbout.val()
  }
  $headerMain.find('.preload__container').addClass('active')
  $.ajax({
      url: urlPath + 'editUserData/',
      type: "POST",
      data: outputData,
      dataType: 'json',
      success: function(res){
        // Выводим данные с сервера
        headerFront.find('.user-block__name').text(res.name);
        headerFront.find('.user-block__desc').text(res.about);
        $headerMain.find('.preload__container').removeClass('active');
        headerFront.find('.user-block__photo').css({
          'background-image' : 'url(' + res.avatarFile + '), url(../img/album/no_photo.jpg)'
        });
        newBackGround = res.backGroundFile;
        closeEditHeader(e);
      }
    });
  }


  // Отправляем запрос на editUserAlbumData

  var requestAlbumToServer = function(e){
    e.preventDefault();

    var headerFrontAlbum = $headerAlbum.find('.header-album__content_front');
    var headerBackAlbum = $headerAlbum.find('.header-album__content_back');
    var inputName = headerBackAlbum.find('input[type="text"]');
    var inputAbout = headerBackAlbum.find('textarea[name = "desc"]');
    var outputData = {
      albumName: inputName.val(),
      albumAbout: inputAbout.val()
    }
    $headerAlbum.find('.preload__container').addClass('active');
     $.ajax({
      url: urlPath + 'editAlbumData/',
      type: "POST",
      data: outputData,
      dataType: 'json',
      success: function(res){
        // Выводим данные с сервера
        headerFrontAlbum.find('.header-album__title-description').text(res.album.originName);
        headerFrontAlbum.find('.header-album__text-description').text(res.album.about);
        $headerAlbum.find('.preload__container').removeClass('active');
        newBackGround = res.backGroundFile;
        console.log(res.album.name);
        var urlArr = urlPath.split('/');

        var newUrl = '/' + urlArr[1] + '/' + urlArr[2] + '/' + res.album.name + '/'
        console.log(newUrl)
        history.pushState('', '', newUrl);
        closeEditHeader(e);
      }
    });

  }

  var _setUplistner = function(){
  	uploadAvatar.on('change',changeAvatar);
  	uploadBg.on('change',function(e){
      e.preventDefault();
      changeBackGround($(this),$headerMain);
    });
    uploadBgAlbum.on('change',function(e){
      e.preventDefault();
      changeBackGround($(this),$headerAlbum);
    });
  	cancelBtn.on('click',resetPreview);
  	uploadBg.on('click',lockSelFile);
  	uploadAvatar.find('input').on('click',lockSelFile);
  	saveBtn.on('click',requestToServer);

    saveBtnAlbum.on('click',requestAlbumToServer)

  }


  // Общиие переменные

  return {
    init: function () {
    	_setUplistner();
    },

  };
})();
// =========== ajax social module ===========
// Этот модуль содержит в себе скрипты которые редактирует социальные сети плользователя

var ajaxSocialModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  //Общие переменные

  // Прослушка событий

  var $header = $('.header-main');
  var $headerFront = $header.find('header__section_main-front');
  var $headerBack = $header.find('.header__section_main-back');
  var $inputs = $headerBack.find('.field');
  var id = window.location.pathname;

  // Соц.сети

  var soc_vk = $inputs.filter('.input__vk');
  var soc_fb = $inputs.filter('.input__facebook');
  var soc_tw = $inputs.filter('.input__twitter');
  var soc_plus = $inputs.filter('.input__google-plus');
  var soc_email = $inputs.filter('.input__email');

  var soc_vk_old = soc_vk.val();
  var soc_fb_old = soc_fb.val();
  var soc_tw_old = soc_tw.val();
  var soc_plus_old = soc_plus.val();
  var soc_email_old = soc_email.val();

  // Кнопки
  var vk_save = soc_vk.closest('.form__row').next().find('.social--save');
  var vk_reset = soc_vk.closest('.form__row').next().find('.social--reset');

  var fb_save = soc_fb.closest('.form__row').next().find('.social--save');
  var fb_reset = soc_fb.closest('.form__row').next().find('.social--reset');

  var tw_save = soc_tw.closest('.form__row').next().find('.social--save');
  var tw_reset = soc_tw.closest('.form__row').next().find('.social--reset');

  var plus_save = soc_plus.closest('.form__row').next().find('.social--save');
  var plus_reset = soc_plus.closest('.form__row').next().find('.social--reset');

  var email_save = soc_email.closest('.form__row').next().find('.social--save');
  var email_reset = soc_email.closest('.form__row').next().find('.social--reset');


  var setSocValue = function(e,btn,s_name,s_title){
    e.preventDefault();
    var $this = btn;
    var input = $this.closest('.form__row').prev().find('input');
    var patterLink = base.RegPatterns.link;
    var patterEmail = base.RegPatterns.email;
    var socialVeiw = $('.social--veiw');
    var test = socialVeiw.find('.social__' + s_name)
    var dataInput= {
      link: input.val(),
      name: s_name,
      title: s_title,
    };

    

    if(!patterLink.test(input.val()) && (s_name != 'email')){
      alert('не правильный формат ссылки');
      return;
    }else if(!patterEmail.test(input.val()) && (s_name == 'email')){
      alert('не правильный email');
      return;
    }

    $.ajax({
       url: id + 'changeSocial/',
       type: "POST",
       processData: true,
       dataType: 'json',
       data: dataInput,
       success: function(res){
        if(s_name == 'email'){
          socialVeiw.find('.social__' + s_name).attr('href','mailto:' + res[dataInput.name].link);
        }else{
          socialVeiw.find('.social__' + s_name).attr('href',res[dataInput.name].link);
        }
        socialVeiw.find('.social__' + s_name).attr('title',res[dataInput.name].title);
       }
    });
    

  };

  var _setUpListner = function(){

    // Иконки ссылок на главной

    $('.social__btn').on('click',function(e){
      var link = $(this).attr('href');
      if(!(link.indexOf('http') + 1)){
        e.preventDefault();
      }
    })

    // Кнопки сохранить
    vk_save.on('click',function(e){
      setSocValue(e,$(this),'vk','Вконтакте');
    })

    fb_save.on('click',function(e){
      setSocValue(e,$(this),'facebook','Facebook');
    })

    tw_save.on('click',function(e){
      setSocValue(e,$(this),'twitter','Twitter');
    })

    plus_save.on('click',function(e){
      setSocValue(e,$(this),'google','Google+');
    })

    email_save.on('click',function(e){
      setSocValue(e,$(this),'email','Email');
    })

    // Кнопка отменить

    vk_reset.on('click',function(e){
      e.preventDefault();
      $(this).closest('.form').find('input').val(soc_vk_old)
    })


    fb_reset.on('click',function(e){
      e.preventDefault();
      $(this).closest('.form').find('input').val(soc_fb_old)
    })

    tw_reset.on('click',function(e){
      e.preventDefault();
      $(this).closest('.form').find('input').val(soc_tw_old)
    })

    plus_reset.on('click',function(e){
      e.preventDefault();
      $(this).closest('.form').find('input').val(soc_plus_old)
    })

    email_reset.on('click',function(e){
      e.preventDefault();
      $(this).closest('.form').find('input').val(soc_email_old)
    })


  }




 

  return {
    init: function () {
      _setUpListner();
    },
    
  };
})();
// =========== ajax Album add module ===========
// Этот модуль содержит в себе скрпиты ajax для добавления альбомов

var ajaxAlbumAddModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;


  // Общие переменные
  var $form = $('.popup__form');
  var modalAddAlbum = $('.modal__add-album');
  var id = window.location.pathname;
  var btnSave = modalAddAlbum.find('.add-album__btn-save');
  var btnClose = modalAddAlbum.find('.modal__header-close');
  var btnCancel = modalAddAlbum.find('.add-album__btn-cancel'); 
  var popupTime = 5000;
  //var albumCoverInput = modalAddAlbum.find('input[name="addAlbumCover"]');
  var loader = 'loader';
  var thisAjax;
  var closeFun = albumModule.close();

  console.log(closeFun);


  // Отправляем ajax на addAlbumCover (Превью обложки альбома)

  var addAlbumCover = function(){
    var $this = $(this);
    var thisModal = $this.closest(modalAddAlbum);
    var veiwCover = thisModal.find('.user-block__photo');
    var cover = $this[0].files[0];
    var formData = new FormData();
    var xhr = new XMLHttpRequest;

    base.changeClass(veiwCover,loader,'add');
    veiwCover.removeAttr('style');
    if(!cover){
      base.changeClass(veiwCover,loader,'del');
      return;
    }


    formData.append("newAlbomCover",cover);

    thisAjax = $.ajax({
      url: id + 'changePhoto/',
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function(res){
        veiwCover.css({
          'background-image' : 'url('+ res.newCover +')'
        })
        base.changeClass(veiwCover,loader,'del');

      }
    });
  }
    


    // Добавление альбома
  // Отправляем ajax на addlbum
  var addAlbum = function(e){
    e.preventDefault();
    var $thisModal = $(this).closest('.modal__add-album');
    var veiwCover = $thisModal.find('.user-block__photo');
    var albumName = $thisModal.find('.add-album__name-input').val();
    var albumAbout = $thisModal.find('.add-album__textarea').val()

    // Добавить прелоадер
    

    if(veiwCover.hasClass(loader)){
      return;
    }
    // Параметры для popup
    var errorArray = base.validateForm($thisModal); // Проверяем текущую форму и выдаем массив индексов ошибок
    var $errorContainer = $thisModal.find('.popup__error');
    if(errorArray.length > 0){  // Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
      errorArray.forEach(function(index){
        base.showError(index,$errorContainer, popupTime);
        alert(base.errors[index]);
        return false;
      });

     

    }else{ // Если массив пустой, выполняем дальше
      $thisModal.find('.preload__container').addClass('active');
      var outputData = {
        name: albumName,
        about: albumAbout
      }

      $.ajax({
        url: id + 'addAlbum/',
        type: "POST",
        data: outputData,
        dataType: 'json',
        success: function(res){
          // Выводим данные с сервера
          if(res.error){
            alert(res.error);
            $thisModal.find('.preload__container').removeClass('active');
            return;
          }else{
            $('.album-cards__list').prepend(res.newAlbum);
            $thisModal.find('.preload__container').removeClass('active');
            resetReq(e);



            // очищаем окошко (Желательно перделать)

            var veiwCover = $thisModal.find('.user-block__photo');
            var cover = $thisModal.find('input[type = "file"]');
            var labelUpload = $thisModal.find('.label__upload');
            var albumName = $thisModal.find('.add-album__name-input').val('');
            var albumAbout = $thisModal.find('.add-album__textarea').val('')
            

            cover.replaceWith( cover = cover.clone( true ) );
            base.clearTmp(id,thisAjax);
            base.changeClass(veiwCover,loader,'del');
            veiwCover.removeAttr('style');
            closeFun(e);

            // Скролим
            $('html, body').animate({ scrollTop: $('.album-cards__list').offset().top }, 1000)



          }
        }
      });  
    }
  }

  // Очищаем поля 
  var resetReq = function(e){
    e.preventDefault();
    e.stopPropagation();
    var $this = $(this);
    var thisModal = $this.closest(modalAddAlbum);
    var veiwCover = thisModal.find('.user-block__photo');
    var cover = thisModal.find('input[type = "file"]');
    var labelUpload = thisModal.find('.label__upload');
    var albumName = thisModal.find('.add-album__name-input').val('');
    var albumAbout = thisModal.find('.add-album__textarea').val('')
    

    cover.replaceWith( cover = cover.clone( true ) );
    base.clearTmp(id,thisAjax);
    base.changeClass(veiwCover,loader,'del');
    veiwCover.removeAttr('style');

  }


    





  
  var _setUpListners = function(){
    modalAddAlbum.on('change', 'input[name="addAlbumCover"]',addAlbumCover);
    btnSave.on('click',addAlbum);
    btnCancel.on('click',resetReq)
    btnClose.on('click',resetReq)
  }

  return {
    init: function () {
    	_setUpListners();
    },

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
    commonModule.init();
    albumModule.init();
    // Анимации
    loginCoverModule.init();
    headerModule.init();
    albumAddModule.init();
    // ajax
    ajaxLoginCoverModule.init();
    ajaxHeaderModule.init();
    ajaxSocialModule.init();
    ajaxAlbumAddModule.init();

});

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9iYXNlLmpzIiwiX2NvbW1vbi5qcyIsIl9sb2dpbi1jb3Zlci5qcyIsIl9oZWFkZXIuanMiLCJfYWxidW0tYWRkLmpzIiwidXBsb2FkLmpzIiwiX2FsYnVtLmpzIiwibW9kYWwuanMiLCJzbGlkZXIuanMiLCJfYWpheC1sb2dpbi1jb3Zlci5qcyIsIl9hamF4LWhlYWRlci5qcyIsIl9hamF4LXNvY2lhbC5qcyIsIl9hamF4LWFsYnVtLWFkZC5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09IEJhc2UgbW9kdWxlID09PT09PT09PT09XHJcblxyXG52YXIgQmFzZU1vZHVsZSA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdC8vPT09PT09INCe0LHRitC10LrRgtGLLNC80LDRgdGB0LjQstGLID09PT09PVxyXG5cdHRoaXMuZXJyb3JzID0ge1xyXG4gIFx0MCA6ICfQl9Cw0L/QvtC70L3QtdC90Ysg0L3QtSDQstGB0LUg0L/QvtC70Y8nLFxyXG4gIFx0MSA6ICfQktCy0LXQtNC40YLQtSDQutC+0YDRgNC10LrRgtC90YvQuSBlLW1haWwnLFxyXG4gIFx0Mlx0OiAn0JTQu9C40L3QsCDQv9Cw0YDQvtC70Y8g0LzQtdC90YzRiNC1IDgg0YHQuNC80LLQvtC70L7QsicsXHJcbiAgXHQzIDogJ9CS0YvQsdC10YDQuNGC0LUg0L7QsdC70L7QttC60YMnXHJcbiAgfTtcclxuXHJcbiAgdGhpcy5SZWdQYXR0ZXJucyA9IHtcclxuICBcdGVtYWlsIDogL14oWzAtOWEtekEtWl8tXStcXC4pKlswLTlhLXpBLVpfLV0rQFswLTlhLXpBLVpfLV0rKFxcLlswLTlhLXpBLVpfLV0rKSpcXC5bYS16XXsyLDZ9JC8sXHJcbiAgXHRsaW5rIDogL14oaHR0cHM/OlxcL1xcLyk/KFtcXHdcXC5dKylcXC4oW2Etel17Miw2fVxcLj8pKFxcL1tcXHdcXC5dKikqXFwvPyQvXHJcbiAgfTtcclxuXHJcbiAgdGhpcy5nbG9iYWwgPSB7fTtcclxuXHJcblxyXG5cclxuXHJcbiAgLy89PT09PT0g0KTRg9C90LrRhtC40LggPT09PT09XHJcblxyXG5cclxuXHR0aGlzLmFqYXhEYXRhID0gZnVuY3Rpb24oZm9ybSxfdHlwZSl7XHJcblx0XHR2YXIgZWxlbSA9IGZvcm0uZmluZCgnaW5wdXRbdHlwZSAhPSBzdWJtaXRdLHRleHRhcmVhJyk7XHJcblx0XHR2YXIgZGF0YSA9IHt9O1xyXG5cdFx0JC5lYWNoKGVsZW0sIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0ZGF0YVskKHRoaXMpLmF0dHIoJ25hbWUnKV0gPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0fSlcclxuXHRcdHZhciBmb3JtYXQgPSBfdHlwZSB8fCBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG5cdFx0cmV0dXJuIGZvcm1hdDtcclxuXHR9O1xyXG5cclxuXHR0aGlzLmFqYXggPSBmdW5jdGlvbihmb3JtLCB1cmwsIF9tZXRob2Qpe1xyXG5cdFx0XHR2YXIgbWV0aG9kID0gX21ldGhvZCB8fCAnUE9TVCc7XHJcblx0XHRcdHZhciBkYXRhID0gdGhpcy5hamF4RGF0YShmb3JtKTtcclxuXHRcdFx0cmV0dXJuICQuYWpheCh7XHJcblx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0dHlwZTogbWV0aG9kLFxyXG5cdFx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXHJcblx0XHRcdFx0ZGF0YTogZGF0YVxyXG5cdFx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHRoaXMuY2xlYXJUbXAgPSBmdW5jdGlvbih1c2VySWQsdGhpc0FqYXgpe1xyXG4gICAgaWYodGhpc0FqYXgpe1xyXG4gICAgICB0aGlzQWpheC5hYm9ydCgpO1xyXG4gICAgfVxyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiB1c2VySWQgKyAnY2xlYXJUbXAvJyxcclxuICAgICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICAgIGRhdGE6IHtjbGVhcjogJ2NsZWFySGVhZGVyJ30sXHJcbiAgICAgIGRhdGFUeXBlOiAnanNvbidcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblx0dGhpcy5hamF4RGF0YU9iaiA9IGZ1bmN0aW9uKG9iaix1cmwsbWV0aG9kKXtcclxuXHRcdG1ldGhvZCA9IG1ldGhvZCB8fCAnUE9TVCdcclxuXHRcdHZhciBkYXRhID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcclxuXHRcdHJldHVybiAkLmFqYXgoe1xyXG5cdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0dHlwZTogbWV0aG9kLFxyXG5cdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG5cdFx0XHRkYXRhOiBkYXRhXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHRoaXMuc2hvd0Vycm9yID0gZnVuY3Rpb24oZXJyb3JJbmRleCxlbGVtLF9tcyl7XHJcblx0XHR2YXIgdGhpc0Zyb20gPSBlbGVtLmNsb3Nlc3QoJ2Zvcm0nKTtcclxuXHRcdHZhciB0aW1lID0gX21zIHx8IDIwMDA7XHJcblx0XHRpZih0eXBlb2YoZXJyb3JJbmRleCkgPT0gJ3N0cmluZycpe1xyXG5cdFx0XHRlbGVtLnRleHQoZXJyb3JJbmRleClcclxuXHRcdH1lbHNle1xyXG5cdFx0XHRlbGVtLnRleHQodGhpcy5lcnJvcnNbZXJyb3JJbmRleF0pO1xyXG5cdFx0fVxyXG5cdFx0aWYodGhpc0Zyb20uZmluZChlbGVtKS5pcygnOnZpc2libGUnKSl7XHJcblx0XHRcdGNsZWFyVGltZW91dCh0aGlzLmdsb2JhbC50aW1lcik7XHJcblx0XHRcdHRoaXMuZ2xvYmFsLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGVsZW0udGV4dCgpO1xyXG5cdFx0XHRcdGVsZW0ucmVtb3ZlQ2xhc3MoJ3Nob3cnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9LCB0aW1lKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdFxyXG5cdFx0ZWxlbS5yZW1vdmVDbGFzcygnaGlkZScpLmFkZENsYXNzKCdzaG93Jyk7XHJcblxyXG5cclxuXHRcdHRoaXMuZ2xvYmFsLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRlbGVtLnRleHQoKTtcclxuXHRcdFx0ZWxlbS5yZW1vdmVDbGFzcygnc2hvdycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9LCB0aW1lKTtcclxuXHJcblx0fVxyXG5cclxuXHR0aGlzLmhpZGVFcnJvciA9IGZ1bmN0aW9uKGVsZW0pe1xyXG5cdFx0ZWxlbS5yZW1vdmVDbGFzcygnc2hvdycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0fVxyXG5cclxuXHR0aGlzLnZhbGlkRW1haWwgPSBmdW5jdGlvbihpbnB1dCwgcGF0dGVyKXtcclxuXHRcdHJldHVybiBwYXR0ZXIudGVzdChpbnB1dC52YWwoKSk7XHJcblx0fTtcclxuXHJcblx0dGhpcy52YWxpZFBhc3MgPSBmdW5jdGlvbihpbnB1dCxsZW5ndGgpe1xyXG5cdFx0dmFyIGxlbiA9IGxlbmd0aCB8fCA4O1xyXG5cdFx0aWYoIShpbnB1dC52YWwoKS5sZW5ndGggPCBsZW4pKXtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0dGhpcy52YWxpZEZpbGVzID0gZnVuY3Rpb24oaW5wdXQsbGVuZ3RoKXtcclxuXHRcdHZhciBsZW4gPSBsZW5ndGggfHwgMDtcclxuXHRcdGlmKCEoaW5wdXRbMF0uZmlsZXMubGVuZ3RoIDw9IGxlbikpe1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHRoaXMudmFsaWRhdGVGb3JtID0gZnVuY3Rpb24oZm9ybSkge1xyXG5cdFx0dmFyIHRoaXNNb2R1bGUgPSB0aGlzO1xyXG5cdFx0dmFyIHBhdHRlcm4gPSB0aGlzTW9kdWxlLlJlZ1BhdHRlcm5zLmVtYWlsO1xyXG5cdFx0dmFyICR0aGlzRm9ybSA9IGZvcm07XHJcblx0XHR2YXIgZWxlbWVudHMgPSAkdGhpc0Zvcm0uZmluZCgndGV4dGFyZWEsaW5wdXQ6bm90KGlucHV0W3R5cGU9XCJzdWJtaXRcIl0pJyk7XHJcblx0XHR2YXIgZXJyb3JzID0gdGhpc01vZHVsZS5lcnJvcnM7XHJcblx0XHR2YXIgb3V0cHV0ID0gW107XHJcblxyXG5cdFx0JC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoISQodGhpcykudmFsKCkgJiYgJCh0aGlzKS5hdHRyKCd0eXBlJykgIT0gJ2ZpbGUnKXtcclxuXHRcdFx0XHRcdG91dHB1dFswXSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmKG91dHB1dC5sZW5ndGggPT0gMCl7XHJcblx0XHRcdCQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdHZhciB0eXBlID0gJHRoaXMuYXR0cigndHlwZScpO1xyXG5cdFx0XHRcdHZhciBuYW1lQXR0ciA9ICR0aGlzLmF0dHIoJ25hbWUnKTtcclxuXHRcdFx0XHRzd2l0Y2godHlwZSl7XHJcblx0XHRcdFx0XHRjYXNlICdwYXNzd29yZCcgOlxyXG5cdFx0XHRcdFx0XHRpZighdGhpc01vZHVsZS52YWxpZFBhc3MoJHRoaXMpKXtcclxuXHRcdFx0XHRcdFx0XHRvdXRwdXQucHVzaCgyKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2VtYWlsJyA6XHJcblx0XHRcdFx0XHRcdGlmKCF0aGlzTW9kdWxlLnZhbGlkRW1haWwoJHRoaXMscGF0dGVybikpe1xyXG5cdFx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKDEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0c3dpdGNoKG5hbWVBdHRyKXtcclxuXHRcdFx0XHRcdGNhc2UgJ2FkZEFsYnVtQ292ZXInIDpcclxuXHRcdFx0XHRcdFx0aWYoIXRoaXNNb2R1bGUudmFsaWRGaWxlcygkdGhpcykpe1xyXG5cdFx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKDMpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pXHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fTtcclxuXHJcblx0dGhpcy5jbGVhcklucHV0cyA9IGZ1bmN0aW9uKGZvcm0pe1xyXG5cdFx0dmFyIGVsZW0gPSBmb3JtLmZpbmQoJ2lucHV0W3R5cGUgIT0gc3VibWl0XSx0ZXh0YXJlYScpO1xyXG5cdFx0ZWxlbS52YWwoJycpO1xyXG5cdH1cclxuXHJcblx0dGhpcy5zY3JvbGxUb1Bvc2l0aW9uID0gZnVuY3Rpb24ocG9zaXRpb24sIGR1cmF0aW9uKXtcclxuICBcdHZhciBwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7XHJcblx0XHR2YXIgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCAxMDAwO1xyXG5cclxuXHJcblx0XHQkKFwiYm9keSwgaHRtbFwiKS5hbmltYXRlKHtcclxuXHRcdFx0XHRzY3JvbGxUb3A6IHBvc2l0aW9uXHJcblx0XHR9LCBkdXJhdGlvbilcclxuICB9O1xyXG5cclxuICB0aGlzLmNoYW5nZUNsYXNzID0gZnVuY3Rpb24ocGFyZW50LGNsYXNzTmFtZSx0eXBlKXtcclxuICBcdGlmKHR5cGVvZihwYXJlbnQpID09ICdzdHJpbmcnKXtcclxuICBcdFx0dmFyIHBhcmVudCA9ICQocGFyZW50KTtcclxuICBcdH1cclxuICBcdHN3aXRjaCh0eXBlKXtcclxuICBcdFx0Y2FzZSAnYWRkJzpcclxuICBcdFx0XHRwYXJlbnQuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcclxuICBcdFx0XHRicmVhaztcclxuICBcdFx0Y2FzZSAnZGVsJzpcclxuICBcdFx0XHRwYXJlbnQucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcclxuICBcdFx0XHRicmVhaztcclxuXHJcbiAgXHR9XHJcbiAgfTtcclxuXHJcblx0XHJcblxyXG59IiwiLy8gPT09PT09PT09PT0gQ29tbW9uIG1vZHVsZSA9PT09PT09PT09PVxyXG4vLyDQrdGC0L7RgiDQvNC+0LTRg9C70Ywg0YHQvtC00LXRgNC20LjRgiDQsiDRgdC10LHQtSDQvtCx0YnQuNC1INGB0LrRgNC40L/RgtGLLCDQv9GA0LjRgdGD0YnQuNC1INCy0YHQtdC8INGB0YLRgNCw0L3QuNGG0LDQvCDRgdCw0LnRgtCwLlxyXG5cclxudmFyIGNvbW1vbk1vZHVsZSA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0Ly8g0J7QsdGK0Y/QstC70LXQvdC40LUg0LHQuNCx0LvQuNC+0YLQtdC60LhcclxuICB2YXIgYmFzZSA9IG5ldyBCYXNlTW9kdWxlO1xyXG5cclxuXHJcblxyXG4vLyDQn9GA0L7QutGA0YPRgtC40YLRjCDRgdGC0YDQsNC90LjRhtGDINC00L4gLi4uXHJcblx0dmFyIHNjcm9sbFRvID0gZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dmFyIGJ0biAgICAgICAgPSAkKHRoaXMpO1xyXG5cdFx0dmFyIHRhcmdldCAgICAgPSBidG4uYXR0cignZGF0YS1nbycpO1xyXG5cdFx0dmFyIGNvbnRhaW5lciAgPSBudWxsO1xyXG5cclxuXHRcdGlmICh0YXJnZXQgPT0gJ3RvcCcpIHtcclxuXHRcdFx0YmFzZS5zY3JvbGxUb1Bvc2l0aW9uKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcbi8vINCh0LLQvtGA0LDRh9C40LLQsNC90LjQtSDQsdC70L7QutCwINGBINC60L7QvNC80LXQvdGC0LDRgNC40Y/QvNC4XHJcblx0dmFyIGNvbW1lbnRzVG9nZ2xlID0gZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dmFyIGJ0biAgICAgICA9ICQodGhpcyk7XHJcblx0XHR2YXIgY29udGFpbmVyID0gYnRuLmNsb3Nlc3QoJy5jb21tZW50cycpO1xyXG5cdFx0dmFyIGNvbW1lbnRzICA9IGNvbnRhaW5lci5maW5kKCcuY29tbWVudHNfX2xpc3QnKTtcclxuXHJcblx0XHRpZihjb250YWluZXIuaGFzQ2xhc3MoJ2NvbW1lbnRzLS1zaG93JykpIHtcclxuXHRcdFx0Y29udGFpbmVyLnJlbW92ZUNsYXNzKCdjb21tZW50cy0tc2hvdycpO1xyXG5cdFx0XHRjb21tZW50cy5zbGlkZVVwKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb250YWluZXIuYWRkQ2xhc3MoJ2NvbW1lbnRzLS1zaG93Jyk7XHJcblx0XHRcdGNvbW1lbnRzLnNsaWRlRG93bigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8vIGRyb3AgLSDRjdC70LXQvNC10L3RgiDRgSDQstGL0L/QsNC00LDRjtGJ0LjQvCDQsdC70L7QutC+0LxcclxuXHR2YXIgYWRkRHJvcCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHR2YXIgdHJpZ2dlciAgICAgPSAkKHRoaXMpO1xyXG5cdFx0dmFyIGNvbnRhaW5lciAgID0gdHJpZ2dlci5jbG9zZXN0KCcuZHJvcCcpO1xyXG5cdFx0dmFyIGNvbnRlbnQgICAgID0gY29udGFpbmVyLmZpbmQoJy5kcm9wX19tYWluJyk7XHJcblx0XHR2YXIgY2xhc3NBY3RpdmUgPSAnZHJvcC0tb3Blbic7XHJcblxyXG5cdFx0aWYoY29udGFpbmVyLmhhc0NsYXNzKCdkcm9wLS1ob3ZlcicpKSByZXR1cm47XHJcblxyXG5cdFx0Y29udGFpbmVyLnRvZ2dsZUNsYXNzKCBjbGFzc0FjdGl2ZSApO1xyXG5cdH07XHJcblxyXG5cclxuXHQvLyDQmtCw0YHRgtC+0LzQvdGL0Lkg0LLQuNC0INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INGE0LDQudC70L7QslxyXG5cdC8vINCf0L7QttCw0LvRg9C50YHRgtCwLCDQuNGB0L/RgNCw0LLRjNGC0LUg0Y3RgtGDINGE0YPQvdC60YbQuNGOLCDQvdC1INC/0L7QvdGP0YLQvdC+INCz0LTQtSDQvtC90LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRjNGB0Y8g0Lgg0L3Rg9C20L3QviDQstGL0YLQsNGJ0LjRgtGMIG9uIGNsaWNrINCyIF9zZXRVcGxpc3RuZXJcclxuXHR2YXIgZmlsZVVwbG9hZCA9IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZWwgPSAkKCcudXBsb2FkJyk7XHJcblxyXG5cdFx0aWYoZWwubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy51cGxvYWQnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHZhciBlbCAgICA9ICQodGhpcyk7XHJcblx0XHRcdHZhciBpbnB1dCA9IGVsLmNoaWxkcmVuKCdbdHlwZT1maWxlXScpO1xyXG5cclxuXHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vINCg0LDQt9C70L7Qs9C40L0g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXHJcblx0Ly8g0J3Rg9C20L3QviDQtNC+0YDQsNCx0L7RgtCw0YLRjFxyXG5cdHZhciBsb2dvdXRVc2VyID0gZnVuY3Rpb24oKXtcclxuXHRcdHZhciBvYmogPSB7XHJcblx0XHRcdHJlcTogXCJsb2dvdXRcIlxyXG5cdFx0fVxyXG5cdFx0dmFyIGRhdGEgPSBKU09OLnN0cmluZ2lmeShvYmopO1xyXG5cclxuXHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcclxuXHRcdFx0dmFyIGlkID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG5cdFx0XHR4aHIub3BlbignUE9TVCcsIGlkICsgJ2xvZ291dC8nLHRydWUpO1xyXG5cdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywnYXBwbGljYXRpb24vanNvbicpO1xyXG5cdFx0XHR4aHIuc2VuZChkYXRhKTtcclxuXHRcdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblx0XHRcdFx0Ly8g0J/QtdGA0LXQt9Cw0LPRgNGD0LfQutCwINGB0YLRgNCw0L3QuNGG0YtcclxuXHRcdFx0XHRpZihKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpLnN0YXR1cyA9PSBcImxvZ291dFwiKXtcclxuXHRcdFx0XHRcdC8vd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuXHRcdFx0XHRcdHZhciBzaXRlID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyAnLyc7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xyXG5cdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBzaXRlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG59XHJcblxyXG5cdHZhciBlZGl0VXNlckRhdGEgPSBmdW5jdGlvbigpe1xyXG5cdFx0Y29uc29sZS5sb2coMTIpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyDQn9GA0L7RgdC70YPRiNC60LBcclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jb21tZW50c19fdG9nZ2xlJyAsIGNvbW1lbnRzVG9nZ2xlKTtcclxuXHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLWdvXScgLCBzY3JvbGxUbyk7XHJcblx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuZHJvcF9fdHJpZ2dlcicsIGFkZERyb3ApO1xyXG5cdFx0XHQkKCcubG9nb3V0Jykub24oJ2NsaWNrJywgbG9nb3V0VXNlcilcclxuXHR9O1xyXG5cclxuXHJcblxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgXHRfc2V0VXBMaXN0bmVycygpO1xyXG4gICAgfVxyXG5cclxuICB9O1xyXG59KSgpOyIsIi8vID09PT09PT09PT09IExvZ2luLWNvdmVyIG1vZHVsZSA9PT09PT09PT09PVxyXG4vLyDQrdGC0L7RgiDQvNC+0LTRg9C70Ywg0YHQvtC00LXRgNC20LjRgiDQsiDRgdC10LHQtSDQsNC90LjQvNCw0YbQuNGOINC00LvRjyDQsdC70L7QutCwINCw0LLRgtC+0YDQuNC30LDRhtC4LlxyXG5cclxuXHJcbnZhciBsb2dpbkNvdmVyTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuXHQvLyDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSDQvNC+0LTRg9C70Y8uXHJcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcclxuXHJcblxyXG4gIHZhciBwb3B1cFdpbmRvd0FuaW1hdGUgPSBmdW5jdGlvbigpe1xyXG4gIFx0Ly8g0LDQvdC40LzQsNGG0LjRjyBwb3B1cFxyXG5cdFx0Ly8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAgXCLQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIlxyXG5cdFx0dmFyIGZsaXBwIFx0PSAnZmxpcHAnO1xyXG5cdFx0dmFyIGhpZGUgXHRcdD0gJ2hpZGUnO1xyXG5cdFx0dmFyICRmbGlwQ29udGFpbmVyID0gJCgnLmZsaXBwZXItY29udGFpbmVyJyk7XHJcblx0XHR2YXIgJGJhY2tQYXNzID0gJCgnLmJhY2stcGFzcycpO1xyXG5cdFx0dmFyICRiYWNrUmVnID0gJCgnLmJhY2stcmVnJyk7XHJcblxyXG5cdFx0JCgnLnBvcHVwX19saW5rX3JlZ2lzdHInKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHQkYmFja1Bhc3MuYWRkQ2xhc3MoaGlkZSk7XHJcblx0XHRcdCRiYWNrUmVnLnJlbW92ZUNsYXNzKGhpZGUpO1xyXG5cdFx0IFx0JGZsaXBDb250YWluZXIuYWRkQ2xhc3MoZmxpcHApO1xyXG5cdCB9KTtcclxuXHJcblxyXG5cdFx0Ly8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAgXCLQstC+0LnRgtC4XCJcclxuXHRcdCQoJy5wb3B1cF9fbGlua19lbnRlcicpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0IFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCBcdFx0JGZsaXBDb250YWluZXIucmVtb3ZlQ2xhc3MoZmxpcHApO1xyXG5cdCB9KTtcclxuXHJcblxyXG5cdFx0Ly8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAgXCLQt9Cw0LHRi9C70Lgg0L/QsNGA0L7Qu9GMXCJcclxuXHRcdCQoJy5wb3B1cF9fbGlua19mb3JnZXQtcGFzcycpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdCRiYWNrUGFzcy5yZW1vdmVDbGFzcyhoaWRlKTtcclxuXHRcdFx0JGJhY2tSZWcuYWRkQ2xhc3MoaGlkZSk7XHJcblx0XHQgXHQkZmxpcENvbnRhaW5lci5hZGRDbGFzcyhmbGlwcCk7XHJcblx0IH0pO1xyXG4gIH07XHJcblxyXG5cclxuIFxyXG5cclxuXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgXHRwb3B1cFdpbmRvd0FuaW1hdGUoKTtcclxuICAgICAgfVxyXG5cclxuICB9O1xyXG59KSgpOyIsIi8vID09PT09PT09PT09IEhlYWRlciBtb2R1bGUgPT09PT09PT09PT1cclxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0LDQvdC40LzQsNGG0LjQuCDQv9GA0LjQvNC10L3Rj9C10LzRi9C1INC6INGI0LDQv9C60LDQvCDRgdGC0YDQsNC90LjRhtGLXHJcblxyXG52YXIgaGVhZGVyTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xyXG5cdC8vINCe0LHRitGP0LLQu9C10L3QuNC1INCx0LjQsdC70LjQvtGC0LXQutC4XHJcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcclxuXHJcblxyXG5cdC8vINCe0YLQutGA0YvRgtGMINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUg0YjQsNC/0LrQuFxyXG5cdHZhciBfb3BlbkVkaXRIZWFkZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdC8v0L/QtdGA0LXQvNC10L3QvdGL0LVcclxuXHRcdCR0aGlzID0gJCh0aGlzKTtcclxuXHRcdGZyb250ID0gJHRoaXMuY2xvc2VzdCgnLmhlYWRlcl9fc2VjdGlvbicpO1xyXG5cdFx0YmFjayA9IGZyb250Lm5leHQoKTtcclxuXHRcdGhlYWRlckJvdHRvbSA9IGZyb250LnBhcmVudCgpLnNpYmxpbmdzKCkuY2hpbGRyZW4oJy5oZWFkZXItYm90dG9tLWZyb250Jyk7XHJcblx0XHRoZWFkZXJCb3R0b21FZGl0ICA9IGhlYWRlckJvdHRvbS5wcmV2KCk7XHJcblxyXG5cdFx0Ly8g0JDQvdC40LzQsNGG0LjRj1xyXG5cdFx0YmFjay5jc3MoJ3RvcCcsJzAnKTtcclxuXHRcdGhlYWRlckJvdHRvbUVkaXQuY3NzKCd0cmFuc2Zvcm0nLCd0cmFuc2xhdGVZKDApJyk7XHJcblx0XHRmcm9udC5mYWRlT3V0KDUwMCk7XHJcblx0XHQkKCcuaGVhZGVyLWVkaXQtb3ZlcmxheScpLmZhZGVJbig1MDApO1xyXG5cdFx0aGVhZGVyQm90dG9tLmZhZGVPdXQoNTAwKTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyDQl9Cw0LrRgNGL0YLRjCDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNC1INGI0LDQv9C60LhcclxuXHR2YXIgX2Nsb3NlRWRpdEhlYWRlciA9IGZ1bmN0aW9uKGV2KSB7XHJcblx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0YmFjay5jc3MoJ3RvcCcsJy0xMDAlJyk7XHJcblx0XHRoZWFkZXJCb3R0b21FZGl0LmNzcygndHJhbnNmb3JtJywndHJhbnNsYXRlWSgxMDAlKScpO1xyXG5cdFx0ZnJvbnQuZmFkZUluKDUwMCk7XHJcblx0XHQkKCcuaGVhZGVyLWVkaXQtb3ZlcmxheScpLmZhZGVPdXQoNTAwKTtcclxuXHRcdGhlYWRlckJvdHRvbS5mYWRlSW4oNTAwKTtcclxuXHR9XHJcblxyXG5cdFx0dmFyIF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJy5idG5fZWRpdC1oZWFkZXInKS5vbignY2xpY2snLCBfb3BlbkVkaXRIZWFkZXIpO1xyXG5cdFx0XHQkKCcjY2FuY2VsX2VkaXRfaGVhZGVyJykub24oJ2NsaWNrJywgX2Nsb3NlRWRpdEhlYWRlcik7XHJcblx0XHR9O1xyXG5cclxuXHJcbiAgLy8g0J7QsdGJ0LjQuNC1INC/0LXRgNC10LzQtdC90L3Ri9C1XHJcblxyXG4gIHJldHVybiB7XHJcbiAgXHRjbG9zZUVkaXRIZWFkZXI6IGZ1bmN0aW9uKCl7XHJcbiAgXHRcdHJldHVybiBfY2xvc2VFZGl0SGVhZGVyO1xyXG4gIFx0fSxcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIFx0X3NldFVwTGlzdG5lcnMoKTtcclxuICAgIH0sXHJcblxyXG4gIH07XHJcbn0pKGhlYWRlck1vZHVsZSk7IiwiLy8gPT09PT09PT09PT0gQWxidW0gYWRkIG1vZHVsZSA9PT09PT09PT09PVxyXG4vLyDQrdGC0L7RgiDQvNC+0LTRg9C70Ywg0YHQvtC00LXRgNC20LjRgiDQsiDRgdC10LHQtSDRgdC60YDQv9C40YLRiyDQsNC90LjQvNCw0YbQuNC4INC00LvRjyDQtNC+0LHQsNCy0LvQtdC90LjRjyDQsNC70YzQsdC+0LzQvtCyXHJcblxyXG52YXIgYWxidW1BZGRNb2R1bGUgPSAoZnVuY3Rpb24oKSB7XHJcblx0Ly8g0J7QsdGK0Y/QstC70LXQvdC40LUg0LHQuNCx0LvQuNC+0YLQtdC60LhcclxuICB2YXIgYmFzZSA9IG5ldyBCYXNlTW9kdWxlO1xyXG5cclxuXHJcbiAgLy8g0J7RgtC60YDRi9GC0Ywg0L7QutC90L4g0LTQu9GPINC30LDQs9GA0YPQt9C60Lgg0LjQt9C+0LHRgNCw0LbQtdC90LjQuVxyXG4gIC8vICEh0J/QldCg0JXQndCV0KHQotCYINCSINCU0KDQo9CT0J7QmSDQpNCQ0JnQm1xyXG5cdFxyXG5cclxuXHQvLyDQntGC0LrRgNGL0YLRjCDQvtC60L3QviDQtNC70Y8g0LTQvtCx0LDQstC70LXQvdC40Y8g0LDQu9GM0LHQvtC80L7QslxyXG4gIHZhciBvcGVuVXBsb2FkQWxidW0gPSBmdW5jdGlvbigpe1xyXG4gICAgYmFzZS5jaGFuZ2VDbGFzcygnLm1vZGFsX19hZGQtYWxidW0sIC5tb2RhbC1vdmVybGF5JywnaGlkZScsJ2RlbCcpXHJcbiAgfTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIFxyXG4gIHZhciBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uKCl7XHJcblx0XHQkKCcuYnRuX2FsYnVtLW1haW4tYWRkJykub24oJ2NsaWNrJywgb3BlblVwbG9hZEFsYnVtKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBcdF9zZXRVcExpc3RuZXJzKCk7XHJcbiAgICB9LFxyXG5cclxuICB9O1xyXG5cclxufSkoKTsiLCIvL9Ce0LHRgNCw0LHQsNGC0YvQstC10LwgRHJhZ0VuZERyb3BzXHJcbnZhciBpc0FkdmFuY2VkVXBsb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIHJldHVybiAoKCdkcmFnZ2FibGUnIGluIGRpdikgfHwgKCdvbmRyYWdzdGFydCcgaW4gZGl2ICYmICdvbmRyb3AnIGluIGRpdikpICYmICdGb3JtRGF0YScgaW4gd2luZG93ICYmICdGaWxlUmVhZGVyJyBpbiB3aW5kb3c7XHJcbn0oKTtcclxuLy8g0KfQuNGC0LDQtdC8INGA0LDQt9C80LXRgtC60YMg0Lgg0YHQvtGF0YDQsNC90Y/QtdC8INGE0L7RgNC80YNcclxudmFyICRmb3JtID0gJCgnI3VwbG9hZCcpO1xyXG52YXIgJGlucHV0ID0gJCgnI2ZpbGUnKTtcclxudmFyICRzYXZlID0gJCgnI3NhdmUnKTtcclxudmFyICRjbG9zZVVwbG9hZGVySW1nID0gJCgnLm1vZGFsX19jbG9zZS1pbWcnKTtcclxudmFyIHNpbXBsZVVwbG9hZCA9IGZhbHNlO1xyXG5cclxuLy8g0JXRgdC70Lgg0YfRgtC+0YLQviDQt9Cw0LrQuNC90YPQu9C4INC00L7QsdCw0LLQu9GP0LXQvCDQutC70LDRgdGBXHJcbmlmIChpc0FkdmFuY2VkVXBsb2FkKSB7XHJcblxyXG4gIHZhciB0bXBGaWxlcyA9IGZhbHNlO1xyXG4gIHZhciBkcm9wcGVkRmlsZXMgPSBmYWxzZTtcclxuXHJcbiAgJGZvcm0ub24oJ2RyYWcgZHJhZ3N0YXJ0IGRyYWdlbmQgZHJhZ292ZXIgZHJhZ2VudGVyIGRyYWdsZWF2ZSBkcm9wJywgZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9KVxyXG4gICAgLm9uKCdkcmFnb3ZlciBkcmFnZW50ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgJGZvcm0uYWRkQ2xhc3MoJ2lzLWRyYWdvdmVyJyk7XHJcbiAgICB9KVxyXG4gICAgLm9uKCdkcmFnbGVhdmUgZHJhZ2VuZCBkcm9wJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdpcy1kcmFnb3ZlcicpO1xyXG4gICAgfSlcclxuICAgIC5vbignZHJvcCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgc2ltcGxlVXBsb2FkID0gZmFsc2U7XHJcbiAgICAgIGRyb3BwZWRGaWxlcyA9IFtdO1xyXG4gICAgICB0bXBGaWxlcyA9IGUub3JpZ2luYWxFdmVudC5kYXRhVHJhbnNmZXIuZmlsZXM7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRtcEZpbGVzKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG1wRmlsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0bXBGaWxlc1tpXS50eXBlKTtcclxuICAgICAgICBkcm9wcGVkRmlsZXMucHVzaCh0bXBGaWxlc1tpXSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRmb3JtLnRyaWdnZXIoJ3N1Ym1pdCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICRpbnB1dC5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkgeyAvLyBkcmFnICYgZHJvcCDQndCVINC/0L7QtNC00LXRgNC20LjQstCw0LXRgtGB0Y9cclxuICAgIHNpbXBsZVVwbG9hZCA9IHRydWU7XHJcbiAgICAkZm9ybS50cmlnZ2VyKCdzdWJtaXQnKTtcclxuICB9KTtcclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8vINCg0YPRh9C90LDRjyDQvtGC0L/RgNCw0LLQutCwXHJcbiRmb3JtLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgaWYgKCRmb3JtLmhhc0NsYXNzKCdpcy11cGxvYWRpbmcnKSkgcmV0dXJuIGZhbHNlO1xyXG4gICRmb3JtLmFkZENsYXNzKCdpcy11cGxvYWRpbmcnKS5yZW1vdmVDbGFzcygnaXMtZXJyb3InKTtcclxuXHJcbiAgaWYgKGlzQWR2YW5jZWRVcGxvYWQpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAoc2ltcGxlVXBsb2FkKSB7XHJcbiAgICAgIHZhciBwaG90b3MgPSAkaW5wdXRbMF0uZmlsZXM7XHJcblxyXG4gICAgICBhamF4VXBsb2FkSW1nKHBob3Rvcyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmIChkcm9wcGVkRmlsZXMpIHtcclxuICAgICAgYWpheFVwbG9hZEltZyhkcm9wcGVkRmlsZXMpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcbn0pO1xyXG5cclxuJHNhdmUub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAkLmFqYXgoe1xyXG4gICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICB1cmw6IGxvY2F0aW9uLmhyZWYgKyAnc2F2ZUltZy8nLFxyXG4gICAgZGF0YTogJ29rJyxcclxuICAgIGNhY2hlOiBmYWxzZSxcclxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHJcbiAgICB9LFxyXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBMb2cgdGhlIGVycm9yLCBzaG93IGFuIGFsZXJ0LCB3aGF0ZXZlciB3b3JrcyBmb3IgeW91XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG59KTtcclxuXHJcbiRjbG9zZVVwbG9hZGVySW1nLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgJC5hamF4KHtcclxuICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgdXJsOiBsb2NhdGlvbi5ocmVmICsgJ2Nsb3NlVXBsb2FkZXJJbWcvJyxcclxuICAgIGRhdGE6ICdvaycsXHJcbiAgICBjYWNoZTogZmFsc2UsXHJcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIGRyb3BwZWRGaWxlcyA9IGZhbHNlO1xyXG4gICAgfSxcclxuICAgIGVycm9yOiBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gTG9nIHRoZSBlcnJvciwgc2hvdyBhbiBhbGVydCwgd2hhdGV2ZXIgd29ya3MgZm9yIHlvdVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxufSk7XHJcblxyXG5mdW5jdGlvbiBhamF4VXBsb2FkSW1nKHBob3Rvcykge1xyXG4gIGFzeW5jLmVhY2hTZXJpZXMocGhvdG9zLCBmdW5jdGlvbihwaG90bywgY2FsbGJhY2tFYWNoKSB7XHJcblxyXG4gICAgJCgnLm1vZGFsX19sb2FkLWltZycpLmhpZGUoKTtcclxuICAgIHZhciBsaSA9ICQoJzxsaS8+JykuYWRkQ2xhc3MoJ2ltZy1pdGVtJykuYXBwZW5kVG8oJCgndWwjaW1nLWxpc3QnKSk7XHJcbiAgICB2YXIgSW1nQ29udCA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdpbWctY29udCcpLmFwcGVuZFRvKGxpKTtcclxuXHJcbiAgICB2YXIgYWpheERhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgIGFqYXhEYXRhLmFwcGVuZChcInBob3RvXCIsIHBob3RvKTtcclxuXHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IGxvY2F0aW9uLmhyZWYgKyAnYWRkSW1nLycsXHJcbiAgICAgIHR5cGU6ICRmb3JtLmF0dHIoJ21ldGhvZCcpLFxyXG4gICAgICBkYXRhOiBhamF4RGF0YSxcclxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAkZm9ybS5yZW1vdmVDbGFzcygnaXMtdXBsb2FkaW5nJyk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICB2YXIgc3JjID0gZGF0YS5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgc3JjID1TdHJpbmcoc3JjKS5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcclxuICAgICAgICBzcmMgPSBzcmMuc3Vic3RyKDYpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNyYyk7XHJcblxyXG4gICAgICAgIHZhciBpbWFnZSA9JCgnPGltZz4nLCB7XHJcbiAgICAgICAgICBzcmM6ICcvJytzcmN9KTtcclxuXHJcbiAgICAgICAgLy8g0JrQvtCz0LTQsCDQutCw0YDRgtC40L3QutCwINC30LDQs9GA0YPQt9C40YLRgdGPLCDRgdGC0LDQstC40Lwg0LXRkSDQvdCwINGE0L7QvVxyXG4gICAgICAgIGltYWdlLm9uKFwibG9hZFwiLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgSW1nQ29udC5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCAndXJsKFwiLycrc3JjKydcIiknKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGNhbGxiYWNrRWFjaCgpO1xyXG5cclxuICAgICAgICAvL3NvY2tldC5lbWl0KCdldmVudFNlcnZlcicsIHtkYXRhOiAnSGVsbG8gU2VydmVyJ30pO1xyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHJcblxyXG4gICAgICAgICRmb3JtLmFkZENsYXNzKCBkYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSA/ICdpcy1zdWNjZXNzJyA6ICdpcy1lcnJvcicgKTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhLnN1Y2Nlc3MpICRlcnJvck1zZy50ZXh0KGRhdGEuZXJyb3IpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gTG9nIHRoZSBlcnJvciwgc2hvdyBhbiBhbGVydCwgd2hhdGV2ZXIgd29ya3MgZm9yIHlvdVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfSk7XHJcbn0iLCIvLyA9PT09PT09PT09PSBBbGJ1bSBtb2R1bGUgPT09PT09PT09PT1cclxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0YHQutGA0LjQv9GC0Ysg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRjNGB0Y8g0YLQvtC70YzQutC+INC90LAg0YHRgtGA0LDQvdC40YbQtSDQsNC70YzQsdC+0LzQvtCyLlxyXG5cclxudmFyIGFsYnVtTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xyXG5cdC8vINCe0LHRitGP0LLQu9C10L3QuNC1INCx0LjQsdC70LjQvtGC0LXQutC4XHJcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcclxuXHJcbiAgLy8g0J7QsdGJ0LjQuNC1INC/0LXRgNC10LzQtdC90L3Ri9C1XHJcbiAgdmFyICRmb3JtID0gJCgnLnBvcHVwX19mb3JtJyk7XHJcbiAgdmFyICRtb2RhbEFkZEFsYnVtID0gJCgnLm1vZGFsX19hZGQtYWxidW0nKTtcclxuICB2YXIgYnV0dG9uID0gJ2FkZC1hbGJ1bV9fYnRuLXNhdmUnO1xyXG4gIHZhciBwb3B1cFRpbWUgPSA1MDAwO1xyXG4gIHZhciBhbGJ1bUNvdmVySW5wdXQgPSAkbW9kYWxBZGRBbGJ1bS5maW5kKCdpbnB1dFtuYW1lPVwiYWRkQWxidW1Db3ZlclwiXScpO1xyXG4gIHZhciBsb2FkZXIgPSAnbG9hZGVyJztcclxuXHJcblxyXG4gIC8vINCe0YLQutGA0YvRgtGMINC+0LrQvdC+INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INC40LfQvtCx0YDQsNC20LXQvdC40LlcclxuICB2YXIgb3BlblVwbG9hZEltZyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRiYXNlLmNoYW5nZUNsYXNzKCcubW9kYWxfYWRkLXBob3RvLCAubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdkZWwnKTtcclxuXHRcdCQoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykucmVwbGFjZVdpdGgoICQoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykgPSAkKCdpbnB1dFt0eXBlPVwiZmlsZVwiXScpLmNsb25lKCB0cnVlICkgKTtcclxuXHR9O1xyXG5cclxuXHQvLyDQl9Cw0LrRgNGL0YLRjCDQvtC60L3QviDQtNC70Y8g0LfQsNCz0YDRg9C30LrQuCDQuNC30L7QsdGA0LDQttC10L3QuNC5XHJcblx0dmFyIGNsb3NlVXBsb2FkID0gZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgbW9kYWwgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tb2RhbCcpO1xyXG5cdFx0YmFzZS5jaGFuZ2VDbGFzcyhtb2RhbCwnaGlkZScsJ2FkZCcpO1xyXG5cdFx0YmFzZS5jaGFuZ2VDbGFzcygnLm1vZGFsLW92ZXJsYXknLCdoaWRlJywnYWRkJyk7XHJcblx0XHQkKFwiLmltZy1saXN0XCIpLmVtcHR5KCk7XHJcblx0XHQkKCcubW9kYWxfX2xvYWQtaW1nJykuc2hvdygpO1xyXG5cdFx0JChcIi5zbGlkZXJfX2l0ZW1cIikucmVtb3ZlKCk7XHJcblx0XHQkKCcuc2xpZGVyX192aWV3JykuY3NzKCd0cmFuc2l0aW9uJyAsJ25vbmUnKTtcclxuXHR9O1xyXG5cclxuXHQvLyDQntGC0LrRgNGL0YLRjCDQvtC60L3QviDQtNC70Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDRhNC+0YLQviDQuCDQvtGC0L/RgNCw0LLQuNGC0YwgYWpheCDQv9GA0Lgg0YHQvtGF0YDQsNC90LXQvdC40Lgg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xyXG5cclxuXHR2YXIgb3BlbkVkaXRQaG90byA9IGZ1bmN0aW9uKCl7XHJcblx0XHQvLyDQntGC0LrRgNGL0YLRjCDQvtC60L3QvlxyXG5cdFx0YmFzZS5jaGFuZ2VDbGFzcygnLm1vZGFsX2VkaXQtcGhvdG8sIC5tb2RhbC1vdmVybGF5JywnaGlkZScsJ2RlbCcpO1xyXG5cclxuXHRcdC8vINCU0LDQvdC90YvQtSDQtNC70Y8gYWpheFxyXG5cdFx0dmFyICRmb3JtRWRpdEltZyA9ICQoJy5tb2RhbF9fZm9ybS1lZGl0Jyk7XHJcbiAgXHR2YXIgYnV0dG9uID0gJ2lucHV0W3R5cGUgPSBzdWJtaXRdJztcclxuICBcdHZhciBwb3B1cFRpbWUgPSA1MDAwO1xyXG5cdC8vINCe0YLQv9GA0LDQstC70Y/QtdC8IGFqYXgg0L3QsCA/Pz8/XHJcbiAgICAkKCcuc3VibWl0LWVkaXQnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0LTQu9GPIHBvcHVwXHJcbiAgICAgIHZhciBlcnJvckFycmF5ID0gYmFzZS52YWxpZGF0ZUZvcm0oJGZvcm1FZGl0SW1nKTsgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8INGC0LXQutGD0YnRg9GOINGE0L7RgNC80YMg0Lgg0LLRi9C00LDQtdC8INC80LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINC+0YjQuNCx0L7QulxyXG4gICAgICB2YXIgJGVycm9yQ29udGFpbmVyID0gJGZvcm1FZGl0SW1nLmZpbmQoJy5wb3B1cF9fZXJyb3InKTtcclxuICAgICAgaWYoZXJyb3JBcnJheS5sZW5ndGggPiAwKXtcdC8vINCV0YHQu9C4INCyINC80LDRgdGB0LjQstC1INC10YHRgtGMINC+0YjQuNCx0LrQuCwg0LfQvdCw0YfQuNGCINCy0YvQtNCw0LXQvCDQvtC60L3Qviwg0YEg0L3QvtC80LXRgNC+0Lwg0L7RiNC40LHQutC4XHJcbiAgICAgICAgZXJyb3JBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuICAgICAgICAgIGJhc2Uuc2hvd0Vycm9yKGluZGV4LCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfWVsc2V7IFxyXG4gICAgICBcdC8vINCV0YHQu9C4INC80LDRgdGB0LjQsiDQv9GD0YHRgtC+0LksINCy0YvQv9C+0LvQvdGP0LXQvCDQtNCw0LvRjNGI0LVcclxuICAgICAgICB2YXIgc2VydkFucyA9IGJhc2UuYWpheCgkZm9ybUVkaXRJbWcsJy9hbGJ1bS8/Pz8vJyk7XHJcbiAgICAgIH0gICAgXHJcblx0fSk7XHJcbn07XHJcblxyXG5cdC8vINCe0YLQvNC10L3QsCDQt9Cw0LPRgNGD0LfQutC4INC00LvRjyDQvtC00L3QvtC5INC60LDRgNGC0LjQvdC60LhcclxuXHR2YXIgX2NhbmNlbExvYWQgPSBmdW5jdGlvbihlKXtcclxuXHJcblxyXG5cdFx0dmFyIGNhbmNlbF9pZCA9IEpTT04uc3RyaW5naWZ5KHtpZDogJCh0aGlzKS5pbmRleCgpfSk7XHJcblx0XHRjb25zb2xlLmxvZyhjYW5jZWxfaWQpO1xyXG5cdFx0Ly9kcm9wcGVkRmlsZXNbY2FuY2VsX2lkXSA9IGZhbHNlO1xyXG5cdFx0Ly9hamF4RGF0YS5hcHBlbmQoXCJpZFwiLCBwaG90byk7XHJcblxyXG5cdFx0JC5hamF4KHtcclxuXHRcdFx0dHlwZTogXCJQT1NUXCIsXHJcblx0XHRcdHVybDogbG9jYXRpb24uaHJlZiArICdjbG9zZVVwbG9hZGVyT25lSW1nLycsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXHJcblx0XHRcdGRhdGE6IGNhbmNlbF9pZCxcclxuXHRcdFx0dGltZW91dDogMTAwMCxcclxuXHRcdFx0Y2FjaGU6IGZhbHNlLFxyXG5cdFx0XHRwcm9jZXNzRGF0YTogZmFsc2UsXHJcblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHQvL2Ryb3BwZWRGaWxlcyA9IGZhbHNlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRlcnJvcjogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Ly8gTG9nIHRoZSBlcnJvciwgc2hvdyBhbiBhbGVydCwgd2hhdGV2ZXIgd29ya3MgZm9yIHlvdVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKHRoaXMpLnJlbW92ZSgpO1xyXG5cdFx0aWYoJCgnLmltZy1saXN0IGxpJykubGVuZ3RoID09IDApe1xyXG5cdFx0XHQkKCcubW9kYWxfX2xvYWQtaW1nJykuc2hvdygpO1xyXG5cdFx0fVxyXG5cdFx0XHJcbn07XHJcblx0Ly8g0KTRg9C90LrRhtC40Y8g0L/RgNC4INGB0LrRgNC+0LvQu9C1XHJcblx0dmFyIF9maXhlZEFkZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyICRhbGJ1bUNvbnRhaW5lciA9ICQoJy5oZWFkZXItYWxidW1fX2NvbnRlbnQnKTtcclxuXHRcdHZhciAkYWxidW1CdG4gPSAkKCcuYnRuX2FsYnVtLWFkZCcpO1xyXG5cdFx0dmFyICRiYWNrU2lkZSA9ICQoJy5oZWFkZXItYWxidW1fX2Fib3V0LXNpZGVfYmFjaycpO1xyXG5cdFx0dmFyICRmcm9udFNpZGUgPSAkKCcuaGVhZGVyLWFsYnVtX19hYm91dC1zaWRlX2Zyb250Jyk7XHJcblx0XHR2YXIgZml4ZWQgPSAnZml4ZWQnO1xyXG5cdFx0dmFyIGhpZGUgPSAnaGlkZSc7XHJcblxyXG5cdFx0aWYoKCQoJ2h0bWwnKS5zY3JvbGxUb3AoKT49JGFsYnVtQ29udGFpbmVyLmhlaWdodCgpKSB8fCAoJCgnYm9keScpLnNjcm9sbFRvcCgpPj0kYWxidW1Db250YWluZXIuaGVpZ2h0KCkpKXtcclxuXHJcblx0XHRcdGlmICghKCRhbGJ1bUJ0bi5oYXNDbGFzcyhmaXhlZCkpKXtcclxuXHRcdCAgICBcdFx0YmFzZS5jaGFuZ2VDbGFzcygkYWxidW1CdG4sZml4ZWQsJ2FkZCcpO1xyXG5cdFx0ICAgIH1cclxuXHRcdCAgICRiYWNrU2lkZS5yZW1vdmVDbGFzcyhoaWRlKS5hZGRDbGFzcygnZml4ZWRIZWFkZXInKTtcclxuXHRcdCAgIGJhc2UuY2hhbmdlQ2xhc3MoJGZyb250U2lkZSxoaWRlLCdhZGQnKTtcclxuXHQgIH1cclxuXHQgIGVsc2V7XHJcblx0ICAgIFx0XHRpZiAoJGFsYnVtQnRuLmhhc0NsYXNzKGZpeGVkKSl7XHJcblx0XHQgICAgXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJGFsYnVtQnRuLGZpeGVkLCdkZWwnKTtcclxuXHRcdCAgICBcdH1cclxuXHRcdCAgICBcdCRiYWNrU2lkZS5hZGRDbGFzcyhoaWRlKS5yZW1vdmVDbGFzcygnZml4ZWRIZWFkZXInKTtcclxuXHRcdCAgICBcdGJhc2UuY2hhbmdlQ2xhc3MoJGZyb250U2lkZSxoaWRlLCdkZWwnKTtcclxuXHJcblx0ICAgIFx0fVxyXG5cdH07XHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8g0KHQu9Cw0LnQtNC10YBcclxudmFyIGZ1bmNTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuXHR2YXIgdHJhbnNpdGlvbkVuZCA9ICd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQnO1xyXG5cclxuXHRmdW5jdGlvbiBTbGlkZXIob3B0aW9ucykge1xyXG5cdFx0dmFyIGdhbGxlcnkgICAgID0gb3B0aW9ucy5lbGVtO1xyXG5cdFx0dmFyIHByZXYgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19jb250cm9sLS1wcmV2Jyk7XHJcblx0XHR2YXIgbmV4dCAgICAgICAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2NvbnRyb2wtLW5leHQnKTtcclxuXHJcblx0XHR2YXIgc2xpZGVzICAgICAgICAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2l0ZW0nKTtcclxuXHRcdC8vY29uc29sZS5sb2coc2xpZGVzKTtcclxuXHRcdHZhciBhY3RpdmVTbGlkZSAgICA9IHNsaWRlcy5maWx0ZXIoJy5zbGlkZXJfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0dmFyIHNsaWRlc0NudCAgICAgID0gc2xpZGVzLmxlbmd0aDtcclxuXHRcdHZhciBhY3RpdmVTbGlkZUlkeCA9IGFjdGl2ZVNsaWRlLmluZGV4KCk7XHJcblxyXG5cdFx0dmFyIGlzUmVhZHkgICAgPSB0cnVlO1xyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBzaG93ZWRTbGlkZShzbGlkZXIsIGlkeCkge1xyXG5cdFx0XHRzbGlkZXJcclxuXHRcdFx0XHQuZXEoaWR4KS5hZGRDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUnKVxyXG5cdFx0XHRcdC5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdzbGlkZXJfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGZ1bmN0aW9uIGRhdGFDaGFuZ2UoZGlyZWN0aW9uKSB7XHJcblx0XHQvLyBcdGFjdGl2ZVNsaWRlSWR4ID0gKGRpcmVjdGlvbiA9PT0gJ25leHQnKSA/IGdldElkeChhY3RpdmVTbGlkZUlkeCwgJ25leHQnKSA6IGdldElkeChhY3RpdmVTbGlkZUlkeCwgJ3ByZXYnKTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHRmdW5jdGlvbiBnZXRJZHgoY3VycmVudElkeCwgZGlyKSB7XHJcblx0XHRcdGlmKGRpciA9PT0gJ3ByZXYnKSB7XHJcblx0XHRcdFx0cmV0dXJuIChjdXJyZW50SWR4IC0gMSA8IDApID8gc2xpZGVzQ250IC0gMSA6IGN1cnJlbnRJZHggLSAxIDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihkaXIgPT09ICduZXh0Jykge1xyXG5cdFx0XHRcdHJldHVybiAoY3VycmVudElkeCArIDEgPj0gc2xpZGVzQ250KSA/IDAgOiBjdXJyZW50SWR4ICsgMSA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBjdXJyZW50SWR4O1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGNoYW5nZVNsaWRlKHNsaWRlcywgZGlyZWN0aW9uLCBjbGFzc05hbWUpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnRTbGlkZSAgICA9IHNsaWRlcy5maWx0ZXIoJy5zbGlkZXJfX2l0ZW0tLWFjdGl2ZScpO1xyXG5cdFx0XHR2YXIgY3VycmVudFNsaWRlSWR4ID0gY3VycmVudFNsaWRlLmluZGV4KCk7XHJcblx0XHRcdHZhciBuZXdTbGlkZUlkeDtcclxuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XHJcblx0XHRcdFx0IG5ld1NsaWRlSWR4ID0gZ2V0SWR4KGN1cnJlbnRTbGlkZUlkeCwgJ3ByZXYnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcclxuXHRcdFx0XHRuZXdTbGlkZUlkeCA9IGdldElkeChjdXJyZW50U2xpZGVJZHgsICduZXh0Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0JCgnLnNsaWRlcl9fdmlldycpLmNzcygndHJhbnNpdGlvbicgLCdoZWlnaHQgMXMnKTtcclxuXHRcdFx0Ly8g0J/QvtC00YHRgtGA0LDQuNCy0LDQtdC8INCy0YvRgdC+0YLRg1xyXG5cdFx0XHQkKCcuc2xpZGVyX192aWV3JykuaGVpZ2h0KHNsaWRlcy5lcShuZXdTbGlkZUlkeCkuY2hpbGRyZW4oKS5oZWlnaHQoKSk7XHJcblxyXG5cdFx0XHRzbGlkZXMuZXEobmV3U2xpZGVJZHgpXHJcblx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdC5vbmUodHJhbnNpdGlvbkVuZCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHQkKHRoaXMpXHJcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lIClcclxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKCdzbGlkZXJfX2l0ZW0tLWFjdGl2ZScpXHJcblx0XHRcdFx0XHRcdC50cmlnZ2VyKCdjaGFuZ2VkLXNsaWRlJyk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRjdXJyZW50U2xpZGVcclxuXHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXHJcblx0XHRcdFx0Lm9uZSh0cmFuc2l0aW9uRW5kLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ3NsaWRlcl9faXRlbS0tYWN0aXZlICcgKyBjbGFzc05hbWUpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQkKGRvY3VtZW50KS5vbignY2hhbmdlZC1zbGlkZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpc1JlYWR5ID0gdHJ1ZTtcclxuXHRcdH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHRcdHRoaXMucHJldiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiggIWlzUmVhZHkgKSByZXR1cm47XHJcblx0XHRcdGlzUmVhZHkgPSBmYWxzZTtcclxuXHJcblx0XHRcdGNoYW5nZVNsaWRlKHNsaWRlcywgJ3ByZXYnLCAnc2xpZGVyX19pdGVtLS1hbmltYXRlLWZhZGUnKTtcclxuXHRcdFx0Ly8gZGF0YUNoYW5nZSgncHJldicpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5uZXh0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKCAhaXNSZWFkeSApIHJldHVybjtcclxuXHRcdFx0aXNSZWFkeSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0Y2hhbmdlU2xpZGUoc2xpZGVzLCAnbmV4dCcsICdzbGlkZXJfX2l0ZW0tLWFuaW1hdGUtZmFkZScpO1xyXG5cdFx0XHQvLyBkYXRhQ2hhbmdlKCduZXh0Jyk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHRwcmV2Lm9uKCdjbGljaycsIHRoaXMucHJldik7XHJcblx0XHRuZXh0Lm9uKCdjbGljaycsIHRoaXMubmV4dCk7XHJcblx0fSAvLyBTbGlkZXJcclxuXHJcblxyXG5cclxuXHR2YXIgc2xpZGVyID0gbmV3IFNsaWRlcih7XHJcblx0XHRlbGVtOiAkKCcjc2xpZGVyJylcclxuXHR9KTtcclxufTtcclxuLy8g0J7RgtC60YDRi9GC0Ywg0YHQu9Cw0LnQtNC10YBcclxuXHJcblx0dmFyIG9wZW5TbGlkZXIgPSBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJy5tb2RhbC0tc2xpZGVyLCAubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdkZWwnKVxyXG5cdFx0Ly8g0L3QsNGF0L7QtNC40Lwg0LLRgdC1INC60LDRgNGC0LjQvdC60Lgg0LjQtyDQsNC70YzQsdC+0LzQsFxyXG5cdFx0dmFyIGltYWdlcyA9ICQoJy5waG90by1jYXJkX19oZWFkJyksXHJcblx0XHRcdFx0Y3VycmVudEltZyA9ICQodGhpcykuY2xvc2VzdCgnLnBob3RvLWNhcmRfX2hlYWQnKTtcclxuXHJcblx0XHQkKCcucGhvdG8tY2FyZF9faGVhZCcpLmVhY2goZnVuY3Rpb24oaSwgaW1nKXtcclxuXHRcdFx0XHR2YXIgdXJsID0gKCQodGhpcykuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoJywnKVswXSk7XHJcblx0XHRcdFx0dmFyIHNyYyA9IHVybC5zdWJzdHIoNSwgMzkgKTtcclxuXHRcdFx0XHR2YXIgY29udCA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdzbGlkZXJfX2l0ZW0nKS5hcHBlbmRUbygkKCcuc2xpZGVyX192aWV3JykpO1xyXG5cclxuXHRcdFx0XHR2YXIgaW1nID0gJCgnPGltZz4nKS5hZGRDbGFzcygnc2xpZGVyX19pbWcnKS5hcHBlbmRUbyhjb250KS5hdHRyKCdzcmMnLHNyYyk7XHJcblxyXG5cdFx0XHRcdGlmICh1cmw9PWN1cnJlbnRJbWcuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJykuc3BsaXQoJywnKVswXSl7XHJcblx0XHRcdFx0XHRjb250LnJlbW92ZUNsYXNzKCdzbGlkZXJfX2l0ZW0tLWxvYWRpbmcnKS5hZGRDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0JCgnLnNsaWRlcl9fdmlldycpLmhlaWdodChjb250LmNoaWxkcmVuKCkuaGVpZ2h0KCkpO1xyXG5cdFx0XHRcdFx0IGNvbnQubmV4dCgpLmFkZENsYXNzKCdzbGlkZXJfX2l0ZW0tLWxvYWRpbmcnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0fSlcclxuXHRcdGZ1bmNTbGlkZXIoKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdCQoJy5idG5fZWRpdC1waG90bycpLm9uKCdjbGljaycsIG9wZW5FZGl0UGhvdG8pO1xyXG5cdFx0JCgnLmJ0bl9hbGJ1bS1hZGQnKS5vbignY2xpY2snLCBvcGVuVXBsb2FkSW1nKTtcclxuXHRcdCQoJy5tb2RhbF9faGVhZGVyLWNsb3NlJykub24oJ2NsaWNrJywgY2xvc2VVcGxvYWQpO1xyXG5cdFx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfZml4ZWRBZGQpO1xyXG5cdFx0JCgnYm9keScpLm9uKCdjbGljaycsJy5pbWctaXRlbScsX2NhbmNlbExvYWQpO1xyXG5cdFx0JCgnLmxvdXBlJykub24oJ2NsaWNrJywgb3BlblNsaWRlcik7XHJcblx0fTtcclxuXHJcblxyXG5cclxuICByZXR1cm4ge1xyXG4gIFx0Y2xvc2U6IGZ1bmN0aW9uKCl7XHJcbiAgXHRcdHJldHVybiBjbG9zZVVwbG9hZDtcclxuICBcdH0sXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBcdF9zZXRVcExpc3RuZXJzKCk7XHJcbiAgICB9LFxyXG5cclxuICB9O1xyXG59KSgpOyIsImZ1bmN0aW9uIGluaXRQb3B1cCAoKSB7XHJcblxyXG5cdC8vINCk0YPQvdC60YbQuNGPINC+0YLQutGA0YvRgtC40Y8g0L/QvtC/0LDQv9CwXHJcblx0ZnVuY3Rpb24gcG9wdXAoaWQsIGFjdGlvbikge1xyXG5cdFx0dmFyIGJvZHkgICAgICA9ICQoJ2JvZHknKTtcclxuXHRcdHZhciBjbGFzc05hbWUgPSAnaGlkZSc7XHJcblxyXG5cdFx0aWYoYWN0aW9uID09ICdvcGVuJykge1xyXG5cdFx0XHRib2R5LmFkZENsYXNzKCduby1zY3JvbGwnKTtcclxuXHJcblx0XHRcdCQoJyMnICsgaWQpXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdC5wYXJlbnQoKVxyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKTtcclxuXHRcdH0gZWxzZSBpZihhY3Rpb24gPT0gJ2Nsb3NlJykge1xyXG5cclxuXHRcdFx0Ym9keS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHJcblxyXG5cdFx0XHRpZihpZCA9PSAnYWxsJykge1xyXG5cdFx0XHRcdCQoJy5tb2RhbCcpXHJcblx0XHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXHJcblx0XHRcdFx0XHQucGFyZW50KClcclxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcjJyArIGlkKVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdFx0LnBhcmVudCgpXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyggY2xhc3NOYW1lICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyDQntGC0LrRgNGL0YLQuNC1INC/0L7Qv9Cw0L/QvtCyINC/0L4g0LrQu9C40LrRgyDQvdCwINGN0LvQtdC80LXQvdGC0Ysg0YEg0LDRgtGA0LjQsdGD0YLQvtC8IGRhdGEtbW9kYWxcclxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtbW9kYWxdJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR2YXIgJGVsICAgICA9ICQodGhpcyk7XHJcblx0XHRcdHZhciBwb3B1cElkID0gJGVsLmF0dHIoJ2RhdGEtbW9kYWwnKTtcclxuXHJcblx0XHRcdHBvcHVwKCdhbGwnLCAnY2xvc2UnKTtcclxuXHRcdFx0cG9wdXAocG9wdXBJZCwgJ29wZW4nKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vINCh0L7QsdGL0YLQuNGPINC/0YDQuCDQutC70LjQutC1INGN0LvQtdC80LXQvdGCINGBINCw0YLRgNC40LHRg9GC0L7QvCBkYXRhLWFjdGlvbj1cImNsb3NlXCJcclxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtYWN0aW9uPVwiY2xvc2VcIl0nLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHZhciBidG4gICA9ICQodGhpcyk7XHJcblx0XHRcdHZhciBtb2RhbCA9IGJ0bi5jbG9zZXN0KCcubW9kYWwnKTtcclxuXHJcblx0XHRcdHBvcHVwKG1vZGFsLmF0dHIoJ2lkJyksICdjbG9zZScpO1xyXG5cdH0pO1xyXG5cclxufSAvLyBpbml0UG9wdXAoKVxyXG5cclxuXHJcblxyXG5pbml0UG9wdXAoKTsiLCIvLyDQodC70LDQudC00LXRgFxyXG4oZnVuY3Rpb24oKSB7XHJcblx0dmFyIHRyYW5zaXRpb25FbmQgPSAndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJztcclxuXHJcblx0ZnVuY3Rpb24gU2xpZGVyKG9wdGlvbnMpIHtcclxuXHRcdHZhciBnYWxsZXJ5ICAgICA9IG9wdGlvbnMuZWxlbTtcclxuXHRcdHZhciBwcmV2ICAgICAgICA9IGdhbGxlcnkuZmluZCgnLnNsaWRlcl9fY29udHJvbC0tcHJldicpO1xyXG5cdFx0dmFyIG5leHQgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19jb250cm9sLS1uZXh0Jyk7XHJcblxyXG5cdFx0dmFyIHNsaWRlcyAgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19pdGVtJyk7XHJcblx0XHR2YXIgYWN0aXZlU2xpZGUgICAgPSBzbGlkZXMuZmlsdGVyKCcuc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdHZhciBzbGlkZXNDbnQgICAgICA9IHNsaWRlcy5sZW5ndGg7XHJcblx0XHR2YXIgYWN0aXZlU2xpZGVJZHggPSBhY3RpdmVTbGlkZS5pbmRleCgpO1xyXG5cclxuXHRcdHZhciBpc1JlYWR5ICAgID0gdHJ1ZTtcclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gc2hvd2VkU2xpZGUoc2xpZGVyLCBpZHgpIHtcclxuXHRcdFx0c2xpZGVyXHJcblx0XHRcdFx0LmVxKGlkeCkuYWRkQ2xhc3MoJ3NsaWRlcl9faXRlbS0tYWN0aXZlJylcclxuXHRcdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBmdW5jdGlvbiBkYXRhQ2hhbmdlKGRpcmVjdGlvbikge1xyXG5cdFx0Ly8gXHRhY3RpdmVTbGlkZUlkeCA9IChkaXJlY3Rpb24gPT09ICduZXh0JykgPyBnZXRJZHgoYWN0aXZlU2xpZGVJZHgsICduZXh0JykgOiBnZXRJZHgoYWN0aXZlU2xpZGVJZHgsICdwcmV2Jyk7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0SWR4KGN1cnJlbnRJZHgsIGRpcikge1xyXG5cdFx0XHRpZihkaXIgPT09ICdwcmV2Jykge1xyXG5cdFx0XHRcdHJldHVybiAoY3VycmVudElkeCAtIDEgPCAwKSA/IHNsaWRlc0NudCAtIDEgOiBjdXJyZW50SWR4IC0gMSA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZGlyID09PSAnbmV4dCcpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGN1cnJlbnRJZHggKyAxID49IHNsaWRlc0NudCkgPyAwIDogY3VycmVudElkeCArIDEgO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gY3VycmVudElkeDtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBjaGFuZ2VTbGlkZShzbGlkZXMsIGRpcmVjdGlvbiwgY2xhc3NOYW1lKSB7XHJcblx0XHRcdHZhciBjdXJyZW50U2xpZGUgICAgPSBzbGlkZXMuZmlsdGVyKCcuc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdFx0dmFyIGN1cnJlbnRTbGlkZUlkeCA9IGN1cnJlbnRTbGlkZS5pbmRleCgpO1xyXG5cdFx0XHR2YXIgbmV3U2xpZGVJZHg7XHJcblxyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAncHJldicpIHtcclxuXHRcdFx0XHQgbmV3U2xpZGVJZHggPSBnZXRJZHgoY3VycmVudFNsaWRlSWR4LCAncHJldicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICduZXh0Jykge1xyXG5cdFx0XHRcdG5ld1NsaWRlSWR4ID0gZ2V0SWR4KGN1cnJlbnRTbGlkZUlkeCwgJ25leHQnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2xpZGVzLmVxKG5ld1NsaWRlSWR4KVxyXG5cdFx0XHRcdC5hZGRDbGFzcyggY2xhc3NOYW1lIClcclxuXHRcdFx0XHQub25lKHRyYW5zaXRpb25FbmQsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZSApXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHQudHJpZ2dlcignY2hhbmdlZC1zbGlkZScpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Y3VycmVudFNsaWRlXHJcblx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdC5vbmUodHJhbnNpdGlvbkVuZCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdzbGlkZXJfX2l0ZW0tLWFjdGl2ZSAnICsgY2xhc3NOYW1lKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0JChkb2N1bWVudCkub24oJ2NoYW5nZWQtc2xpZGUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aXNSZWFkeSA9IHRydWU7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0XHR0aGlzLnByZXYgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoICFpc1JlYWR5ICkgcmV0dXJuO1xyXG5cdFx0XHRpc1JlYWR5ID0gZmFsc2U7XHJcblxyXG5cdFx0XHRjaGFuZ2VTbGlkZShzbGlkZXMsICdwcmV2JywgJ3NsaWRlcl9faXRlbS0tYW5pbWF0ZS1mYWRlJyk7XHJcblx0XHRcdC8vIGRhdGFDaGFuZ2UoJ3ByZXYnKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMubmV4dCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiggIWlzUmVhZHkgKSByZXR1cm47XHJcblx0XHRcdGlzUmVhZHkgPSBmYWxzZTtcclxuXHJcblx0XHRcdGNoYW5nZVNsaWRlKHNsaWRlcywgJ25leHQnLCAnc2xpZGVyX19pdGVtLS1hbmltYXRlLWZhZGUnKTtcclxuXHRcdFx0Ly8gZGF0YUNoYW5nZSgnbmV4dCcpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0cHJldi5vbignY2xpY2snLCB0aGlzLnByZXYpO1xyXG5cdFx0bmV4dC5vbignY2xpY2snLCB0aGlzLm5leHQpO1xyXG5cdH0gLy8gU2xpZGVyXHJcblxyXG5cclxuXHJcblx0dmFyIHNsaWRlciA9IG5ldyBTbGlkZXIoe1xyXG5cdFx0ZWxlbTogJCgnI3NsaWRlcicpXHJcblx0fSk7XHJcbn0pKCk7IiwiLy8gPT09PT09PT09PT0gYWpheC1Mb2dpbi1jb3ZlciBtb2R1bGUgPT09PT09PT09PT1cclxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0LDQvdC40LzQsNGG0LjRjiDQtNC70Y8g0LHQu9C+0LrQsCDQsNCy0YLQvtGA0LjQt9Cw0YbQuC5cclxuXHJcblxyXG52YXIgYWpheExvZ2luQ292ZXJNb2R1bGUgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG5cdC8vINCT0LvQvtCx0LDQu9GM0L3Ri9C1INC/0LXRgNC10LzQtdC90L3Ri9C1INC80L7QtNGD0LvRjy5cclxuICB2YXIgYmFzZSA9IG5ldyBCYXNlTW9kdWxlO1xyXG4gIC8vINCf0LXRgNC10LzQtdC90L3Ri9C1IFxyXG4gIHZhciAkZm9ybSA9ICQoJy5wb3B1cF9fZm9ybScpO1xyXG5cdHZhciAkZm9ybUxvZ2luID0gJGZvcm0uZmlsdGVyKCcucG9wdXBfX2Zvcm0tbG9naW4nKTtcclxuXHR2YXIgJGZvcm1SZWcgPSAkZm9ybS5maWx0ZXIoJy5wb3B1cF9fZm9ybS1yZWdpc3RyYXRpb24nKTtcclxuXHR2YXIgJGZvcm1SZWNvdmVyID0gJGZvcm0uZmlsdGVyKCcucG9wdXBfX2Zvcm0tcmVjb3ZlcicpO1xyXG5cdHZhciBidXR0b24gPSAnaW5wdXRbdHlwZSA9IHN1Ym1pdF0nO1xyXG5cdHZhciBwb3B1cFRpbWUgPSA1MDAwO1xyXG5cclxuXHQvLyDQmtC90L7Qv9C60LhcclxuXHJcblx0dmFyIGxvZ2luQnRuID0gJGZvcm1Mb2dpbi5maW5kKGJ1dHRvbik7XHJcblx0dmFyIHJlZ0J0biA9ICRmb3JtUmVnLmZpbmQoYnV0dG9uKTtcclxuXHR2YXIgcmVjb3ZlckJ0biA9ICRmb3JtUmVjb3Zlci5maW5kKGJ1dHRvbik7XHJcblxyXG5cclxuXHJcblx0IFx0Ly8g0J7RgtC/0YDQsNCy0LvRj9C10LwgYWpheCDQvdCwIGxvZ2luXHJcblx0dmFyIGxvZ2luID0gZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR2YXIgJHRoaXNGb3JtID0gJCh0aGlzKS5jbG9zZXN0KCdmb3JtJyk7XHJcblx0XHR2YXIgJGVycm9yQ29udGFpbmVyID0gJHRoaXNGb3JtLmZpbmQoJy5wb3B1cF9fZXJyb3InKTtcclxuXHRcdHZhciBlcnJvckFycmF5ID0gYmFzZS52YWxpZGF0ZUZvcm0oJHRoaXNGb3JtKTsgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8INGC0LXQutGD0YnRg9GOINGE0L7RgNC80YMg0Lgg0LLRi9C00LDQtdC8INC80LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINC+0YjQuNCx0L7QulxyXG5cdFx0XHRpZihlcnJvckFycmF5Lmxlbmd0aCA+IDApe1x0Ly8g0JXRgdC70Lgg0LIg0LzQsNGB0YHQuNCy0LUg0LXRgdGC0Ywg0L7RiNC40LHQutC4LCDQt9C90LDRh9C40YIg0LLRi9C00LDQtdC8INC+0LrQvdC+LCDRgSDQvdC+0LzQtdGA0L7QvCDQvtGI0LjQsdC60LhcclxuICBcdFx0XHRlcnJvckFycmF5LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG4gIFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG4gIFx0XHRcdH0pO1xyXG4gIFx0XHRcdH1lbHNleyAvLyDQldGB0LvQuCDQvNCw0YHRgdC40LIg0L/Rg9GB0YLQvtC5LCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQsNC70YzRiNC1XHJcbiAgXHRcdFx0c2VydkFucyA9IGJhc2UuYWpheCgkdGhpc0Zvcm0sJy9sb2dpbi8nKTtcclxuICBcdFx0XHRzZXJ2QW5zLmRvbmUoZnVuY3Rpb24oYW5zKXtcclxuICBcdFx0XHRcdGlmKCFhbnMuc3RhdHVzKXtcclxuICBcdFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoYW5zLm1lc3NhZ2UsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG4gIFx0XHRcdFx0fWVsc2V7XHJcbiAgXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XHJcbiAgXHRcdFx0XHR9XHJcbiAgXHRcdFx0fSk7XHJcbiAgXHRcdH1cclxuICB9XHJcblxyXG4gIC8vINCe0YLQv9GA0LDQstC70Y/QtdC8IGFqYXgg0L3QsCByZWdcclxuXHJcbiAgdmFyIHJlZ2lzdHJhdGlvbiA9IGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0dmFyICR0aGlzRm9ybSA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpO1xyXG5cdFx0dmFyIGVycm9yQXJyYXkgPSBiYXNlLnZhbGlkYXRlRm9ybSgkdGhpc0Zvcm0pOyAvLyDQn9GA0L7QstC10YDRj9C10Lwg0YLQtdC60YPRidGD0Y4g0YTQvtGA0LzRgyDQuCDQstGL0LTQsNC10Lwg0LzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0L7RiNC40LHQvtC6XHJcblx0XHR2YXIgJGVycm9yQ29udGFpbmVyID0gJHRoaXNGb3JtLmZpbmQoJy5wb3B1cF9fZXJyb3InKTtcclxuXHRcdGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxyXG5cdFx0XHRlcnJvckFycmF5LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG5cdFx0XHRcdGJhc2Uuc2hvd0Vycm9yKGluZGV4LCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9ZWxzZXsgLy8g0JXRgdC70Lgg0LzQsNGB0YHQuNCyINC/0YPRgdGC0L7QuSwg0LLRi9C/0L7Qu9C90Y/QtdC8INC00LDQu9GM0YjQtVxyXG5cdFx0XHRzZXJ2QW5zID0gYmFzZS5hamF4KCR0aGlzRm9ybSwnL3JlZy8nKTtcclxuXHRcdFx0c2VydkFucy5kb25lKGZ1bmN0aW9uKGFucyl7XHJcblx0XHRcdFx0aWYoIWFucy5zdGF0dXMpe1xyXG5cdFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoYW5zLm1lc3NhZ2UsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG4gIH1cclxuXHJcbiAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10LwgYWpheCDQvdCwIHJlY292ZXJcclxuXHJcbiAgdmFyIHJlY292ZXIgPSBmdW5jdGlvbihlKXtcclxuICBcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHQgIFx0XHR2YXIgJHRoaXNGb3JtID0gJCh0aGlzKS5jbG9zZXN0KCdmb3JtJyk7XHJcblx0ICBcdFx0Ly8g0J/QsNGA0LDQvNC10YLRgNGLINC00LvRjyBwb3B1cFxyXG5cdCAgXHRcdHZhciBlcnJvckFycmF5ID0gYmFzZS52YWxpZGF0ZUZvcm0oJHRoaXNGb3JtKTsgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8INGC0LXQutGD0YnRg9GOINGE0L7RgNC80YMg0Lgg0LLRi9C00LDQtdC8INC80LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINC+0YjQuNCx0L7QulxyXG5cdCAgXHRcdHZhciAkZXJyb3JDb250YWluZXIgPSAkdGhpc0Zvcm0uZmluZCgnLnBvcHVwX19lcnJvcicpO1xyXG5cdCAgXHRcdGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxyXG5cdCAgXHRcdFx0ZXJyb3JBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuXHQgIFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG5cdCAgXHRcdFx0fSk7XHJcblx0ICBcdFx0fWVsc2V7IC8vINCV0YHQu9C4INC80LDRgdGB0LjQsiDQv9GD0YHRgtC+0LksINCy0YvQv9C+0LvQvdGP0LXQvCDQtNCw0LvRjNGI0LVcclxuXHQgIFx0XHRcdHNlcnZBbnMgPSBiYXNlLmFqYXgoJHRoaXNGb3JtLCcvcmVjb3Zlci8nKTtcclxuXHQgIFx0XHRcdHNlcnZBbnMuZG9uZShmdW5jdGlvbihhbnMpe1xyXG5cdCAgXHRcdFx0XHRpZighYW5zLnN0YXR1cyl7XHJcblx0ICBcdFx0XHRcdFx0cmV0dXJuIGJhc2Uuc2hvd0Vycm9yKGFucy5tZXNzYWdlLCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuXHQgIFx0XHRcdFx0fWVsc2V7XHJcblx0ICBcdFx0XHRcdFx0YmFzZS5jbGVhcklucHV0cygkdGhpc0Zvcm0pO1xyXG5cdCAgXHRcdFx0XHRcdHJldHVybiBiYXNlLnNob3dFcnJvcihhbnMubWVzc2FnZSwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcblx0ICBcdFx0XHRcdFx0XHJcblx0ICBcdFx0XHRcdH1cclxuXHQgIFx0XHRcdH0pO1xyXG5cdCAgXHRcdH1cclxuICB9XHJcblxyXG4gIFx0XHJcblxyXG4gIFx0XHJcbiAgXHRcdFxyXG5cclxuXHJcblxyXG4gXHJcbiAgdmFyIF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24oKXtcclxuICBcdGxvZ2luQnRuLm9uKCdjbGljaycsbG9naW4pO1xyXG4gIFx0cmVnQnRuLm9uKCdjbGljaycscmVnaXN0cmF0aW9uKTtcclxuICBcdHJlY292ZXJCdG4ub24oJ2NsaWNrJyxyZWNvdmVyKVxyXG4gIH1cclxuIFxyXG5cclxuXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgXHRfc2V0VXBMaXN0bmVycygpO1xyXG4gICAgICB9XHJcblxyXG4gIH07XHJcbn0pKCk7IiwiLy8gPT09PT09PT09PT0gYWpheCBoZWFkZXIgbW9kdWxlID09PT09PT09PT09XHJcbi8vINCt0YLQvtGCINC80L7QtNGD0LvRjCDRgdC+0LTQtdGA0LbQuNGCINCyINGB0LXQsdC1IGFqYXgg0L/RgNC40LzQtdC90Y/QtdC80YvQtSDQuiDRiNCw0L/QutCw0Lwg0YHRgtGA0LDQvdC40YbRi1xyXG5cclxudmFyIGFqYXhIZWFkZXJNb2R1bGUgPSAoZnVuY3Rpb24oKSB7XHJcblx0Ly8g0J7QsdGK0Y/QstC70LXQvdC40LUg0LHQuNCx0LvQuNC+0YLQtdC60LhcclxuICB2YXIgYmFzZSA9IG5ldyBCYXNlTW9kdWxlO1xyXG5cclxuICAvLyDQntCx0YnQuNC1XHJcbiAgdmFyICRoZWFkZXJNYWluID0gJCgnLmhlYWRlci1tYWluJyk7XHJcbiAgdmFyICRoZWFkZXJBbGJ1bSA9ICQoJy5oZWFkZXItYWxidW0nKTtcclxuICB2YXIgJGZvb3RlciA9ICQoJy5mb290ZXInKTtcclxuICB2YXIgdXJsUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuICB2YXIgY2xvc2VFZGl0SGVhZGVyID0gaGVhZGVyTW9kdWxlLmNsb3NlRWRpdEhlYWRlcigpO1xyXG4gIHZhciBoZWFkZXJGcm9udCA9ICRoZWFkZXJNYWluLmZpbmQoJy5oZWFkZXJfX3NlY3Rpb25fbWFpbi1mcm9udCcpO1xyXG4gIHZhciBoZWFkZXJCYWNrID0gJGhlYWRlck1haW4uZmluZCgnLmhlYWRlcl9fc2VjdGlvbl9tYWluLWJhY2snKTtcclxuICB2YXIgYWpheEZsYWcgPSBmYWxzZTtcclxuICB2YXIgdGhpc0FqYXg7XHJcblxyXG4gIHZhciBuZXdCYWNrR3JvdW5kO1xyXG5cclxuXHJcblxyXG4gIC8vINCa0L3QvtC/0LrQuFxyXG4gIHZhciBzYXZlQnRuID0gJGhlYWRlck1haW4uZmluZCgnLmJ0bi0tc2F2ZScpO1xyXG4gIHZhciB1cGxvYWRBdmF0YXIgPSAkaGVhZGVyTWFpbi5maW5kKCcudXNlci1ibG9ja19fcGhvdG8tZWRpdCcpO1xyXG4gIHZhciB1cGxvYWRCZyA9ICRoZWFkZXJNYWluLmZpbmQoJy5oZWFkZXJfX3BhcnQtLXppcF9tYWluIC51cGxvYWQnKTtcclxuICB2YXIgdXBsb2FkQmdBbGJ1bSA9ICRoZWFkZXJBbGJ1bS5maW5kKCcudXBsb2FkJyk7XHJcbiAgdmFyIGNhbmNlbEJ0biA9ICRoZWFkZXJNYWluLmZpbmQoJyNjYW5jZWxfZWRpdF9oZWFkZXInKTtcclxuXHJcbiAgdmFyIHNhdmVCdG5BbGJ1bSA9ICRoZWFkZXJBbGJ1bS5maW5kKCcuYnRuLS1zYXZlJyk7XHJcblxyXG5cclxuXHJcbiAgLy/QmtC70LDRgdGB0YtcclxuXHJcbiAgdmFyIGNsYXNzQ2FuY2VsID0gJ2NhbmNlbCc7XHJcblxyXG4gICAvLyDQlNC10YTQvtC70L3Ri9C1INGB0YLQuNC70LhcclxuXHJcbiAgdmFyIGhlYWRlckJnU3R5bGUgPSAkaGVhZGVyTWFpbi5hdHRyKCdzdHlsZScpO1xyXG4gIHZhciBmb290ZXJCZ1N0eWxlID0gJGZvb3Rlci5hdHRyKCdzdHlsZScpO1xyXG5cclxuXHJcblxyXG5cclxuICAgLy8g0KTRg9C90LrRhtC40LhcclxuXHJcblxyXG4gIC8vINCX0LDQsdC70L7QutC40YDQvtCy0LDRgtGMINCy0YvQsdC+0YAg0YTQsNC50LvQsFxyXG4gIHZhciBsb2NrU2VsRmlsZSA9IGZ1bmN0aW9uKGUpe1xyXG4gIFx0aWYoYWpheEZsYWcpe1xyXG4gIFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgXHR9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8g0J/RgNC10LLRjNGOINCw0LLQsNGC0YLQsNGA0LrQuFxyXG4gIHZhciBjaGFuZ2VBdmF0YXIgPSBmdW5jdGlvbigpe1xyXG4gIFx0aWYoYWpheEZsYWcpe1xyXG4gIFx0XHRhamF4RmxhZyA9IGZhbHNlO1xyXG4gIFx0XHRyZXR1cm47XHJcbiAgXHR9XHJcbiAgXHRhamF4RmxhZyA9IHRydWU7XHJcbiAgXHR2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICBcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcbiAgXHR2YXIgYmxvY2tQaG90byA9ICR0aGlzLmNsb3Nlc3QoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gIFx0dmFyIGZpbGVJbnB1dCA9ICR0aGlzLmZpbmQoJ2lucHV0W25hbWU9XCJwaG90b1wiXScpO1xyXG4gIFx0dmFyIHBob3RvID0gZmlsZUlucHV0WzBdLmZpbGVzWzBdO1xyXG4gIFx0aWYoIXBob3RvKXtcclxuICBcdFx0YWpheEZsYWcgPSBmYWxzZTtcclxuICAgICAgdmFyIGZyb250QXZhdGFyID0gaGVhZGVyRnJvbnQuZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvJykuYXR0cignc3R5bGUnKTtcclxuICBcdFx0YmxvY2tQaG90by5hdHRyKCdzdHlsZScsZnJvbnRBdmF0YXIpO1xyXG4gIFx0XHRyZXR1cm47XHJcbiAgXHR9XHJcblxyXG4gIFx0YmxvY2tQaG90by5hZGRDbGFzcygnbG9hZGVyJyk7XHJcbiAgXHRmb3JtRGF0YS5hcHBlbmQoXCJ1c2VyQXZhdGFyXCIscGhvdG8pO1xyXG5cclxuICBcdHRoaXNBamF4ID0gJC5hamF4KHtcclxuICAgICAgdXJsOiB1cmxQYXRoICsgJ2NoYW5nZVBob3RvLycsXHJcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICBkYXRhOiBmb3JtRGF0YSxcclxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgIFx0YWpheEZsYWcgPSBmYWxzZTtcclxuICAgICAgICBibG9ja1Bob3RvLnJlbW92ZUNsYXNzKCdsb2FkZXInKTtcclxuICAgICAgICBibG9ja1Bob3RvLmNzcyh7XHJcbiAgICAgICAgXHQnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoJysgcmVzLm5ld0NvdmVyICsnKSdcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgXHR9KTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgLy8g0J/RgNC10LLRjNGOINCx0LXQutGA0LDRg9C90LTQsFxyXG4gIHZhciBjaGFuZ2VCYWNrR3JvdW5kID0gZnVuY3Rpb24oYnRuLGhlYWRlcil7XHJcbiAgaWYoYWpheEZsYWcpe1xyXG4gIFx0cmV0dXJuO1xyXG4gIH1cclxuICBhamF4RmxhZyA9IHRydWU7XHJcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgdmFyICR0aGlzID0gYnRuO1xyXG4gIHZhciBmaWxlSW5wdXQgPSAkdGhpcy5maW5kKCdpbnB1dFtuYW1lPVwiYmdcIl0nKTtcclxuICB2YXIgcGhvdG8gPSBmaWxlSW5wdXRbMF0uZmlsZXNbMF07XHJcbiAgdmFyIGJhY2tncm91bmQgPSAnJztcclxuICBpZighcGhvdG8pe1xyXG4gICAgLy92YXIgaGVhZGVyQmFja2dyb3VuZCA9IGF0dHIoJ3N0eWxlJyk7XHJcbiAgXHQgaGVhZGVyLmNzcyh7XHJcbiAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnIDogJ3VybCgnKyBuZXdCYWNrR3JvdW5kICsnKSdcclxuICAgICAgfSk7XHJcbiAgICAgJGZvb3Rlci5jc3Moe1xyXG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJyA6ICd1cmwoJysgbmV3QmFja0dyb3VuZCArJyknXHJcbiAgICAgIH0pO1xyXG4gIFx0YWpheEZsYWcgPSBmYWxzZTtcclxuICBcdHJldHVybjtcclxuICB9XHJcblxyXG4gIGlmKGhlYWRlciA9PSAkaGVhZGVyQWxidW0pe1xyXG4gICAgYmFja2dyb3VuZCA9IFwibmV3QWxib21Db3ZlclwiO1xyXG4gIH1lbHNlIGlmKGhlYWRlciA9PSAkaGVhZGVyTWFpbil7XHJcbiAgICBiYWNrZ3JvdW5kID0gXCJ1c2VyQmFja0dyb3VuZFwiO1xyXG4gIH1cclxuXHJcbiAgaGVhZGVyLmZpbmQoJy5wcmVsb2FkX19jb250YWluZXInKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgZm9ybURhdGEuYXBwZW5kKGJhY2tncm91bmQscGhvdG8pO1xyXG4gIHRoaXNBamF4ID0gJC5hamF4KHtcclxuICAgIHVybDogdXJsUGF0aCArICdjaGFuZ2VQaG90by8nLFxyXG4gICAgdHlwZTogXCJQT1NUXCIsXHJcbiAgICBkYXRhOiBmb3JtRGF0YSxcclxuICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgIGhlYWRlci5maW5kKCcucHJlbG9hZF9fY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXHJcbiAgICAgIGFqYXhGbGFnID0gZmFsc2U7XHJcbiAgICAgIFx0aGVhZGVyLmNzcyh7XHJcbiAgICAgIFx0XHQnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoJysgcmVzLm5ld0NvdmVyICsnKSdcclxuICAgICAgXHR9KVxyXG4gICAgICAgICRmb290ZXIuY3NzKHtcclxuICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJzogJ3VybCgnKyByZXMubmV3Q292ZXIgKycpJ1xyXG4gICAgICAgIH0pICBcclxuXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgLy8g0KHQutC40LTRi9Cy0LDQtdC8INCx0LXQutGA0LDRg9C90LQg0Lgg0LDQstCw0YLQsNGAINC/0YDQuCDQvtGC0LzQtdC90LVcclxuICB2YXIgcmVzZXRQcmV2aWV3ID0gZnVuY3Rpb24oKXtcclxuICBcdHZhciBibG9ja1Bob3RvQmFjayA9IGhlYWRlckJhY2suZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvJyk7XHJcbiAgICB2YXIgZnJvbnRBdmF0YXIgPSBoZWFkZXJGcm9udC5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKS5hdHRyKCdzdHlsZScpO1xyXG4gICAgaWYobmV3QmFja0dyb3VuZCl7XHJcbiAgICAgICRoZWFkZXJNYWluLmNzcyh7XHJcbiAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnIDogJ3VybCgnKyBuZXdCYWNrR3JvdW5kICsnKSdcclxuICAgICAgfSlcclxuICAgICAgJGZvb3Rlci5jc3Moe1xyXG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJyA6ICd1cmwoJysgbmV3QmFja0dyb3VuZCArJyknXHJcbiAgICAgIH0pXHJcbiAgICB9ZWxzZXtcclxuICAgICAgJGhlYWRlck1haW4uYXR0cignc3R5bGUnLGhlYWRlckJnU3R5bGUpO1xyXG4gICAgICAkZm9vdGVyLmF0dHIoJ3N0eWxlJyxoZWFkZXJCZ1N0eWxlKVxyXG4gICAgfSAgICBcclxuICBcdGFqYXhGbGFnID0gZmFsc2U7XHJcbiAgXHQkaGVhZGVyTWFpbi5yZW1vdmVDbGFzcygnbG9hZGVyJyk7XHJcbiAgXHRcclxuICBcdGJsb2NrUGhvdG9CYWNrLnJlbW92ZUNsYXNzKCdsb2FkZXInKTtcclxuICBcdGJsb2NrUGhvdG9CYWNrLmF0dHIoJ3N0eWxlJyxmcm9udEF2YXRhcik7XHJcblxyXG4gIFx0Ly8kaGVhZGVyTWFpbi5hZGRDbGFzcyhjbGFzc0NhbmNlbCk7XHJcbiAgICBiYXNlLmNsZWFyVG1wKHVybFBhdGgsdGhpc0FqYXgpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCDQt9Cw0L/RgNC+0YEg0L3QsCBlZGl0VXNlckRhdGFcclxuICB2YXIgcmVxdWVzdFRvU2VydmVyID0gZnVuY3Rpb24oZSl7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIHZhciAkaGVhZHJCYWNrID0gJGhlYWRlck1haW4uZmluZCgnLmhlYWRlcl9fc2VjdGlvbl9tYWluLWJhY2snKTtcclxuICB2YXIgaW5wdXROYW1lID0gJGhlYWRyQmFjay5maW5kKCdpbnB1dFtuYW1lPVwibmFtZVwiXScpO1xyXG4gIHZhciBpbnB1dEFib3V0ID0gJGhlYWRyQmFjay5maW5kKCd0ZXh0YXJlYVtuYW1lID0gXCJkZXNjXCJdJyk7XHJcbiAgdmFyIG91dHB1dERhdGEgPSB7XHJcbiAgICB1c2VyTmFtZTogaW5wdXROYW1lLnZhbCgpLFxyXG4gICAgdXNlckFib3V0OiBpbnB1dEFib3V0LnZhbCgpXHJcbiAgfVxyXG4gICRoZWFkZXJNYWluLmZpbmQoJy5wcmVsb2FkX19jb250YWluZXInKS5hZGRDbGFzcygnYWN0aXZlJylcclxuICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IHVybFBhdGggKyAnZWRpdFVzZXJEYXRhLycsXHJcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICBkYXRhOiBvdXRwdXREYXRhLFxyXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpe1xyXG4gICAgICAgIC8vINCS0YvQstC+0LTQuNC8INC00LDQvdC90YvQtSDRgSDRgdC10YDQstC10YDQsFxyXG4gICAgICAgIGhlYWRlckZyb250LmZpbmQoJy51c2VyLWJsb2NrX19uYW1lJykudGV4dChyZXMubmFtZSk7XHJcbiAgICAgICAgaGVhZGVyRnJvbnQuZmluZCgnLnVzZXItYmxvY2tfX2Rlc2MnKS50ZXh0KHJlcy5hYm91dCk7XHJcbiAgICAgICAgJGhlYWRlck1haW4uZmluZCgnLnByZWxvYWRfX2NvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICBoZWFkZXJGcm9udC5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKS5jc3Moe1xyXG4gICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnIDogJ3VybCgnICsgcmVzLmF2YXRhckZpbGUgKyAnKSwgdXJsKC4uL2ltZy9hbGJ1bS9ub19waG90by5qcGcpJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5ld0JhY2tHcm91bmQgPSByZXMuYmFja0dyb3VuZEZpbGU7XHJcbiAgICAgICAgY2xvc2VFZGl0SGVhZGVyKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCDQt9Cw0L/RgNC+0YEg0L3QsCBlZGl0VXNlckFsYnVtRGF0YVxyXG5cclxuICB2YXIgcmVxdWVzdEFsYnVtVG9TZXJ2ZXIgPSBmdW5jdGlvbihlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB2YXIgaGVhZGVyRnJvbnRBbGJ1bSA9ICRoZWFkZXJBbGJ1bS5maW5kKCcuaGVhZGVyLWFsYnVtX19jb250ZW50X2Zyb250Jyk7XHJcbiAgICB2YXIgaGVhZGVyQmFja0FsYnVtID0gJGhlYWRlckFsYnVtLmZpbmQoJy5oZWFkZXItYWxidW1fX2NvbnRlbnRfYmFjaycpO1xyXG4gICAgdmFyIGlucHV0TmFtZSA9IGhlYWRlckJhY2tBbGJ1bS5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXScpO1xyXG4gICAgdmFyIGlucHV0QWJvdXQgPSBoZWFkZXJCYWNrQWxidW0uZmluZCgndGV4dGFyZWFbbmFtZSA9IFwiZGVzY1wiXScpO1xyXG4gICAgdmFyIG91dHB1dERhdGEgPSB7XHJcbiAgICAgIGFsYnVtTmFtZTogaW5wdXROYW1lLnZhbCgpLFxyXG4gICAgICBhbGJ1bUFib3V0OiBpbnB1dEFib3V0LnZhbCgpXHJcbiAgICB9XHJcbiAgICAkaGVhZGVyQWxidW0uZmluZCgnLnByZWxvYWRfX2NvbnRhaW5lcicpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IHVybFBhdGggKyAnZWRpdEFsYnVtRGF0YS8nLFxyXG4gICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgZGF0YTogb3V0cHV0RGF0YSxcclxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICAvLyDQktGL0LLQvtC00LjQvCDQtNCw0L3QvdGL0LUg0YEg0YHQtdGA0LLQtdGA0LBcclxuICAgICAgICBoZWFkZXJGcm9udEFsYnVtLmZpbmQoJy5oZWFkZXItYWxidW1fX3RpdGxlLWRlc2NyaXB0aW9uJykudGV4dChyZXMuYWxidW0ub3JpZ2luTmFtZSk7XHJcbiAgICAgICAgaGVhZGVyRnJvbnRBbGJ1bS5maW5kKCcuaGVhZGVyLWFsYnVtX190ZXh0LWRlc2NyaXB0aW9uJykudGV4dChyZXMuYWxidW0uYWJvdXQpO1xyXG4gICAgICAgICRoZWFkZXJBbGJ1bS5maW5kKCcucHJlbG9hZF9fY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIG5ld0JhY2tHcm91bmQgPSByZXMuYmFja0dyb3VuZEZpbGU7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzLmFsYnVtLm5hbWUpO1xyXG4gICAgICAgIHZhciB1cmxBcnIgPSB1cmxQYXRoLnNwbGl0KCcvJyk7XHJcblxyXG4gICAgICAgIHZhciBuZXdVcmwgPSAnLycgKyB1cmxBcnJbMV0gKyAnLycgKyB1cmxBcnJbMl0gKyAnLycgKyByZXMuYWxidW0ubmFtZSArICcvJ1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG5ld1VybClcclxuICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSgnJywgJycsIG5ld1VybCk7XHJcbiAgICAgICAgY2xvc2VFZGl0SGVhZGVyKGUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG5cclxuICB2YXIgX3NldFVwbGlzdG5lciA9IGZ1bmN0aW9uKCl7XHJcbiAgXHR1cGxvYWRBdmF0YXIub24oJ2NoYW5nZScsY2hhbmdlQXZhdGFyKTtcclxuICBcdHVwbG9hZEJnLm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKGUpe1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGNoYW5nZUJhY2tHcm91bmQoJCh0aGlzKSwkaGVhZGVyTWFpbik7XHJcbiAgICB9KTtcclxuICAgIHVwbG9hZEJnQWxidW0ub24oJ2NoYW5nZScsZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgY2hhbmdlQmFja0dyb3VuZCgkKHRoaXMpLCRoZWFkZXJBbGJ1bSk7XHJcbiAgICB9KTtcclxuICBcdGNhbmNlbEJ0bi5vbignY2xpY2snLHJlc2V0UHJldmlldyk7XHJcbiAgXHR1cGxvYWRCZy5vbignY2xpY2snLGxvY2tTZWxGaWxlKTtcclxuICBcdHVwbG9hZEF2YXRhci5maW5kKCdpbnB1dCcpLm9uKCdjbGljaycsbG9ja1NlbEZpbGUpO1xyXG4gIFx0c2F2ZUJ0bi5vbignY2xpY2snLHJlcXVlc3RUb1NlcnZlcik7XHJcblxyXG4gICAgc2F2ZUJ0bkFsYnVtLm9uKCdjbGljaycscmVxdWVzdEFsYnVtVG9TZXJ2ZXIpXHJcblxyXG4gIH1cclxuXHJcblxyXG4gIC8vINCe0LHRidC40LjQtSDQv9C10YDQtdC80LXQvdC90YvQtVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgXHRfc2V0VXBsaXN0bmVyKCk7XHJcbiAgICB9LFxyXG5cclxuICB9O1xyXG59KSgpOyIsIi8vID09PT09PT09PT09IGFqYXggc29jaWFsIG1vZHVsZSA9PT09PT09PT09PVxyXG4vLyDQrdGC0L7RgiDQvNC+0LTRg9C70Ywg0YHQvtC00LXRgNC20LjRgiDQsiDRgdC10LHQtSDRgdC60YDQuNC/0YLRiyDQutC+0YLQvtGA0YvQtSDRgNC10LTQsNC60YLQuNGA0YPQtdGCINGB0L7RhtC40LDQu9GM0L3Ri9C1INGB0LXRgtC4INC/0LvQvtC70YzQt9C+0LLQsNGC0LXQu9GPXHJcblxyXG52YXIgYWpheFNvY2lhbE1vZHVsZSA9IChmdW5jdGlvbigpIHtcclxuXHQvLyDQntCx0YrRj9Cy0LvQtdC90LjQtSDQsdC40LHQu9C40L7RgtC10LrQuFxyXG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XHJcblxyXG4gIC8v0J7QsdGJ0LjQtSDQv9C10YDQtdC80LXQvdC90YvQtVxyXG5cclxuICAvLyDQn9GA0L7RgdC70YPRiNC60LAg0YHQvtCx0YvRgtC40LlcclxuXHJcbiAgdmFyICRoZWFkZXIgPSAkKCcuaGVhZGVyLW1haW4nKTtcclxuICB2YXIgJGhlYWRlckZyb250ID0gJGhlYWRlci5maW5kKCdoZWFkZXJfX3NlY3Rpb25fbWFpbi1mcm9udCcpO1xyXG4gIHZhciAkaGVhZGVyQmFjayA9ICRoZWFkZXIuZmluZCgnLmhlYWRlcl9fc2VjdGlvbl9tYWluLWJhY2snKTtcclxuICB2YXIgJGlucHV0cyA9ICRoZWFkZXJCYWNrLmZpbmQoJy5maWVsZCcpO1xyXG4gIHZhciBpZCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuXHJcbiAgLy8g0KHQvtGGLtGB0LXRgtC4XHJcblxyXG4gIHZhciBzb2NfdmsgPSAkaW5wdXRzLmZpbHRlcignLmlucHV0X192aycpO1xyXG4gIHZhciBzb2NfZmIgPSAkaW5wdXRzLmZpbHRlcignLmlucHV0X19mYWNlYm9vaycpO1xyXG4gIHZhciBzb2NfdHcgPSAkaW5wdXRzLmZpbHRlcignLmlucHV0X190d2l0dGVyJyk7XHJcbiAgdmFyIHNvY19wbHVzID0gJGlucHV0cy5maWx0ZXIoJy5pbnB1dF9fZ29vZ2xlLXBsdXMnKTtcclxuICB2YXIgc29jX2VtYWlsID0gJGlucHV0cy5maWx0ZXIoJy5pbnB1dF9fZW1haWwnKTtcclxuXHJcbiAgdmFyIHNvY192a19vbGQgPSBzb2NfdmsudmFsKCk7XHJcbiAgdmFyIHNvY19mYl9vbGQgPSBzb2NfZmIudmFsKCk7XHJcbiAgdmFyIHNvY190d19vbGQgPSBzb2NfdHcudmFsKCk7XHJcbiAgdmFyIHNvY19wbHVzX29sZCA9IHNvY19wbHVzLnZhbCgpO1xyXG4gIHZhciBzb2NfZW1haWxfb2xkID0gc29jX2VtYWlsLnZhbCgpO1xyXG5cclxuICAvLyDQmtC90L7Qv9C60LhcclxuICB2YXIgdmtfc2F2ZSA9IHNvY192ay5jbG9zZXN0KCcuZm9ybV9fcm93JykubmV4dCgpLmZpbmQoJy5zb2NpYWwtLXNhdmUnKTtcclxuICB2YXIgdmtfcmVzZXQgPSBzb2NfdmsuY2xvc2VzdCgnLmZvcm1fX3JvdycpLm5leHQoKS5maW5kKCcuc29jaWFsLS1yZXNldCcpO1xyXG5cclxuICB2YXIgZmJfc2F2ZSA9IHNvY19mYi5jbG9zZXN0KCcuZm9ybV9fcm93JykubmV4dCgpLmZpbmQoJy5zb2NpYWwtLXNhdmUnKTtcclxuICB2YXIgZmJfcmVzZXQgPSBzb2NfZmIuY2xvc2VzdCgnLmZvcm1fX3JvdycpLm5leHQoKS5maW5kKCcuc29jaWFsLS1yZXNldCcpO1xyXG5cclxuICB2YXIgdHdfc2F2ZSA9IHNvY190dy5jbG9zZXN0KCcuZm9ybV9fcm93JykubmV4dCgpLmZpbmQoJy5zb2NpYWwtLXNhdmUnKTtcclxuICB2YXIgdHdfcmVzZXQgPSBzb2NfdHcuY2xvc2VzdCgnLmZvcm1fX3JvdycpLm5leHQoKS5maW5kKCcuc29jaWFsLS1yZXNldCcpO1xyXG5cclxuICB2YXIgcGx1c19zYXZlID0gc29jX3BsdXMuY2xvc2VzdCgnLmZvcm1fX3JvdycpLm5leHQoKS5maW5kKCcuc29jaWFsLS1zYXZlJyk7XHJcbiAgdmFyIHBsdXNfcmVzZXQgPSBzb2NfcGx1cy5jbG9zZXN0KCcuZm9ybV9fcm93JykubmV4dCgpLmZpbmQoJy5zb2NpYWwtLXJlc2V0Jyk7XHJcblxyXG4gIHZhciBlbWFpbF9zYXZlID0gc29jX2VtYWlsLmNsb3Nlc3QoJy5mb3JtX19yb3cnKS5uZXh0KCkuZmluZCgnLnNvY2lhbC0tc2F2ZScpO1xyXG4gIHZhciBlbWFpbF9yZXNldCA9IHNvY19lbWFpbC5jbG9zZXN0KCcuZm9ybV9fcm93JykubmV4dCgpLmZpbmQoJy5zb2NpYWwtLXJlc2V0Jyk7XHJcblxyXG5cclxuICB2YXIgc2V0U29jVmFsdWUgPSBmdW5jdGlvbihlLGJ0bixzX25hbWUsc190aXRsZSl7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgJHRoaXMgPSBidG47XHJcbiAgICB2YXIgaW5wdXQgPSAkdGhpcy5jbG9zZXN0KCcuZm9ybV9fcm93JykucHJldigpLmZpbmQoJ2lucHV0Jyk7XHJcbiAgICB2YXIgcGF0dGVyTGluayA9IGJhc2UuUmVnUGF0dGVybnMubGluaztcclxuICAgIHZhciBwYXR0ZXJFbWFpbCA9IGJhc2UuUmVnUGF0dGVybnMuZW1haWw7XHJcbiAgICB2YXIgc29jaWFsVmVpdyA9ICQoJy5zb2NpYWwtLXZlaXcnKTtcclxuICAgIHZhciB0ZXN0ID0gc29jaWFsVmVpdy5maW5kKCcuc29jaWFsX18nICsgc19uYW1lKVxyXG4gICAgdmFyIGRhdGFJbnB1dD0ge1xyXG4gICAgICBsaW5rOiBpbnB1dC52YWwoKSxcclxuICAgICAgbmFtZTogc19uYW1lLFxyXG4gICAgICB0aXRsZTogc190aXRsZSxcclxuICAgIH07XHJcblxyXG4gICAgXHJcblxyXG4gICAgaWYoIXBhdHRlckxpbmsudGVzdChpbnB1dC52YWwoKSkgJiYgKHNfbmFtZSAhPSAnZW1haWwnKSl7XHJcbiAgICAgIGFsZXJ0KCfQvdC1INC/0YDQsNCy0LjQu9GM0L3Ri9C5INGE0L7RgNC80LDRgiDRgdGB0YvQu9C60LgnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfWVsc2UgaWYoIXBhdHRlckVtYWlsLnRlc3QoaW5wdXQudmFsKCkpICYmIChzX25hbWUgPT0gJ2VtYWlsJykpe1xyXG4gICAgICBhbGVydCgn0L3QtSDQv9GA0LDQstC40LvRjNC90YvQuSBlbWFpbCcpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgJC5hamF4KHtcclxuICAgICAgIHVybDogaWQgKyAnY2hhbmdlU29jaWFsLycsXHJcbiAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgIHByb2Nlc3NEYXRhOiB0cnVlLFxyXG4gICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgIGRhdGE6IGRhdGFJbnB1dCxcclxuICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgaWYoc19uYW1lID09ICdlbWFpbCcpe1xyXG4gICAgICAgICAgc29jaWFsVmVpdy5maW5kKCcuc29jaWFsX18nICsgc19uYW1lKS5hdHRyKCdocmVmJywnbWFpbHRvOicgKyByZXNbZGF0YUlucHV0Lm5hbWVdLmxpbmspO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgc29jaWFsVmVpdy5maW5kKCcuc29jaWFsX18nICsgc19uYW1lKS5hdHRyKCdocmVmJyxyZXNbZGF0YUlucHV0Lm5hbWVdLmxpbmspO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzb2NpYWxWZWl3LmZpbmQoJy5zb2NpYWxfXycgKyBzX25hbWUpLmF0dHIoJ3RpdGxlJyxyZXNbZGF0YUlucHV0Lm5hbWVdLnRpdGxlKTtcclxuICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgXHJcblxyXG4gIH07XHJcblxyXG4gIHZhciBfc2V0VXBMaXN0bmVyID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICAvLyDQmNC60L7QvdC60Lgg0YHRgdGL0LvQvtC6INC90LAg0LPQu9Cw0LLQvdC+0LlcclxuXHJcbiAgICAkKCcuc29jaWFsX19idG4nKS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xyXG4gICAgICB2YXIgbGluayA9ICQodGhpcykuYXR0cignaHJlZicpO1xyXG4gICAgICBpZighKGxpbmsuaW5kZXhPZignaHR0cCcpICsgMSkpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyDQmtC90L7Qv9C60Lgg0YHQvtGF0YDQsNC90LjRgtGMXHJcbiAgICB2a19zYXZlLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XHJcbiAgICAgIHNldFNvY1ZhbHVlKGUsJCh0aGlzKSwndmsnLCfQktC60L7QvdGC0LDQutGC0LUnKTtcclxuICAgIH0pXHJcblxyXG4gICAgZmJfc2F2ZS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xyXG4gICAgICBzZXRTb2NWYWx1ZShlLCQodGhpcyksJ2ZhY2Vib29rJywnRmFjZWJvb2snKTtcclxuICAgIH0pXHJcblxyXG4gICAgdHdfc2F2ZS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xyXG4gICAgICBzZXRTb2NWYWx1ZShlLCQodGhpcyksJ3R3aXR0ZXInLCdUd2l0dGVyJyk7XHJcbiAgICB9KVxyXG5cclxuICAgIHBsdXNfc2F2ZS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xyXG4gICAgICBzZXRTb2NWYWx1ZShlLCQodGhpcyksJ2dvb2dsZScsJ0dvb2dsZSsnKTtcclxuICAgIH0pXHJcblxyXG4gICAgZW1haWxfc2F2ZS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xyXG4gICAgICBzZXRTb2NWYWx1ZShlLCQodGhpcyksJ2VtYWlsJywnRW1haWwnKTtcclxuICAgIH0pXHJcblxyXG4gICAgLy8g0JrQvdC+0L/QutCwINC+0YLQvNC10L3QuNGC0YxcclxuXHJcbiAgICB2a19yZXNldC5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICQodGhpcykuY2xvc2VzdCgnLmZvcm0nKS5maW5kKCdpbnB1dCcpLnZhbChzb2Nfdmtfb2xkKVxyXG4gICAgfSlcclxuXHJcblxyXG4gICAgZmJfcmVzZXQub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5mb3JtJykuZmluZCgnaW5wdXQnKS52YWwoc29jX2ZiX29sZClcclxuICAgIH0pXHJcblxyXG4gICAgdHdfcmVzZXQub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5mb3JtJykuZmluZCgnaW5wdXQnKS52YWwoc29jX3R3X29sZClcclxuICAgIH0pXHJcblxyXG4gICAgcGx1c19yZXNldC5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICQodGhpcykuY2xvc2VzdCgnLmZvcm0nKS5maW5kKCdpbnB1dCcpLnZhbChzb2NfcGx1c19vbGQpXHJcbiAgICB9KVxyXG5cclxuICAgIGVtYWlsX3Jlc2V0Lm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZm9ybScpLmZpbmQoJ2lucHV0JykudmFsKHNvY19lbWFpbF9vbGQpXHJcbiAgICB9KVxyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuIFxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICBfc2V0VXBMaXN0bmVyKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgfTtcclxufSkoKTsiLCIvLyA9PT09PT09PT09PSBhamF4IEFsYnVtIGFkZCBtb2R1bGUgPT09PT09PT09PT1cclxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0YHQutGA0L/QuNGC0YsgYWpheCDQtNC70Y8g0LTQvtCx0LDQstC70LXQvdC40Y8g0LDQu9GM0LHQvtC80L7QslxyXG5cclxudmFyIGFqYXhBbGJ1bUFkZE1vZHVsZSA9IChmdW5jdGlvbigpIHtcclxuXHQvLyDQntCx0YrRj9Cy0LvQtdC90LjQtSDQsdC40LHQu9C40L7RgtC10LrQuFxyXG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XHJcblxyXG5cclxuICAvLyDQntCx0YnQuNC1INC/0LXRgNC10LzQtdC90L3Ri9C1XHJcbiAgdmFyICRmb3JtID0gJCgnLnBvcHVwX19mb3JtJyk7XHJcbiAgdmFyIG1vZGFsQWRkQWxidW0gPSAkKCcubW9kYWxfX2FkZC1hbGJ1bScpO1xyXG4gIHZhciBpZCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuICB2YXIgYnRuU2F2ZSA9IG1vZGFsQWRkQWxidW0uZmluZCgnLmFkZC1hbGJ1bV9fYnRuLXNhdmUnKTtcclxuICB2YXIgYnRuQ2xvc2UgPSBtb2RhbEFkZEFsYnVtLmZpbmQoJy5tb2RhbF9faGVhZGVyLWNsb3NlJyk7XHJcbiAgdmFyIGJ0bkNhbmNlbCA9IG1vZGFsQWRkQWxidW0uZmluZCgnLmFkZC1hbGJ1bV9fYnRuLWNhbmNlbCcpOyBcclxuICB2YXIgcG9wdXBUaW1lID0gNTAwMDtcclxuICAvL3ZhciBhbGJ1bUNvdmVySW5wdXQgPSBtb2RhbEFkZEFsYnVtLmZpbmQoJ2lucHV0W25hbWU9XCJhZGRBbGJ1bUNvdmVyXCJdJyk7XHJcbiAgdmFyIGxvYWRlciA9ICdsb2FkZXInO1xyXG4gIHZhciB0aGlzQWpheDtcclxuICB2YXIgY2xvc2VGdW4gPSBhbGJ1bU1vZHVsZS5jbG9zZSgpO1xyXG5cclxuICBjb25zb2xlLmxvZyhjbG9zZUZ1bik7XHJcblxyXG5cclxuICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCBhamF4INC90LAgYWRkQWxidW1Db3ZlciAo0J/RgNC10LLRjNGOINC+0LHQu9C+0LbQutC4INCw0LvRjNCx0L7QvNCwKVxyXG5cclxuICB2YXIgYWRkQWxidW1Db3ZlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgdmFyIHRoaXNNb2RhbCA9ICR0aGlzLmNsb3Nlc3QobW9kYWxBZGRBbGJ1bSk7XHJcbiAgICB2YXIgdmVpd0NvdmVyID0gdGhpc01vZGFsLmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gICAgdmFyIGNvdmVyID0gJHRoaXNbMF0uZmlsZXNbMF07XHJcbiAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XHJcblxyXG4gICAgYmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdhZGQnKTtcclxuICAgIHZlaXdDb3Zlci5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG4gICAgaWYoIWNvdmVyKXtcclxuICAgICAgYmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdkZWwnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmb3JtRGF0YS5hcHBlbmQoXCJuZXdBbGJvbUNvdmVyXCIsY292ZXIpO1xyXG5cclxuICAgIHRoaXNBamF4ID0gJC5hamF4KHtcclxuICAgICAgdXJsOiBpZCArICdjaGFuZ2VQaG90by8nLFxyXG4gICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgZGF0YTogZm9ybURhdGEsXHJcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpe1xyXG4gICAgICAgIHZlaXdDb3Zlci5jc3Moe1xyXG4gICAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnIDogJ3VybCgnKyByZXMubmV3Q292ZXIgKycpJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgYmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdkZWwnKTtcclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICAgIFxyXG5cclxuXHJcbiAgICAvLyDQlNC+0LHQsNCy0LvQtdC90LjQtSDQsNC70YzQsdC+0LzQsFxyXG4gIC8vINCe0YLQv9GA0LDQstC70Y/QtdC8IGFqYXgg0L3QsCBhZGRsYnVtXHJcbiAgdmFyIGFkZEFsYnVtID0gZnVuY3Rpb24oZSl7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgJHRoaXNNb2RhbCA9ICQodGhpcykuY2xvc2VzdCgnLm1vZGFsX19hZGQtYWxidW0nKTtcclxuICAgIHZhciB2ZWl3Q292ZXIgPSAkdGhpc01vZGFsLmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gICAgdmFyIGFsYnVtTmFtZSA9ICR0aGlzTW9kYWwuZmluZCgnLmFkZC1hbGJ1bV9fbmFtZS1pbnB1dCcpLnZhbCgpO1xyXG4gICAgdmFyIGFsYnVtQWJvdXQgPSAkdGhpc01vZGFsLmZpbmQoJy5hZGQtYWxidW1fX3RleHRhcmVhJykudmFsKClcclxuXHJcbiAgICAvLyDQlNC+0LHQsNCy0LjRgtGMINC/0YDQtdC70L7QsNC00LXRgFxyXG4gICAgXHJcblxyXG4gICAgaWYodmVpd0NvdmVyLmhhc0NsYXNzKGxvYWRlcikpe1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0LTQu9GPIHBvcHVwXHJcbiAgICB2YXIgZXJyb3JBcnJheSA9IGJhc2UudmFsaWRhdGVGb3JtKCR0aGlzTW9kYWwpOyAvLyDQn9GA0L7QstC10YDRj9C10Lwg0YLQtdC60YPRidGD0Y4g0YTQvtGA0LzRgyDQuCDQstGL0LTQsNC10Lwg0LzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0L7RiNC40LHQvtC6XHJcbiAgICB2YXIgJGVycm9yQ29udGFpbmVyID0gJHRoaXNNb2RhbC5maW5kKCcucG9wdXBfX2Vycm9yJyk7XHJcbiAgICBpZihlcnJvckFycmF5Lmxlbmd0aCA+IDApeyAgLy8g0JXRgdC70Lgg0LIg0LzQsNGB0YHQuNCy0LUg0LXRgdGC0Ywg0L7RiNC40LHQutC4LCDQt9C90LDRh9C40YIg0LLRi9C00LDQtdC8INC+0LrQvdC+LCDRgSDQvdC+0LzQtdGA0L7QvCDQvtGI0LjQsdC60LhcclxuICAgICAgZXJyb3JBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuICAgICAgICBiYXNlLnNob3dFcnJvcihpbmRleCwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcbiAgICAgICAgYWxlcnQoYmFzZS5lcnJvcnNbaW5kZXhdKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICBcclxuXHJcbiAgICB9ZWxzZXsgLy8g0JXRgdC70Lgg0LzQsNGB0YHQuNCyINC/0YPRgdGC0L7QuSwg0LLRi9C/0L7Qu9C90Y/QtdC8INC00LDQu9GM0YjQtVxyXG4gICAgICAkdGhpc01vZGFsLmZpbmQoJy5wcmVsb2FkX19jb250YWluZXInKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgIHZhciBvdXRwdXREYXRhID0ge1xyXG4gICAgICAgIG5hbWU6IGFsYnVtTmFtZSxcclxuICAgICAgICBhYm91dDogYWxidW1BYm91dFxyXG4gICAgICB9XHJcblxyXG4gICAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogaWQgKyAnYWRkQWxidW0vJyxcclxuICAgICAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgICAgICBkYXRhOiBvdXRwdXREYXRhLFxyXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKXtcclxuICAgICAgICAgIC8vINCS0YvQstC+0LTQuNC8INC00LDQvdC90YvQtSDRgSDRgdC10YDQstC10YDQsFxyXG4gICAgICAgICAgaWYocmVzLmVycm9yKXtcclxuICAgICAgICAgICAgYWxlcnQocmVzLmVycm9yKTtcclxuICAgICAgICAgICAgJHRoaXNNb2RhbC5maW5kKCcucHJlbG9hZF9fY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgJCgnLmFsYnVtLWNhcmRzX19saXN0JykucHJlcGVuZChyZXMubmV3QWxidW0pO1xyXG4gICAgICAgICAgICAkdGhpc01vZGFsLmZpbmQoJy5wcmVsb2FkX19jb250YWluZXInKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHJlc2V0UmVxKGUpO1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAvLyDQvtGH0LjRidCw0LXQvCDQvtC60L7RiNC60L4gKNCW0LXQu9Cw0YLQtdC70YzQvdC+INC/0LXRgNC00LXQu9Cw0YLRjClcclxuXHJcbiAgICAgICAgICAgIHZhciB2ZWl3Q292ZXIgPSAkdGhpc01vZGFsLmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gICAgICAgICAgICB2YXIgY292ZXIgPSAkdGhpc01vZGFsLmZpbmQoJ2lucHV0W3R5cGUgPSBcImZpbGVcIl0nKTtcclxuICAgICAgICAgICAgdmFyIGxhYmVsVXBsb2FkID0gJHRoaXNNb2RhbC5maW5kKCcubGFiZWxfX3VwbG9hZCcpO1xyXG4gICAgICAgICAgICB2YXIgYWxidW1OYW1lID0gJHRoaXNNb2RhbC5maW5kKCcuYWRkLWFsYnVtX19uYW1lLWlucHV0JykudmFsKCcnKTtcclxuICAgICAgICAgICAgdmFyIGFsYnVtQWJvdXQgPSAkdGhpc01vZGFsLmZpbmQoJy5hZGQtYWxidW1fX3RleHRhcmVhJykudmFsKCcnKVxyXG4gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGNvdmVyLnJlcGxhY2VXaXRoKCBjb3ZlciA9IGNvdmVyLmNsb25lKCB0cnVlICkgKTtcclxuICAgICAgICAgICAgYmFzZS5jbGVhclRtcChpZCx0aGlzQWpheCk7XHJcbiAgICAgICAgICAgIGJhc2UuY2hhbmdlQ2xhc3ModmVpd0NvdmVyLGxvYWRlciwnZGVsJyk7XHJcbiAgICAgICAgICAgIHZlaXdDb3Zlci5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG4gICAgICAgICAgICBjbG9zZUZ1bihlKTtcclxuXHJcbiAgICAgICAgICAgIC8vINCh0LrRgNC+0LvQuNC8XHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuYWxidW0tY2FyZHNfX2xpc3QnKS5vZmZzZXQoKS50b3AgfSwgMTAwMClcclxuXHJcblxyXG5cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pOyAgXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyDQntGH0LjRidCw0LXQvCDQv9C+0LvRjyBcclxuICB2YXIgcmVzZXRSZXEgPSBmdW5jdGlvbihlKXtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgdmFyIHRoaXNNb2RhbCA9ICR0aGlzLmNsb3Nlc3QobW9kYWxBZGRBbGJ1bSk7XHJcbiAgICB2YXIgdmVpd0NvdmVyID0gdGhpc01vZGFsLmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gICAgdmFyIGNvdmVyID0gdGhpc01vZGFsLmZpbmQoJ2lucHV0W3R5cGUgPSBcImZpbGVcIl0nKTtcclxuICAgIHZhciBsYWJlbFVwbG9hZCA9IHRoaXNNb2RhbC5maW5kKCcubGFiZWxfX3VwbG9hZCcpO1xyXG4gICAgdmFyIGFsYnVtTmFtZSA9IHRoaXNNb2RhbC5maW5kKCcuYWRkLWFsYnVtX19uYW1lLWlucHV0JykudmFsKCcnKTtcclxuICAgIHZhciBhbGJ1bUFib3V0ID0gdGhpc01vZGFsLmZpbmQoJy5hZGQtYWxidW1fX3RleHRhcmVhJykudmFsKCcnKVxyXG4gICAgXHJcblxyXG4gICAgY292ZXIucmVwbGFjZVdpdGgoIGNvdmVyID0gY292ZXIuY2xvbmUoIHRydWUgKSApO1xyXG4gICAgYmFzZS5jbGVhclRtcChpZCx0aGlzQWpheCk7XHJcbiAgICBiYXNlLmNoYW5nZUNsYXNzKHZlaXdDb3Zlcixsb2FkZXIsJ2RlbCcpO1xyXG4gICAgdmVpd0NvdmVyLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcblxyXG4gIH1cclxuXHJcblxyXG4gICAgXHJcblxyXG5cclxuXHJcblxyXG5cclxuICBcclxuICB2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpe1xyXG4gICAgbW9kYWxBZGRBbGJ1bS5vbignY2hhbmdlJywgJ2lucHV0W25hbWU9XCJhZGRBbGJ1bUNvdmVyXCJdJyxhZGRBbGJ1bUNvdmVyKTtcclxuICAgIGJ0blNhdmUub24oJ2NsaWNrJyxhZGRBbGJ1bSk7XHJcbiAgICBidG5DYW5jZWwub24oJ2NsaWNrJyxyZXNldFJlcSlcclxuICAgIGJ0bkNsb3NlLm9uKCdjbGljaycscmVzZXRSZXEpXHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgXHRfc2V0VXBMaXN0bmVycygpO1xyXG4gICAgfSxcclxuXHJcbiAgfTtcclxuXHJcbn0pKCk7IiwiLy8g0KHQvtC30LTQsNC90LjQtSDQvNC+0LTRg9C70Y8uXHJcbi8vIDEpIEPQvtC30LTQsNC10Lwg0YTQsNC50Lsg0YEg0LzQvtC00YPQu9C10Lwg0LIg0L/QsNC/0LrQtSBzb3Vyc2UvanMvbW9kdWxlc1xyXG4vLyAyKSDQltC10LvQsNGC0LXQu9GM0L3QviDQvdCw0LfRi9Cy0LDRgtGMINGE0LDQudC70Ysg0YEg0L3QuNC20L3QtdCz0L4g0L/QvtC00YfQtdGA0LrQuNCy0LDQvdC40Y8o0KfRgtC+INCx0Ysg0L3QtSDQvtGC0YXQvtC00LjRgtGMINC+0YIg0YLRgNCw0LTQuNGG0LjQuSlcclxuLy8gMykg0JrQvtC/0LjRgNGD0LXQvCDRgdGC0YDRg9C60YLRg9GA0YMg0LjQtyDRhNCw0LnQu9CwIF9sb2dpbiDQuNC70Lgg0LvRjtCx0L7Qs9C+INC00YDRg9Cz0L7QstC+INC80L7QtNGD0LvRjyjQvdC+INC90LUgYmFzZSkuXHJcbi8vIDQpINCyIHJldHVybiDQvNC+0LTRg9C70Y8g0L3Rg9C20L3QviDQstGB0YLQsNCy0LjRgtGMINC+0LHRitC10LrRgiDRgSDQvNC10YLQvtC00L7QvCBpbml0LlxyXG4vLyA1KSDQsiDQvNC10YLQvtC0IGluaXQg0LfQsNC/0LjRgdGL0LLQsNC10Lwg0YTRg9C90LrRhtC40LgsINC60L7RgtC+0YDRi9C1INCx0YPQtNGD0YIg0LLRi9C30YvQstCw0YLRjNGB0Y8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0L/RgNC4INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4INC80L7QtNGD0LvRjy5cclxuLy8gNikg0KfRgtC+INCx0Ysg0L/QvtC70YPRh9C40YLRjCDQtNC+0YHRgtGD0L8g0Log0LHQuNCx0LvQuNC+0YLQtdC60LUsINCyINC90LDRh9Cw0LvQtSDQvNC+0LTRg9C70Y8g0L3Rg9C20L3QviDQtdC1INC+0LHRitGP0LLQuNGC0YwsINC90LDQv9C40YDQvNC10YAg0YLQsNC6IHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XHJcbi8vINGC0LXQv9C10YDRjCDQstGB0LUg0YHQstC+0LnRgdGC0LLQsCDQuCDQvNC10YLQvtC00Ysg0LHQuNCx0LvQuNC+0YLQtdC60Lgg0LTQvtGB0YLRg9C/0L3RiyDRh9C10YDQtdC3INGC0L7Rh9C60YMsINC90LDQv9C40YDQvNC10YAg0YLQsNC6IGJhc2UuYWpheERhdGEoZm9ybSk7XHJcbi8vIDcpINCSINCx0LjQsdC70LjQvtGC0LXQutGDINC80L7QttC90L4g0LTQvtC/0LjRgdGL0LLQsNGC0Ywg0LLRgdC1INGH0YLQviDRg9Cz0L7QtNC90L4sINCz0LvQsNCy0L3QvtC1INGH0YLQvtCx0Ysg0YTRg9C90LrRhtC40Y8g0L3QsNGH0LjQvdCw0LvQsNGB0Ywg0YEgdGhpcywg0YLQsNC6INC80L7QtNGD0LvRjCBiYXNlINGP0LLQu9GP0LXRgtGB0Y8g0LrQvtC90YHRgtGA0YPQutGC0L7RgNC+0LwuXHJcbi8vIDgpINCU0LvRjyDRgtC+0LPQviDRh9GC0L7QsdGLINC80L7QtNGD0LvRjCDRgdC+0LHRgNCw0LvRgdGPINCyINC+0LTQuNC9INGE0LDQudC7IGFwcC5qcyDQtdCz0L4g0L3Rg9C20L3QviDQv9GA0L7Qv9C40YHQsNGC0Ywg0LIg0LIgZ3VscGZpbGUuanMuXHJcbi8vINCU0L7QutGD0LzQtdC90YLQsNGG0LjRjyDQv9C+INGE0YPQvdGG0LjRj9C8IGJhc2UsINCx0YPQtNC10YIg0YfRg9GC0Ywg0L/QvtC30LbQtS4uLlxyXG5cclxuXHJcblxyXG4kKCBkb2N1bWVudCApLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTsgLy8g0JjQvdC40YbQuNCw0LvQuNC30LjRgNGD0LXQvCDQsdC40LHQu9C40L7RgtC10LrRgy4gKNCf0L7QutCwINC90LUg0L3Rg9C20L3QvilcclxuICAgIGNvbW1vbk1vZHVsZS5pbml0KCk7XHJcbiAgICBhbGJ1bU1vZHVsZS5pbml0KCk7XHJcbiAgICAvLyDQkNC90LjQvNCw0YbQuNC4XHJcbiAgICBsb2dpbkNvdmVyTW9kdWxlLmluaXQoKTtcclxuICAgIGhlYWRlck1vZHVsZS5pbml0KCk7XHJcbiAgICBhbGJ1bUFkZE1vZHVsZS5pbml0KCk7XHJcbiAgICAvLyBhamF4XHJcbiAgICBhamF4TG9naW5Db3Zlck1vZHVsZS5pbml0KCk7XHJcbiAgICBhamF4SGVhZGVyTW9kdWxlLmluaXQoKTtcclxuICAgIGFqYXhTb2NpYWxNb2R1bGUuaW5pdCgpO1xyXG4gICAgYWpheEFsYnVtQWRkTW9kdWxlLmluaXQoKTtcclxuXHJcbn0pO1xyXG5cclxuXHQvLyDQmtCw0YHRgtC+0LzQvdGL0Lkg0LLQuNC0INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INGE0LDQudC70L7QslxyXG5cdChmdW5jdGlvbigpIHtcclxuXHRcdHZhciBlbCA9ICQoJy51cGxvYWQnKTtcclxuXHJcblx0XHRpZihlbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnVwbG9hZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0dmFyIGVsICAgID0gJCh0aGlzKTtcclxuXHRcdFx0dmFyIGlucHV0ID0gZWwuY2hpbGRyZW4oJ1t0eXBlPWZpbGVdJyk7XHJcblxyXG5cdFx0XHRpbnB1dFswXS5jbGljaygpO1xyXG5cdFx0fSk7XHJcblx0fSkoKTsiXX0=

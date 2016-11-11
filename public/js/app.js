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
// Объявление библиотеки
  var base = new BaseModule;
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

$save.on('click', function (e) {
  e.preventDefault();
  //закрыли большое окно
  $('.modal_add-photo .modal__header-close').click();

  // открыли маленькое
  base.changeClass('.modal-overlay, .modal_notification ','hide','del');

  $.ajax({
    type: "POST",
    url: location.href + 'saveImg/',
    data: 'ok',
    cache: false,
    contentType: false,
    processData: false,
    success: function(data) {

      //$('li .preload__container').removeClass('active');
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
    var preCont = $('<div/>').addClass('preload__container').appendTo(ImgCont);
    var preLoad = $('<div/>').addClass('preload__loading').appendTo(preCont);
    var i = 0;
    while (i < 3){ 
      var preItem = $('<i/>').appendTo(preLoad);
      i++;
    }
    preCont.addClass('active');
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
          preCont.removeClass('active');

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


  // Клик по лайку или комментариям
 	var clickLike = function(e){
 		e.preventDefault();
 	}

  // Открыть окно для загрузки изображений
  var openUploadImg = function(){
		base.changeClass('.modal_add-photo','hide','del');
		base.changeClass('.modal-overlay','hide','del');
		$('input[type="file"]').prop('value', null);

	};

	// Закрыть модальное окно с оповещениями
  var closeNotification = function(e){
  	e.preventDefault();
  	var modal = $(this).closest('.modal');
		base.changeClass(modal,'hide','add');
		base.changeClass('.modal-overlay','hide','add');
	};
	// Закрыть окно для загрузки изображений
	var closeUpload = function(e){
		e.preventDefault();
		var modal = $(this).closest('.modal');
		console.log(modal);
		base.changeClass(modal,'hide','add');
		base.changeClass('.modal-overlay','hide','add');
		$(".img-list").empty();
		$('.modal__load-img').show();
		$(".slider__item").remove();
		$('.slider__view').css('transition' ,'none');
		console.log('done');
	};

	// Открыть окно для редактирования фото и отправить ajax при сохранении редактирования

  var openEditAlbum = function(e){
    // Открыть окно
    e.preventDefault();
    base.changeClass('.modal_edit-album, .modal-overlay','hide','del');
    }

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
					console.log(currentImg);
		$('.photo-card__head').each(function(i, img){
				var url = ($(this).css('background-image').split(',')[0]);
				var src = url.substr(5, url.length-7 );
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
		$('.modal__header-close, .modal__cancelButton ').on('click', closeUpload);
		$('.modal__cancelNotif').on('click', closeNotification);
		$(window).on('scroll', _fixedAdd);
		$('body').on('click','.img-item',_cancelLoad);
		$('.loupe').on('click', openSlider);
		$('.btn-editAlbum').on('click', openEditAlbum);
		$('.info__item').on('click', clickLike);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9iYXNlLmpzIiwiX2NvbW1vbi5qcyIsIl9sb2dpbi1jb3Zlci5qcyIsIl9oZWFkZXIuanMiLCJfYWxidW0tYWRkLmpzIiwidXBsb2FkLmpzIiwiX2FsYnVtLmpzIiwibW9kYWwuanMiLCJzbGlkZXIuanMiLCJfYWpheC1sb2dpbi1jb3Zlci5qcyIsIl9hamF4LWhlYWRlci5qcyIsIl9hamF4LXNvY2lhbC5qcyIsIl9hamF4LWFsYnVtLWFkZC5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyA9PT09PT09PT09PSBCYXNlIG1vZHVsZSA9PT09PT09PT09PVxuXG52YXIgQmFzZU1vZHVsZSA9IGZ1bmN0aW9uKCl7XG5cblx0Ly89PT09PT0g0J7QsdGK0LXQutGC0Yss0LzQsNGB0YHQuNCy0YsgPT09PT09XG5cdHRoaXMuZXJyb3JzID0ge1xuICBcdDAgOiAn0JfQsNC/0L7Qu9C90LXQvdGLINC90LUg0LLRgdC1INC/0L7Qu9GPJyxcbiAgXHQxIDogJ9CS0LLQtdC00LjRgtC1INC60L7RgNGA0LXQutGC0L3Ri9C5IGUtbWFpbCcsXG4gIFx0Mlx0OiAn0JTQu9C40L3QsCDQv9Cw0YDQvtC70Y8g0LzQtdC90YzRiNC1IDgg0YHQuNC80LLQvtC70L7QsicsXG4gIFx0MyA6ICfQktGL0LHQtdGA0LjRgtC1INC+0LHQu9C+0LbQutGDJ1xuICB9O1xuXG4gIHRoaXMuUmVnUGF0dGVybnMgPSB7XG4gIFx0ZW1haWwgOiAvXihbMC05YS16QS1aXy1dK1xcLikqWzAtOWEtekEtWl8tXStAWzAtOWEtekEtWl8tXSsoXFwuWzAtOWEtekEtWl8tXSspKlxcLlthLXpdezIsNn0kLyxcbiAgXHRsaW5rIDogL14oaHR0cHM/OlxcL1xcLyk/KFtcXHdcXC5dKylcXC4oW2Etel17Miw2fVxcLj8pKFxcL1tcXHdcXC5dKikqXFwvPyQvXG4gIH07XG5cbiAgdGhpcy5nbG9iYWwgPSB7fTtcblxuXG5cblxuICAvLz09PT09PSDQpNGD0L3QutGG0LjQuCA9PT09PT1cblxuXG5cdHRoaXMuYWpheERhdGEgPSBmdW5jdGlvbihmb3JtLF90eXBlKXtcblx0XHR2YXIgZWxlbSA9IGZvcm0uZmluZCgnaW5wdXRbdHlwZSAhPSBzdWJtaXRdLHRleHRhcmVhJyk7XG5cdFx0dmFyIGRhdGEgPSB7fTtcblx0XHQkLmVhY2goZWxlbSwgZnVuY3Rpb24oKXtcblx0XHRcdFx0ZGF0YVskKHRoaXMpLmF0dHIoJ25hbWUnKV0gPSAkKHRoaXMpLnZhbCgpO1xuXHRcdH0pXG5cdFx0dmFyIGZvcm1hdCA9IF90eXBlIHx8IEpTT04uc3RyaW5naWZ5KGRhdGEpXG5cdFx0cmV0dXJuIGZvcm1hdDtcblx0fTtcblxuXHR0aGlzLmFqYXggPSBmdW5jdGlvbihmb3JtLCB1cmwsIF9tZXRob2Qpe1xuXHRcdFx0dmFyIG1ldGhvZCA9IF9tZXRob2QgfHwgJ1BPU1QnO1xuXHRcdFx0dmFyIGRhdGEgPSB0aGlzLmFqYXhEYXRhKGZvcm0pO1xuXHRcdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHRcdHVybDogdXJsLFxuXHRcdFx0XHR0eXBlOiBtZXRob2QsXG5cdFx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRcdGRhdGE6IGRhdGFcblx0XHRcdH0pO1xuXHR9XG5cblx0dGhpcy5jbGVhclRtcCA9IGZ1bmN0aW9uKHVzZXJJZCx0aGlzQWpheCl7XG4gICAgaWYodGhpc0FqYXgpe1xuICAgICAgdGhpc0FqYXguYWJvcnQoKTtcbiAgICB9XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdXNlcklkICsgJ2NsZWFyVG1wLycsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IHtjbGVhcjogJ2NsZWFySGVhZGVyJ30sXG4gICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgfSk7XG4gIH1cblxuXHR0aGlzLmFqYXhEYXRhT2JqID0gZnVuY3Rpb24ob2JqLHVybCxtZXRob2Qpe1xuXHRcdG1ldGhvZCA9IG1ldGhvZCB8fCAnUE9TVCdcblx0XHR2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9iaik7XG5cdFx0cmV0dXJuICQuYWpheCh7XG5cdFx0XHR1cmw6IHVybCxcblx0XHRcdHR5cGU6IG1ldGhvZCxcblx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRkYXRhOiBkYXRhXG5cdFx0fSk7XG5cdH1cblxuXHR0aGlzLnNob3dFcnJvciA9IGZ1bmN0aW9uKGVycm9ySW5kZXgsZWxlbSxfbXMpe1xuXHRcdHZhciB0aGlzRnJvbSA9IGVsZW0uY2xvc2VzdCgnZm9ybScpO1xuXHRcdHZhciB0aW1lID0gX21zIHx8IDIwMDA7XG5cdFx0aWYodHlwZW9mKGVycm9ySW5kZXgpID09ICdzdHJpbmcnKXtcblx0XHRcdGVsZW0udGV4dChlcnJvckluZGV4KVxuXHRcdH1lbHNle1xuXHRcdFx0ZWxlbS50ZXh0KHRoaXMuZXJyb3JzW2Vycm9ySW5kZXhdKTtcblx0XHR9XG5cdFx0aWYodGhpc0Zyb20uZmluZChlbGVtKS5pcygnOnZpc2libGUnKSl7XG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5nbG9iYWwudGltZXIpO1xuXHRcdFx0dGhpcy5nbG9iYWwudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGVsZW0udGV4dCgpO1xuXHRcdFx0XHRlbGVtLnJlbW92ZUNsYXNzKCdzaG93JykuYWRkQ2xhc3MoJ2hpZGUnKTtcblx0XHRcdH0sIHRpbWUpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdFxuXHRcdGVsZW0ucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5hZGRDbGFzcygnc2hvdycpO1xuXG5cblx0XHR0aGlzLmdsb2JhbC50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdGVsZW0udGV4dCgpO1xuXHRcdFx0ZWxlbS5yZW1vdmVDbGFzcygnc2hvdycpLmFkZENsYXNzKCdoaWRlJyk7XG5cdFx0fSwgdGltZSk7XG5cblx0fVxuXG5cdHRoaXMuaGlkZUVycm9yID0gZnVuY3Rpb24oZWxlbSl7XG5cdFx0ZWxlbS5yZW1vdmVDbGFzcygnc2hvdycpLmFkZENsYXNzKCdoaWRlJyk7XG5cdH1cblxuXHR0aGlzLnZhbGlkRW1haWwgPSBmdW5jdGlvbihpbnB1dCwgcGF0dGVyKXtcblx0XHRyZXR1cm4gcGF0dGVyLnRlc3QoaW5wdXQudmFsKCkpO1xuXHR9O1xuXG5cdHRoaXMudmFsaWRQYXNzID0gZnVuY3Rpb24oaW5wdXQsbGVuZ3RoKXtcblx0XHR2YXIgbGVuID0gbGVuZ3RoIHx8IDg7XG5cdFx0aWYoIShpbnB1dC52YWwoKS5sZW5ndGggPCBsZW4pKXtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fTtcblxuXHR0aGlzLnZhbGlkRmlsZXMgPSBmdW5jdGlvbihpbnB1dCxsZW5ndGgpe1xuXHRcdHZhciBsZW4gPSBsZW5ndGggfHwgMDtcblx0XHRpZighKGlucHV0WzBdLmZpbGVzLmxlbmd0aCA8PSBsZW4pKXtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cdH1cblx0XG5cdHRoaXMudmFsaWRhdGVGb3JtID0gZnVuY3Rpb24oZm9ybSkge1xuXHRcdHZhciB0aGlzTW9kdWxlID0gdGhpcztcblx0XHR2YXIgcGF0dGVybiA9IHRoaXNNb2R1bGUuUmVnUGF0dGVybnMuZW1haWw7XG5cdFx0dmFyICR0aGlzRm9ybSA9IGZvcm07XG5cdFx0dmFyIGVsZW1lbnRzID0gJHRoaXNGb3JtLmZpbmQoJ3RleHRhcmVhLGlucHV0Om5vdChpbnB1dFt0eXBlPVwic3VibWl0XCJdKScpO1xuXHRcdHZhciBlcnJvcnMgPSB0aGlzTW9kdWxlLmVycm9ycztcblx0XHR2YXIgb3V0cHV0ID0gW107XG5cblx0XHQkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcblx0XHRcdGlmKCEkKHRoaXMpLnZhbCgpICYmICQodGhpcykuYXR0cigndHlwZScpICE9ICdmaWxlJyl7XG5cdFx0XHRcdFx0b3V0cHV0WzBdID0gMDtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmKG91dHB1dC5sZW5ndGggPT0gMCl7XG5cdFx0XHQkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHRcdHZhciB0eXBlID0gJHRoaXMuYXR0cigndHlwZScpO1xuXHRcdFx0XHR2YXIgbmFtZUF0dHIgPSAkdGhpcy5hdHRyKCduYW1lJyk7XG5cdFx0XHRcdHN3aXRjaCh0eXBlKXtcblx0XHRcdFx0XHRjYXNlICdwYXNzd29yZCcgOlxuXHRcdFx0XHRcdFx0aWYoIXRoaXNNb2R1bGUudmFsaWRQYXNzKCR0aGlzKSl7XG5cdFx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKDIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnZW1haWwnIDpcblx0XHRcdFx0XHRcdGlmKCF0aGlzTW9kdWxlLnZhbGlkRW1haWwoJHRoaXMscGF0dGVybikpe1xuXHRcdFx0XHRcdFx0XHRvdXRwdXQucHVzaCgxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRzd2l0Y2gobmFtZUF0dHIpe1xuXHRcdFx0XHRcdGNhc2UgJ2FkZEFsYnVtQ292ZXInIDpcblx0XHRcdFx0XHRcdGlmKCF0aGlzTW9kdWxlLnZhbGlkRmlsZXMoJHRoaXMpKXtcblx0XHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goMyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fTtcblx0XHRcdH0pXG5cdFx0fTtcblxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH07XG5cblx0dGhpcy5jbGVhcklucHV0cyA9IGZ1bmN0aW9uKGZvcm0pe1xuXHRcdHZhciBlbGVtID0gZm9ybS5maW5kKCdpbnB1dFt0eXBlICE9IHN1Ym1pdF0sdGV4dGFyZWEnKTtcblx0XHRlbGVtLnZhbCgnJyk7XG5cdH1cblxuXHR0aGlzLnNjcm9sbFRvUG9zaXRpb24gPSBmdW5jdGlvbihwb3NpdGlvbiwgZHVyYXRpb24pe1xuICBcdHZhciBwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7XG5cdFx0dmFyIGR1cmF0aW9uID0gZHVyYXRpb24gfHwgMTAwMDtcblxuXG5cdFx0JChcImJvZHksIGh0bWxcIikuYW5pbWF0ZSh7XG5cdFx0XHRcdHNjcm9sbFRvcDogcG9zaXRpb25cblx0XHR9LCBkdXJhdGlvbilcbiAgfTtcblxuICB0aGlzLmNoYW5nZUNsYXNzID0gZnVuY3Rpb24ocGFyZW50LGNsYXNzTmFtZSx0eXBlKXtcbiAgXHRpZih0eXBlb2YocGFyZW50KSA9PSAnc3RyaW5nJyl7XG4gIFx0XHR2YXIgcGFyZW50ID0gJChwYXJlbnQpO1xuICBcdH1cbiAgXHRzd2l0Y2godHlwZSl7XG4gIFx0XHRjYXNlICdhZGQnOlxuICBcdFx0XHRwYXJlbnQuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcbiAgXHRcdFx0YnJlYWs7XG4gIFx0XHRjYXNlICdkZWwnOlxuICBcdFx0XHRwYXJlbnQucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcbiAgXHRcdFx0YnJlYWs7XG5cbiAgXHR9XG4gIH07XG5cblx0XG5cbn0iLCIvLyA9PT09PT09PT09PSBDb21tb24gbW9kdWxlID09PT09PT09PT09XG4vLyDQrdGC0L7RgiDQvNC+0LTRg9C70Ywg0YHQvtC00LXRgNC20LjRgiDQsiDRgdC10LHQtSDQvtCx0YnQuNC1INGB0LrRgNC40L/RgtGLLCDQv9GA0LjRgdGD0YnQuNC1INCy0YHQtdC8INGB0YLRgNCw0L3QuNGG0LDQvCDRgdCw0LnRgtCwLlxuXG52YXIgY29tbW9uTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xuXG5cdC8vINCe0LHRitGP0LLQu9C10L3QuNC1INCx0LjQsdC70LjQvtGC0LXQutC4XG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XG5cblxuXG4vLyDQn9GA0L7QutGA0YPRgtC40YLRjCDRgdGC0YDQsNC90LjRhtGDINC00L4gLi4uXG5cdHZhciBzY3JvbGxUbyA9IGZ1bmN0aW9uKGUpe1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciBidG4gICAgICAgID0gJCh0aGlzKTtcblx0XHR2YXIgdGFyZ2V0ICAgICA9IGJ0bi5hdHRyKCdkYXRhLWdvJyk7XG5cdFx0dmFyIGNvbnRhaW5lciAgPSBudWxsO1xuXG5cdFx0aWYgKHRhcmdldCA9PSAndG9wJykge1xuXHRcdFx0YmFzZS5zY3JvbGxUb1Bvc2l0aW9uKCk7XG5cdFx0fVxuXHR9XG5cblxuLy8g0KHQstC+0YDQsNGH0LjQstCw0L3QuNC1INCx0LvQvtC60LAg0YEg0LrQvtC80LzQtdC90YLQsNGA0LjRj9C80Lhcblx0dmFyIGNvbW1lbnRzVG9nZ2xlID0gZnVuY3Rpb24oZSl7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIGJ0biAgICAgICA9ICQodGhpcyk7XG5cdFx0dmFyIGNvbnRhaW5lciA9IGJ0bi5jbG9zZXN0KCcuY29tbWVudHMnKTtcblx0XHR2YXIgY29tbWVudHMgID0gY29udGFpbmVyLmZpbmQoJy5jb21tZW50c19fbGlzdCcpO1xuXG5cdFx0aWYoY29udGFpbmVyLmhhc0NsYXNzKCdjb21tZW50cy0tc2hvdycpKSB7XG5cdFx0XHRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2NvbW1lbnRzLS1zaG93Jyk7XG5cdFx0XHRjb21tZW50cy5zbGlkZVVwKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnRhaW5lci5hZGRDbGFzcygnY29tbWVudHMtLXNob3cnKTtcblx0XHRcdGNvbW1lbnRzLnNsaWRlRG93bigpO1xuXHRcdH1cblx0fVxuXG5cblx0Ly8gZHJvcCAtINGN0LvQtdC80LXQvdGCINGBINCy0YvQv9Cw0LTQsNGO0YnQuNC8INCx0LvQvtC60L7QvFxuXHR2YXIgYWRkRHJvcCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgdHJpZ2dlciAgICAgPSAkKHRoaXMpO1xuXHRcdHZhciBjb250YWluZXIgICA9IHRyaWdnZXIuY2xvc2VzdCgnLmRyb3AnKTtcblx0XHR2YXIgY29udGVudCAgICAgPSBjb250YWluZXIuZmluZCgnLmRyb3BfX21haW4nKTtcblx0XHR2YXIgY2xhc3NBY3RpdmUgPSAnZHJvcC0tb3Blbic7XG5cblx0XHRpZihjb250YWluZXIuaGFzQ2xhc3MoJ2Ryb3AtLWhvdmVyJykpIHJldHVybjtcblxuXHRcdGNvbnRhaW5lci50b2dnbGVDbGFzcyggY2xhc3NBY3RpdmUgKTtcblx0fTtcblxuXG5cdC8vINCa0LDRgdGC0L7QvNC90YvQuSDQstC40LQg0LTQu9GPINC30LDQs9GA0YPQt9C60Lgg0YTQsNC50LvQvtCyXG5cdC8vINCf0L7QttCw0LvRg9C50YHRgtCwLCDQuNGB0L/RgNCw0LLRjNGC0LUg0Y3RgtGDINGE0YPQvdC60YbQuNGOLCDQvdC1INC/0L7QvdGP0YLQvdC+INCz0LTQtSDQvtC90LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRjNGB0Y8g0Lgg0L3Rg9C20L3QviDQstGL0YLQsNGJ0LjRgtGMIG9uIGNsaWNrINCyIF9zZXRVcGxpc3RuZXJcblx0dmFyIGZpbGVVcGxvYWQgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBlbCA9ICQoJy51cGxvYWQnKTtcblxuXHRcdGlmKGVsLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy51cGxvYWQnLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgZWwgICAgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIGlucHV0ID0gZWwuY2hpbGRyZW4oJ1t0eXBlPWZpbGVdJyk7XG5cblx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XG5cdFx0fSk7XG5cdH1cblxuXG5cdC8vINCg0LDQt9C70L7Qs9C40L0g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXG5cdC8vINCd0YPQttC90L4g0LTQvtGA0LDQsdC+0YLQsNGC0Yxcblx0dmFyIGxvZ291dFVzZXIgPSBmdW5jdGlvbigpe1xuXHRcdHZhciBvYmogPSB7XG5cdFx0XHRyZXE6IFwibG9nb3V0XCJcblx0XHR9XG5cdFx0dmFyIGRhdGEgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xuXHRcdFx0dmFyIGlkID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuXHRcdFx0eGhyLm9wZW4oJ1BPU1QnLCBpZCArICdsb2dvdXQvJyx0cnVlKTtcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCdhcHBsaWNhdGlvbi9qc29uJyk7XG5cdFx0XHR4aHIuc2VuZChkYXRhKTtcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlICE9IDQpIHJldHVybjtcblx0XHRcdFx0Ly8g0J/QtdGA0LXQt9Cw0LPRgNGD0LfQutCwINGB0YLRgNCw0L3QuNGG0Ytcblx0XHRcdFx0aWYoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5zdGF0dXMgPT0gXCJsb2dvdXRcIil7XG5cdFx0XHRcdFx0Ly93aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xuXHRcdFx0XHRcdHZhciBzaXRlID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyAnLyc7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2cod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcblx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IHNpdGU7XG5cdFx0XHRcdH1cblx0XHRcdH1cbn1cblxuXHR2YXIgZWRpdFVzZXJEYXRhID0gZnVuY3Rpb24oKXtcblx0XHRjb25zb2xlLmxvZygxMik7XG5cdH1cblxuXG5cblx0Ly8g0J/RgNC+0YHQu9GD0YjQutCwXG5cdHZhciBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jb21tZW50c19fdG9nZ2xlJyAsIGNvbW1lbnRzVG9nZ2xlKTtcblx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS1nb10nICwgc2Nyb2xsVG8pO1xuXHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5kcm9wX190cmlnZ2VyJywgYWRkRHJvcCk7XG5cdFx0XHQkKCcubG9nb3V0Jykub24oJ2NsaWNrJywgbG9nb3V0VXNlcilcblx0fTtcblxuXG5cblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBcdF9zZXRVcExpc3RuZXJzKCk7XG4gICAgfVxuXG4gIH07XG59KSgpOyIsIi8vID09PT09PT09PT09IExvZ2luLWNvdmVyIG1vZHVsZSA9PT09PT09PT09PVxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0LDQvdC40LzQsNGG0LjRjiDQtNC70Y8g0LHQu9C+0LrQsCDQsNCy0YLQvtGA0LjQt9Cw0YbQuC5cblxuXG52YXIgbG9naW5Db3Zlck1vZHVsZSA9IChmdW5jdGlvbigpIHtcblxuXHQvLyDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSDQvNC+0LTRg9C70Y8uXG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XG5cblxuICB2YXIgcG9wdXBXaW5kb3dBbmltYXRlID0gZnVuY3Rpb24oKXtcbiAgXHQvLyDQsNC90LjQvNCw0YbQuNGPIHBvcHVwXG5cdFx0Ly8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAgXCLQt9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIlxuXHRcdHZhciBmbGlwcCBcdD0gJ2ZsaXBwJztcblx0XHR2YXIgaGlkZSBcdFx0PSAnaGlkZSc7XG5cdFx0dmFyICRmbGlwQ29udGFpbmVyID0gJCgnLmZsaXBwZXItY29udGFpbmVyJyk7XG5cdFx0dmFyICRiYWNrUGFzcyA9ICQoJy5iYWNrLXBhc3MnKTtcblx0XHR2YXIgJGJhY2tSZWcgPSAkKCcuYmFjay1yZWcnKTtcblxuXHRcdCQoJy5wb3B1cF9fbGlua19yZWdpc3RyJykuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkYmFja1Bhc3MuYWRkQ2xhc3MoaGlkZSk7XG5cdFx0XHQkYmFja1JlZy5yZW1vdmVDbGFzcyhoaWRlKTtcblx0XHQgXHQkZmxpcENvbnRhaW5lci5hZGRDbGFzcyhmbGlwcCk7XG5cdCB9KTtcblxuXG5cdFx0Ly8g0L/RgNC4INC90LDQttCw0YLQuNC4INC90LAgXCLQstC+0LnRgtC4XCJcblx0XHQkKCcucG9wdXBfX2xpbmtfZW50ZXInKS5jbGljayhmdW5jdGlvbihlKXtcblx0XHQgXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdCBcdFx0JGZsaXBDb250YWluZXIucmVtb3ZlQ2xhc3MoZmxpcHApO1xuXHQgfSk7XG5cblxuXHRcdC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwIFwi0LfQsNCx0YvQu9C4INC/0LDRgNC+0LvRjFwiXG5cdFx0JCgnLnBvcHVwX19saW5rX2ZvcmdldC1wYXNzJykuY2xpY2soZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQkYmFja1Bhc3MucmVtb3ZlQ2xhc3MoaGlkZSk7XG5cdFx0XHQkYmFja1JlZy5hZGRDbGFzcyhoaWRlKTtcblx0XHQgXHQkZmxpcENvbnRhaW5lci5hZGRDbGFzcyhmbGlwcCk7XG5cdCB9KTtcbiAgfTtcblxuXG4gXG5cblxuXG4gIHJldHVybiB7XG4gICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBcdHBvcHVwV2luZG93QW5pbWF0ZSgpO1xuICAgICAgfVxuXG4gIH07XG59KSgpOyIsIi8vID09PT09PT09PT09IEhlYWRlciBtb2R1bGUgPT09PT09PT09PT1cbi8vINCt0YLQvtGCINC80L7QtNGD0LvRjCDRgdC+0LTQtdGA0LbQuNGCINCyINGB0LXQsdC1INCw0L3QuNC80LDRhtC40Lgg0L/RgNC40LzQtdC90Y/QtdC80YvQtSDQuiDRiNCw0L/QutCw0Lwg0YHRgtGA0LDQvdC40YbRi1xuXG52YXIgaGVhZGVyTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xuXHQvLyDQntCx0YrRj9Cy0LvQtdC90LjQtSDQsdC40LHQu9C40L7RgtC10LrQuFxuICB2YXIgYmFzZSA9IG5ldyBCYXNlTW9kdWxlO1xuXG5cblx0Ly8g0J7RgtC60YDRi9GC0Ywg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjQtSDRiNCw0L/QutC4XG5cdHZhciBfb3BlbkVkaXRIZWFkZXIgPSBmdW5jdGlvbigpIHtcblx0XHQvL9C/0LXRgNC10LzQtdC90L3Ri9C1XG5cdFx0JHRoaXMgPSAkKHRoaXMpO1xuXHRcdGZyb250ID0gJHRoaXMuY2xvc2VzdCgnLmhlYWRlcl9fc2VjdGlvbicpO1xuXHRcdGJhY2sgPSBmcm9udC5uZXh0KCk7XG5cdFx0aGVhZGVyQm90dG9tID0gZnJvbnQucGFyZW50KCkuc2libGluZ3MoKS5jaGlsZHJlbignLmhlYWRlci1ib3R0b20tZnJvbnQnKTtcblx0XHRoZWFkZXJCb3R0b21FZGl0ICA9IGhlYWRlckJvdHRvbS5wcmV2KCk7XG5cblx0XHQvLyDQkNC90LjQvNCw0YbQuNGPXG5cdFx0YmFjay5jc3MoJ3RvcCcsJzAnKTtcblx0XHRoZWFkZXJCb3R0b21FZGl0LmNzcygndHJhbnNmb3JtJywndHJhbnNsYXRlWSgwKScpO1xuXHRcdGZyb250LmZhZGVPdXQoNTAwKTtcblx0XHQkKCcuaGVhZGVyLWVkaXQtb3ZlcmxheScpLmZhZGVJbig1MDApO1xuXHRcdGhlYWRlckJvdHRvbS5mYWRlT3V0KDUwMCk7XG5cdH1cblxuXG5cdC8vINCX0LDQutGA0YvRgtGMINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40LUg0YjQsNC/0LrQuFxuXHR2YXIgX2Nsb3NlRWRpdEhlYWRlciA9IGZ1bmN0aW9uKGV2KSB7XG5cdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRiYWNrLmNzcygndG9wJywnLTEwMCUnKTtcblx0XHRoZWFkZXJCb3R0b21FZGl0LmNzcygndHJhbnNmb3JtJywndHJhbnNsYXRlWSgxMDAlKScpO1xuXHRcdGZyb250LmZhZGVJbig1MDApO1xuXHRcdCQoJy5oZWFkZXItZWRpdC1vdmVybGF5JykuZmFkZU91dCg1MDApO1xuXHRcdGhlYWRlckJvdHRvbS5mYWRlSW4oNTAwKTtcblx0fVxuXG5cdFx0dmFyIF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcuYnRuX2VkaXQtaGVhZGVyJykub24oJ2NsaWNrJywgX29wZW5FZGl0SGVhZGVyKTtcblx0XHRcdCQoJyNjYW5jZWxfZWRpdF9oZWFkZXInKS5vbignY2xpY2snLCBfY2xvc2VFZGl0SGVhZGVyKTtcblx0XHR9O1xuXG5cbiAgLy8g0J7QsdGJ0LjQuNC1INC/0LXRgNC10LzQtdC90L3Ri9C1XG5cbiAgcmV0dXJuIHtcbiAgXHRjbG9zZUVkaXRIZWFkZXI6IGZ1bmN0aW9uKCl7XG4gIFx0XHRyZXR1cm4gX2Nsb3NlRWRpdEhlYWRlcjtcbiAgXHR9LFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBcdF9zZXRVcExpc3RuZXJzKCk7XG4gICAgfSxcblxuICB9O1xufSkoaGVhZGVyTW9kdWxlKTsiLCIvLyA9PT09PT09PT09PSBBbGJ1bSBhZGQgbW9kdWxlID09PT09PT09PT09XG4vLyDQrdGC0L7RgiDQvNC+0LTRg9C70Ywg0YHQvtC00LXRgNC20LjRgiDQsiDRgdC10LHQtSDRgdC60YDQv9C40YLRiyDQsNC90LjQvNCw0YbQuNC4INC00LvRjyDQtNC+0LHQsNCy0LvQtdC90LjRjyDQsNC70YzQsdC+0LzQvtCyXG5cbnZhciBhbGJ1bUFkZE1vZHVsZSA9IChmdW5jdGlvbigpIHtcblx0Ly8g0J7QsdGK0Y/QstC70LXQvdC40LUg0LHQuNCx0LvQuNC+0YLQtdC60LhcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcblxuXG4gIC8vINCe0YLQutGA0YvRgtGMINC+0LrQvdC+INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INC40LfQvtCx0YDQsNC20LXQvdC40LlcbiAgLy8gISHQn9CV0KDQldCd0JXQodCi0Jgg0JIg0JTQoNCj0JPQntCZINCk0JDQmdCbXG5cdFxuXG5cdC8vINCe0YLQutGA0YvRgtGMINC+0LrQvdC+INC00LvRjyDQtNC+0LHQsNCy0LvQtdC90LjRjyDQsNC70YzQsdC+0LzQvtCyXG4gIHZhciBvcGVuVXBsb2FkQWxidW0gPSBmdW5jdGlvbigpe1xuICAgIGJhc2UuY2hhbmdlQ2xhc3MoJy5tb2RhbF9fYWRkLWFsYnVtLCAubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdkZWwnKVxuICB9O1xuXG5cblxuXG5cblxuXG5cbiAgXG4gIHZhciBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uKCl7XG5cdFx0JCgnLmJ0bl9hbGJ1bS1tYWluLWFkZCcpLm9uKCdjbGljaycsIG9wZW5VcGxvYWRBbGJ1bSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBcdF9zZXRVcExpc3RuZXJzKCk7XG4gICAgfSxcblxuICB9O1xuXG59KSgpOyIsIi8v0J7QsdGA0LDQsdCw0YLRi9Cy0LXQvCBEcmFnRW5kRHJvcHNcbnZhciBpc0FkdmFuY2VkVXBsb2FkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgcmV0dXJuICgoJ2RyYWdnYWJsZScgaW4gZGl2KSB8fCAoJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2KSkgJiYgJ0Zvcm1EYXRhJyBpbiB3aW5kb3cgJiYgJ0ZpbGVSZWFkZXInIGluIHdpbmRvdztcbn0oKTtcbi8vINCe0LHRitGP0LLQu9C10L3QuNC1INCx0LjQsdC70LjQvtGC0LXQutC4XG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XG4vLyDQp9C40YLQsNC10Lwg0YDQsNC30LzQtdGC0LrRgyDQuCDRgdC+0YXRgNCw0L3Rj9C10Lwg0YTQvtGA0LzRg1xudmFyICRmb3JtID0gJCgnI3VwbG9hZCcpO1xudmFyICRpbnB1dCA9ICQoJyNmaWxlJyk7XG52YXIgJHNhdmUgPSAkKCcjc2F2ZScpO1xudmFyICRjbG9zZVVwbG9hZGVySW1nID0gJCgnLm1vZGFsX19jbG9zZS1pbWcnKTtcbnZhciBzaW1wbGVVcGxvYWQgPSBmYWxzZTtcblxuLy8g0JXRgdC70Lgg0YfRgtC+0YLQviDQt9Cw0LrQuNC90YPQu9C4INC00L7QsdCw0LLQu9GP0LXQvCDQutC70LDRgdGBXG5pZiAoaXNBZHZhbmNlZFVwbG9hZCkge1xuXG4gIHZhciB0bXBGaWxlcyA9IGZhbHNlO1xuICB2YXIgZHJvcHBlZEZpbGVzID0gZmFsc2U7XG5cbiAgJGZvcm0ub24oJ2RyYWcgZHJhZ3N0YXJ0IGRyYWdlbmQgZHJhZ292ZXIgZHJhZ2VudGVyIGRyYWdsZWF2ZSBkcm9wJywgZnVuY3Rpb24oZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICB9KVxuICAgIC5vbignZHJhZ292ZXIgZHJhZ2VudGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAkZm9ybS5hZGRDbGFzcygnaXMtZHJhZ292ZXInKTtcbiAgICB9KVxuICAgIC5vbignZHJhZ2xlYXZlIGRyYWdlbmQgZHJvcCcsIGZ1bmN0aW9uKCkge1xuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ2lzLWRyYWdvdmVyJyk7XG4gICAgfSlcbiAgICAub24oJ2Ryb3AnLCBmdW5jdGlvbihlKSB7XG4gICAgICBzaW1wbGVVcGxvYWQgPSBmYWxzZTtcbiAgICAgIGRyb3BwZWRGaWxlcyA9IFtdO1xuICAgICAgdG1wRmlsZXMgPSBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xuICAgICAgY29uc29sZS5sb2codG1wRmlsZXMpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRtcEZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRtcEZpbGVzW2ldLnR5cGUpO1xuICAgICAgICBkcm9wcGVkRmlsZXMucHVzaCh0bXBGaWxlc1tpXSk7XG4gICAgICB9XG5cbiAgICAgICRmb3JtLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICAgIH0pO1xuXG4gICRpbnB1dC5vbignY2hhbmdlJywgZnVuY3Rpb24oZSkgeyAvLyBkcmFnICYgZHJvcCDQndCVINC/0L7QtNC00LXRgNC20LjQstCw0LXRgtGB0Y9cbiAgICBzaW1wbGVVcGxvYWQgPSB0cnVlO1xuICAgICRmb3JtLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICB9KTtcblxuICAvLy8vLy8vLy8vLy8vLy8vL1xuXG5cbn1cblxuXG5cbi8vINCg0YPRh9C90LDRjyDQvtGC0L/RgNCw0LLQutCwXG4kZm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuICBpZiAoJGZvcm0uaGFzQ2xhc3MoJ2lzLXVwbG9hZGluZycpKSByZXR1cm4gZmFsc2U7XG4gICRmb3JtLmFkZENsYXNzKCdpcy11cGxvYWRpbmcnKS5yZW1vdmVDbGFzcygnaXMtZXJyb3InKTtcblxuICBpZiAoaXNBZHZhbmNlZFVwbG9hZCkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmIChzaW1wbGVVcGxvYWQpIHtcbiAgICAgIHZhciBwaG90b3MgPSAkaW5wdXRbMF0uZmlsZXM7XG5cbiAgICAgIGFqYXhVcGxvYWRJbWcocGhvdG9zKTtcbiAgICB9XG5cblxuICAgIGlmIChkcm9wcGVkRmlsZXMpIHtcbiAgICAgIGFqYXhVcGxvYWRJbWcoZHJvcHBlZEZpbGVzKTtcbiAgICB9XG5cbiAgfVxufSk7XG5cbiRzYXZlLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgLy/Qt9Cw0LrRgNGL0LvQuCDQsdC+0LvRjNGI0L7QtSDQvtC60L3QvlxuICAkKCcubW9kYWxfYWRkLXBob3RvIC5tb2RhbF9faGVhZGVyLWNsb3NlJykuY2xpY2soKTtcblxuICAvLyDQvtGC0LrRgNGL0LvQuCDQvNCw0LvQtdC90YzQutC+0LVcbiAgYmFzZS5jaGFuZ2VDbGFzcygnLm1vZGFsLW92ZXJsYXksIC5tb2RhbF9ub3RpZmljYXRpb24gJywnaGlkZScsJ2RlbCcpO1xuXG4gICQuYWpheCh7XG4gICAgdHlwZTogXCJQT1NUXCIsXG4gICAgdXJsOiBsb2NhdGlvbi5ocmVmICsgJ3NhdmVJbWcvJyxcbiAgICBkYXRhOiAnb2snLFxuICAgIGNhY2hlOiBmYWxzZSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgLy8kKCdsaSAucHJlbG9hZF9fY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gTG9nIHRoZSBlcnJvciwgc2hvdyBhbiBhbGVydCwgd2hhdGV2ZXIgd29ya3MgZm9yIHlvdVxuICAgIH1cbiAgfSk7XG4gICAgXG59KTtcblxuJGNsb3NlVXBsb2FkZXJJbWcub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICQuYWpheCh7XG4gICAgdHlwZTogXCJQT1NUXCIsXG4gICAgdXJsOiBsb2NhdGlvbi5ocmVmICsgJ2Nsb3NlVXBsb2FkZXJJbWcvJyxcbiAgICBkYXRhOiAnb2snLFxuICAgIGNhY2hlOiBmYWxzZSxcbiAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGRyb3BwZWRGaWxlcyA9IGZhbHNlO1xuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gTG9nIHRoZSBlcnJvciwgc2hvdyBhbiBhbGVydCwgd2hhdGV2ZXIgd29ya3MgZm9yIHlvdVxuICAgIH1cbiAgfSk7XG5cbn0pO1xuXG5mdW5jdGlvbiBhamF4VXBsb2FkSW1nKHBob3Rvcykge1xuICBhc3luYy5lYWNoU2VyaWVzKHBob3RvcywgZnVuY3Rpb24ocGhvdG8sIGNhbGxiYWNrRWFjaCkge1xuXG4gICAgJCgnLm1vZGFsX19sb2FkLWltZycpLmhpZGUoKTtcbiAgICB2YXIgbGkgPSAkKCc8bGkvPicpLmFkZENsYXNzKCdpbWctaXRlbScpLmFwcGVuZFRvKCQoJ3VsI2ltZy1saXN0JykpO1xuICAgIHZhciBJbWdDb250ID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ2ltZy1jb250JykuYXBwZW5kVG8obGkpO1xuICAgIHZhciBwcmVDb250ID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ3ByZWxvYWRfX2NvbnRhaW5lcicpLmFwcGVuZFRvKEltZ0NvbnQpO1xuICAgIHZhciBwcmVMb2FkID0gJCgnPGRpdi8+JykuYWRkQ2xhc3MoJ3ByZWxvYWRfX2xvYWRpbmcnKS5hcHBlbmRUbyhwcmVDb250KTtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCAzKXsgXG4gICAgICB2YXIgcHJlSXRlbSA9ICQoJzxpLz4nKS5hcHBlbmRUbyhwcmVMb2FkKTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgcHJlQ29udC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgdmFyIGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgYWpheERhdGEuYXBwZW5kKFwicGhvdG9cIiwgcGhvdG8pO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogbG9jYXRpb24uaHJlZiArICdhZGRJbWcvJyxcbiAgICAgIHR5cGU6ICRmb3JtLmF0dHIoJ21ldGhvZCcpLFxuICAgICAgZGF0YTogYWpheERhdGEsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ2lzLXVwbG9hZGluZycpO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIHZhciBzcmMgPSBkYXRhLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgc3JjID1TdHJpbmcoc3JjKS5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcbiAgICAgICAgc3JjID0gc3JjLnN1YnN0cig2KTtcbiAgICAgICAgY29uc29sZS5sb2coc3JjKTtcblxuICAgICAgICB2YXIgaW1hZ2UgPSQoJzxpbWc+Jywge1xuICAgICAgICAgIHNyYzogJy8nK3NyY30pO1xuICAgICAgICBcbiAgICAgICAgLy8g0JrQvtCz0LTQsCDQutCw0YDRgtC40L3QutCwINC30LDQs9GA0YPQt9C40YLRgdGPLCDRgdGC0LDQstC40Lwg0LXRkSDQvdCwINGE0L7QvVxuICAgICAgICBpbWFnZS5vbihcImxvYWRcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICBJbWdDb250LmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCIvJytzcmMrJ1wiKScpO1xuICAgICAgICAgIHByZUNvbnQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICBjYWxsYmFja0VhY2goKTtcblxuICAgICAgICAvL3NvY2tldC5lbWl0KCdldmVudFNlcnZlcicsIHtkYXRhOiAnSGVsbG8gU2VydmVyJ30pO1xuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAkZm9ybS5hZGRDbGFzcyggZGF0YS5zdWNjZXNzID09IHRydWUgPyAnaXMtc3VjY2VzcycgOiAnaXMtZXJyb3InICk7XG5cbiAgICAgICAgaWYgKCFkYXRhLnN1Y2Nlc3MpICRlcnJvck1zZy50ZXh0KGRhdGEuZXJyb3IpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gTG9nIHRoZSBlcnJvciwgc2hvdyBhbiBhbGVydCwgd2hhdGV2ZXIgd29ya3MgZm9yIHlvdVxuICAgICAgfVxuICAgIH0pO1xuXG4gIH0pO1xufSIsIi8vID09PT09PT09PT09IEFsYnVtIG1vZHVsZSA9PT09PT09PT09PVxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0YHQutGA0LjQv9GC0Ysg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRjNGB0Y8g0YLQvtC70YzQutC+INC90LAg0YHRgtGA0LDQvdC40YbQtSDQsNC70YzQsdC+0LzQvtCyLlxuXG52YXIgYWxidW1Nb2R1bGUgPSAoZnVuY3Rpb24oKSB7XG5cdC8vINCe0LHRitGP0LLQu9C10L3QuNC1INCx0LjQsdC70LjQvtGC0LXQutC4XG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XG5cbiAgLy8g0J7QsdGJ0LjQuNC1INC/0LXRgNC10LzQtdC90L3Ri9C1XG4gIHZhciAkZm9ybSA9ICQoJy5wb3B1cF9fZm9ybScpO1xuICB2YXIgJG1vZGFsQWRkQWxidW0gPSAkKCcubW9kYWxfX2FkZC1hbGJ1bScpO1xuICB2YXIgYnV0dG9uID0gJ2FkZC1hbGJ1bV9fYnRuLXNhdmUnO1xuICB2YXIgcG9wdXBUaW1lID0gNTAwMDtcbiAgdmFyIGFsYnVtQ292ZXJJbnB1dCA9ICRtb2RhbEFkZEFsYnVtLmZpbmQoJ2lucHV0W25hbWU9XCJhZGRBbGJ1bUNvdmVyXCJdJyk7XG4gIHZhciBsb2FkZXIgPSAnbG9hZGVyJztcblxuXG4gIC8vINCa0LvQuNC6INC/0L4g0LvQsNC50LrRgyDQuNC70Lgg0LrQvtC80LzQtdC90YLQsNGA0LjRj9C8XG4gXHR2YXIgY2xpY2tMaWtlID0gZnVuY3Rpb24oZSl7XG4gXHRcdGUucHJldmVudERlZmF1bHQoKTtcbiBcdH1cblxuICAvLyDQntGC0LrRgNGL0YLRjCDQvtC60L3QviDQtNC70Y8g0LfQsNCz0YDRg9C30LrQuCDQuNC30L7QsdGA0LDQttC10L3QuNC5XG4gIHZhciBvcGVuVXBsb2FkSW1nID0gZnVuY3Rpb24oKXtcblx0XHRiYXNlLmNoYW5nZUNsYXNzKCcubW9kYWxfYWRkLXBob3RvJywnaGlkZScsJ2RlbCcpO1xuXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJy5tb2RhbC1vdmVybGF5JywnaGlkZScsJ2RlbCcpO1xuXHRcdCQoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykucHJvcCgndmFsdWUnLCBudWxsKTtcblxuXHR9O1xuXG5cdC8vINCX0LDQutGA0YvRgtGMINC80L7QtNCw0LvRjNC90L7QtSDQvtC60L3QviDRgSDQvtC/0L7QstC10YnQtdC90LjRj9C80LhcbiAgdmFyIGNsb3NlTm90aWZpY2F0aW9uID0gZnVuY3Rpb24oZSl7XG4gIFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBcdHZhciBtb2RhbCA9ICQodGhpcykuY2xvc2VzdCgnLm1vZGFsJyk7XG5cdFx0YmFzZS5jaGFuZ2VDbGFzcyhtb2RhbCwnaGlkZScsJ2FkZCcpO1xuXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJy5tb2RhbC1vdmVybGF5JywnaGlkZScsJ2FkZCcpO1xuXHR9O1xuXHQvLyDQl9Cw0LrRgNGL0YLRjCDQvtC60L3QviDQtNC70Y8g0LfQsNCz0YDRg9C30LrQuCDQuNC30L7QsdGA0LDQttC10L3QuNC5XG5cdHZhciBjbG9zZVVwbG9hZCA9IGZ1bmN0aW9uKGUpe1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgbW9kYWwgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tb2RhbCcpO1xuXHRcdGNvbnNvbGUubG9nKG1vZGFsKTtcblx0XHRiYXNlLmNoYW5nZUNsYXNzKG1vZGFsLCdoaWRlJywnYWRkJyk7XG5cdFx0YmFzZS5jaGFuZ2VDbGFzcygnLm1vZGFsLW92ZXJsYXknLCdoaWRlJywnYWRkJyk7XG5cdFx0JChcIi5pbWctbGlzdFwiKS5lbXB0eSgpO1xuXHRcdCQoJy5tb2RhbF9fbG9hZC1pbWcnKS5zaG93KCk7XG5cdFx0JChcIi5zbGlkZXJfX2l0ZW1cIikucmVtb3ZlKCk7XG5cdFx0JCgnLnNsaWRlcl9fdmlldycpLmNzcygndHJhbnNpdGlvbicgLCdub25lJyk7XG5cdFx0Y29uc29sZS5sb2coJ2RvbmUnKTtcblx0fTtcblxuXHQvLyDQntGC0LrRgNGL0YLRjCDQvtC60L3QviDQtNC70Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDRhNC+0YLQviDQuCDQvtGC0L/RgNCw0LLQuNGC0YwgYWpheCDQv9GA0Lgg0YHQvtGF0YDQsNC90LXQvdC40Lgg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xuXG4gIHZhciBvcGVuRWRpdEFsYnVtID0gZnVuY3Rpb24oZSl7XG4gICAgLy8g0J7RgtC60YDRi9GC0Ywg0L7QutC90L5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgYmFzZS5jaGFuZ2VDbGFzcygnLm1vZGFsX2VkaXQtYWxidW0sIC5tb2RhbC1vdmVybGF5JywnaGlkZScsJ2RlbCcpO1xuICAgIH1cblxuXHQvLyDQntGC0LrRgNGL0YLRjCDQvtC60L3QviDQtNC70Y8g0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDRhNC+0YLQviDQuCDQvtGC0L/RgNCw0LLQuNGC0YwgYWpheCDQv9GA0Lgg0YHQvtGF0YDQsNC90LXQvdC40Lgg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRj1xuXG5cdHZhciBvcGVuRWRpdFBob3RvID0gZnVuY3Rpb24oKXtcblx0XHQvLyDQntGC0LrRgNGL0YLRjCDQvtC60L3QvlxuXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJy5tb2RhbF9lZGl0LXBob3RvLCAubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdkZWwnKTtcblxuXHRcdC8vINCU0LDQvdC90YvQtSDQtNC70Y8gYWpheFxuXHRcdHZhciAkZm9ybUVkaXRJbWcgPSAkKCcubW9kYWxfX2Zvcm0tZWRpdCcpO1xuICBcdHZhciBidXR0b24gPSAnaW5wdXRbdHlwZSA9IHN1Ym1pdF0nO1xuICBcdHZhciBwb3B1cFRpbWUgPSA1MDAwO1xuXHQvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCBhamF4INC90LAgPz8/P1xuICAgICQoJy5zdWJtaXQtZWRpdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINC00LvRjyBwb3B1cFxuICAgICAgdmFyIGVycm9yQXJyYXkgPSBiYXNlLnZhbGlkYXRlRm9ybSgkZm9ybUVkaXRJbWcpOyAvLyDQn9GA0L7QstC10YDRj9C10Lwg0YLQtdC60YPRidGD0Y4g0YTQvtGA0LzRgyDQuCDQstGL0LTQsNC10Lwg0LzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0L7RiNC40LHQvtC6XG4gICAgICB2YXIgJGVycm9yQ29udGFpbmVyID0gJGZvcm1FZGl0SW1nLmZpbmQoJy5wb3B1cF9fZXJyb3InKTtcbiAgICAgIGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxuICAgICAgICBlcnJvckFycmF5LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgICAgIGJhc2Uuc2hvd0Vycm9yKGluZGV4LCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9ZWxzZXsgXG4gICAgICBcdC8vINCV0YHQu9C4INC80LDRgdGB0LjQsiDQv9GD0YHRgtC+0LksINCy0YvQv9C+0LvQvdGP0LXQvCDQtNCw0LvRjNGI0LVcbiAgICAgICAgdmFyIHNlcnZBbnMgPSBiYXNlLmFqYXgoJGZvcm1FZGl0SW1nLCcvYWxidW0vPz8/LycpO1xuICAgICAgfSAgICBcblx0fSk7XG59O1xuXG5cdC8vINCe0YLQvNC10L3QsCDQt9Cw0LPRgNGD0LfQutC4INC00LvRjyDQvtC00L3QvtC5INC60LDRgNGC0LjQvdC60Lhcblx0dmFyIF9jYW5jZWxMb2FkID0gZnVuY3Rpb24oZSl7XG5cblxuXHRcdHZhciBjYW5jZWxfaWQgPSBKU09OLnN0cmluZ2lmeSh7aWQ6ICQodGhpcykuaW5kZXgoKX0pO1xuXHRcdGNvbnNvbGUubG9nKGNhbmNlbF9pZCk7XG5cdFx0Ly9kcm9wcGVkRmlsZXNbY2FuY2VsX2lkXSA9IGZhbHNlO1xuXHRcdC8vYWpheERhdGEuYXBwZW5kKFwiaWRcIiwgcGhvdG8pO1xuXG5cdFx0JC5hamF4KHtcblx0XHRcdHR5cGU6IFwiUE9TVFwiLFxuXHRcdFx0dXJsOiBsb2NhdGlvbi5ocmVmICsgJ2Nsb3NlVXBsb2FkZXJPbmVJbWcvJyxcblx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRkYXRhOiBjYW5jZWxfaWQsXG5cdFx0XHR0aW1lb3V0OiAxMDAwLFxuXHRcdFx0Y2FjaGU6IGZhbHNlLFxuXHRcdFx0cHJvY2Vzc0RhdGE6IGZhbHNlLFxuXHRcdFx0c3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHQvL2Ryb3BwZWRGaWxlcyA9IGZhbHNlO1xuXHRcdFx0fSxcblx0XHRcdGVycm9yOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gTG9nIHRoZSBlcnJvciwgc2hvdyBhbiBhbGVydCwgd2hhdGV2ZXIgd29ya3MgZm9yIHlvdVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0JCh0aGlzKS5yZW1vdmUoKTtcblx0XHRpZigkKCcuaW1nLWxpc3QgbGknKS5sZW5ndGggPT0gMCl7XG5cdFx0XHQkKCcubW9kYWxfX2xvYWQtaW1nJykuc2hvdygpO1xuXHRcdH1cblx0XHRcbn07XG5cdC8vINCk0YPQvdC60YbQuNGPINC/0YDQuCDRgdC60YDQvtC70LvQtVxuXHR2YXIgX2ZpeGVkQWRkID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyICRhbGJ1bUNvbnRhaW5lciA9ICQoJy5oZWFkZXItYWxidW1fX2NvbnRlbnQnKTtcblx0XHR2YXIgJGFsYnVtQnRuID0gJCgnLmJ0bl9hbGJ1bS1hZGQnKTtcblx0XHR2YXIgJGJhY2tTaWRlID0gJCgnLmhlYWRlci1hbGJ1bV9fYWJvdXQtc2lkZV9iYWNrJyk7XG5cdFx0dmFyICRmcm9udFNpZGUgPSAkKCcuaGVhZGVyLWFsYnVtX19hYm91dC1zaWRlX2Zyb250Jyk7XG5cdFx0dmFyIGZpeGVkID0gJ2ZpeGVkJztcblx0XHR2YXIgaGlkZSA9ICdoaWRlJztcblxuXHRcdGlmKCgkKCdodG1sJykuc2Nyb2xsVG9wKCk+PSRhbGJ1bUNvbnRhaW5lci5oZWlnaHQoKSkgfHwgKCQoJ2JvZHknKS5zY3JvbGxUb3AoKT49JGFsYnVtQ29udGFpbmVyLmhlaWdodCgpKSl7XG5cblx0XHRcdGlmICghKCRhbGJ1bUJ0bi5oYXNDbGFzcyhmaXhlZCkpKXtcblx0XHQgICAgXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJGFsYnVtQnRuLGZpeGVkLCdhZGQnKTtcblx0XHQgICAgfVxuXHRcdCAgICRiYWNrU2lkZS5yZW1vdmVDbGFzcyhoaWRlKS5hZGRDbGFzcygnZml4ZWRIZWFkZXInKTtcblx0XHQgICBiYXNlLmNoYW5nZUNsYXNzKCRmcm9udFNpZGUsaGlkZSwnYWRkJyk7XG5cdCAgfVxuXHQgIGVsc2V7XG5cdCAgICBcdFx0aWYgKCRhbGJ1bUJ0bi5oYXNDbGFzcyhmaXhlZCkpe1xuXHRcdCAgICBcdFx0YmFzZS5jaGFuZ2VDbGFzcygkYWxidW1CdG4sZml4ZWQsJ2RlbCcpO1xuXHRcdCAgICBcdH1cblx0XHQgICAgXHQkYmFja1NpZGUuYWRkQ2xhc3MoaGlkZSkucmVtb3ZlQ2xhc3MoJ2ZpeGVkSGVhZGVyJyk7XG5cdFx0ICAgIFx0YmFzZS5jaGFuZ2VDbGFzcygkZnJvbnRTaWRlLGhpZGUsJ2RlbCcpO1xuXG5cdCAgICBcdH1cblx0fTtcblxuXG5cblxuXG4vLyDQodC70LDQudC00LXRgFxudmFyIGZ1bmNTbGlkZXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRyYW5zaXRpb25FbmQgPSAndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJztcblxuXHRmdW5jdGlvbiBTbGlkZXIob3B0aW9ucykge1xuXHRcdHZhciBnYWxsZXJ5ICAgICA9IG9wdGlvbnMuZWxlbTtcblx0XHR2YXIgcHJldiAgICAgICAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2NvbnRyb2wtLXByZXYnKTtcblx0XHR2YXIgbmV4dCAgICAgICAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2NvbnRyb2wtLW5leHQnKTtcblxuXHRcdHZhciBzbGlkZXMgICAgICAgICA9IGdhbGxlcnkuZmluZCgnLnNsaWRlcl9faXRlbScpO1xuXHRcdC8vY29uc29sZS5sb2coc2xpZGVzKTtcblx0XHR2YXIgYWN0aXZlU2xpZGUgICAgPSBzbGlkZXMuZmlsdGVyKCcuc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcblx0XHR2YXIgc2xpZGVzQ250ICAgICAgPSBzbGlkZXMubGVuZ3RoO1xuXHRcdHZhciBhY3RpdmVTbGlkZUlkeCA9IGFjdGl2ZVNsaWRlLmluZGV4KCk7XG5cblx0XHR2YXIgaXNSZWFkeSAgICA9IHRydWU7XG5cblxuXHRcdGZ1bmN0aW9uIHNob3dlZFNsaWRlKHNsaWRlciwgaWR4KSB7XG5cdFx0XHRzbGlkZXJcblx0XHRcdFx0LmVxKGlkeCkuYWRkQ2xhc3MoJ3NsaWRlcl9faXRlbS0tYWN0aXZlJylcblx0XHRcdFx0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3NsaWRlcl9faXRlbS0tYWN0aXZlJyk7XG5cdFx0fVxuXG5cdFx0Ly8gZnVuY3Rpb24gZGF0YUNoYW5nZShkaXJlY3Rpb24pIHtcblx0XHQvLyBcdGFjdGl2ZVNsaWRlSWR4ID0gKGRpcmVjdGlvbiA9PT0gJ25leHQnKSA/IGdldElkeChhY3RpdmVTbGlkZUlkeCwgJ25leHQnKSA6IGdldElkeChhY3RpdmVTbGlkZUlkeCwgJ3ByZXYnKTtcblx0XHQvLyB9XG5cblx0XHRmdW5jdGlvbiBnZXRJZHgoY3VycmVudElkeCwgZGlyKSB7XG5cdFx0XHRpZihkaXIgPT09ICdwcmV2Jykge1xuXHRcdFx0XHRyZXR1cm4gKGN1cnJlbnRJZHggLSAxIDwgMCkgPyBzbGlkZXNDbnQgLSAxIDogY3VycmVudElkeCAtIDEgO1xuXHRcdFx0fVxuXHRcdFx0aWYoZGlyID09PSAnbmV4dCcpIHtcblx0XHRcdFx0cmV0dXJuIChjdXJyZW50SWR4ICsgMSA+PSBzbGlkZXNDbnQpID8gMCA6IGN1cnJlbnRJZHggKyAxIDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGN1cnJlbnRJZHg7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlU2xpZGUoc2xpZGVzLCBkaXJlY3Rpb24sIGNsYXNzTmFtZSkge1xuXHRcdFx0dmFyIGN1cnJlbnRTbGlkZSAgICA9IHNsaWRlcy5maWx0ZXIoJy5zbGlkZXJfX2l0ZW0tLWFjdGl2ZScpO1xuXHRcdFx0dmFyIGN1cnJlbnRTbGlkZUlkeCA9IGN1cnJlbnRTbGlkZS5pbmRleCgpO1xuXHRcdFx0dmFyIG5ld1NsaWRlSWR4O1xuXHRcdFx0aWYgKGRpcmVjdGlvbiA9PT0gJ3ByZXYnKSB7XG5cdFx0XHRcdCBuZXdTbGlkZUlkeCA9IGdldElkeChjdXJyZW50U2xpZGVJZHgsICdwcmV2Jyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAnbmV4dCcpIHtcblx0XHRcdFx0bmV3U2xpZGVJZHggPSBnZXRJZHgoY3VycmVudFNsaWRlSWR4LCAnbmV4dCcpO1xuXHRcdFx0fVxuXHRcdFx0JCgnLnNsaWRlcl9fdmlldycpLmNzcygndHJhbnNpdGlvbicgLCdoZWlnaHQgMXMnKTtcblx0XHRcdC8vINCf0L7QtNGB0YLRgNCw0LjQstCw0LXQvCDQstGL0YHQvtGC0YNcblx0XHRcdCQoJy5zbGlkZXJfX3ZpZXcnKS5oZWlnaHQoc2xpZGVzLmVxKG5ld1NsaWRlSWR4KS5jaGlsZHJlbigpLmhlaWdodCgpKTtcblxuXHRcdFx0c2xpZGVzLmVxKG5ld1NsaWRlSWR4KVxuXHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXG5cdFx0XHRcdC5vbmUodHJhbnNpdGlvbkVuZCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKVxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKVxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKCdzbGlkZXJfX2l0ZW0tLWFjdGl2ZScpXG5cdFx0XHRcdFx0XHQudHJpZ2dlcignY2hhbmdlZC1zbGlkZScpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0Y3VycmVudFNsaWRlXG5cdFx0XHRcdC5hZGRDbGFzcyggY2xhc3NOYW1lIClcblx0XHRcdFx0Lm9uZSh0cmFuc2l0aW9uRW5kLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdzbGlkZXJfX2l0ZW0tLWFjdGl2ZSAnICsgY2xhc3NOYW1lKTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXG5cblx0XHQkKGRvY3VtZW50KS5vbignY2hhbmdlZC1zbGlkZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0aXNSZWFkeSA9IHRydWU7XG5cdFx0fSk7XG5cblxuXG5cblx0XHR0aGlzLnByZXYgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmKCAhaXNSZWFkeSApIHJldHVybjtcblx0XHRcdGlzUmVhZHkgPSBmYWxzZTtcblxuXHRcdFx0Y2hhbmdlU2xpZGUoc2xpZGVzLCAncHJldicsICdzbGlkZXJfX2l0ZW0tLWFuaW1hdGUtZmFkZScpO1xuXHRcdFx0Ly8gZGF0YUNoYW5nZSgncHJldicpO1xuXHRcdH07XG5cblxuXHRcdHRoaXMubmV4dCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYoICFpc1JlYWR5ICkgcmV0dXJuO1xuXHRcdFx0aXNSZWFkeSA9IGZhbHNlO1xuXG5cdFx0XHRjaGFuZ2VTbGlkZShzbGlkZXMsICduZXh0JywgJ3NsaWRlcl9faXRlbS0tYW5pbWF0ZS1mYWRlJyk7XG5cdFx0XHQvLyBkYXRhQ2hhbmdlKCduZXh0Jyk7XG5cdFx0fTtcblxuXG5cdFx0cHJldi5vbignY2xpY2snLCB0aGlzLnByZXYpO1xuXHRcdG5leHQub24oJ2NsaWNrJywgdGhpcy5uZXh0KTtcblx0fSAvLyBTbGlkZXJcblxuXG5cblx0dmFyIHNsaWRlciA9IG5ldyBTbGlkZXIoe1xuXHRcdGVsZW06ICQoJyNzbGlkZXInKVxuXHR9KTtcbn07XG4vLyDQntGC0LrRgNGL0YLRjCDRgdC70LDQudC00LXRgFxuXG5cdHZhciBvcGVuU2xpZGVyID0gZnVuY3Rpb24oZSl7XG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJy5tb2RhbC0tc2xpZGVyLCAubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdkZWwnKVxuXHRcdC8vINC90LDRhdC+0LTQuNC8INCy0YHQtSDQutCw0YDRgtC40L3QutC4INC40Lcg0LDQu9GM0LHQvtC80LBcblx0XHR2YXIgaW1hZ2VzID0gJCgnLnBob3RvLWNhcmRfX2hlYWQnKSxcblx0XHRcdFx0Y3VycmVudEltZyA9ICQodGhpcykuY2xvc2VzdCgnLnBob3RvLWNhcmRfX2hlYWQnKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhjdXJyZW50SW1nKTtcblx0XHQkKCcucGhvdG8tY2FyZF9faGVhZCcpLmVhY2goZnVuY3Rpb24oaSwgaW1nKXtcblx0XHRcdFx0dmFyIHVybCA9ICgkKHRoaXMpLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLnNwbGl0KCcsJylbMF0pO1xuXHRcdFx0XHR2YXIgc3JjID0gdXJsLnN1YnN0cig1LCB1cmwubGVuZ3RoLTcgKTtcblx0XHRcdFx0dmFyIGNvbnQgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnc2xpZGVyX19pdGVtJykuYXBwZW5kVG8oJCgnLnNsaWRlcl9fdmlldycpKTtcblxuXHRcdFx0XHR2YXIgaW1nID0gJCgnPGltZz4nKS5hZGRDbGFzcygnc2xpZGVyX19pbWcnKS5hcHBlbmRUbyhjb250KS5hdHRyKCdzcmMnLHNyYyk7XG5cblx0XHRcdFx0aWYgKHVybD09Y3VycmVudEltZy5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKS5zcGxpdCgnLCcpWzBdKXtcblx0XHRcdFx0XHRjb250LnJlbW92ZUNsYXNzKCdzbGlkZXJfX2l0ZW0tLWxvYWRpbmcnKS5hZGRDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcblx0XHRcdFx0XHRcdCQoJy5zbGlkZXJfX3ZpZXcnKS5oZWlnaHQoY29udC5jaGlsZHJlbigpLmhlaWdodCgpKTtcblx0XHRcdFx0XHQgY29udC5uZXh0KCkuYWRkQ2xhc3MoJ3NsaWRlcl9faXRlbS0tbG9hZGluZycpO1xuXHRcdFx0XHR9XG5cblx0XHR9KVxuXHRcdGZ1bmNTbGlkZXIoKTtcblx0fTtcblx0dmFyIF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24oKSB7XG5cdFx0JCgnLmJ0bl9lZGl0LXBob3RvJykub24oJ2NsaWNrJywgb3BlbkVkaXRQaG90byk7XG5cdFx0JCgnLmJ0bl9hbGJ1bS1hZGQnKS5vbignY2xpY2snLCBvcGVuVXBsb2FkSW1nKTtcblx0XHQkKCcubW9kYWxfX2hlYWRlci1jbG9zZSwgLm1vZGFsX19jYW5jZWxCdXR0b24gJykub24oJ2NsaWNrJywgY2xvc2VVcGxvYWQpO1xuXHRcdCQoJy5tb2RhbF9fY2FuY2VsTm90aWYnKS5vbignY2xpY2snLCBjbG9zZU5vdGlmaWNhdGlvbik7XG5cdFx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfZml4ZWRBZGQpO1xuXHRcdCQoJ2JvZHknKS5vbignY2xpY2snLCcuaW1nLWl0ZW0nLF9jYW5jZWxMb2FkKTtcblx0XHQkKCcubG91cGUnKS5vbignY2xpY2snLCBvcGVuU2xpZGVyKTtcblx0XHQkKCcuYnRuLWVkaXRBbGJ1bScpLm9uKCdjbGljaycsIG9wZW5FZGl0QWxidW0pO1xuXHRcdCQoJy5pbmZvX19pdGVtJykub24oJ2NsaWNrJywgY2xpY2tMaWtlKTtcblx0fTtcblxuXG5cbiAgcmV0dXJuIHtcbiAgXHRjbG9zZTogZnVuY3Rpb24oKXtcbiAgXHRcdHJldHVybiBjbG9zZVVwbG9hZDtcbiAgXHR9LFxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBcdF9zZXRVcExpc3RuZXJzKCk7XG4gICAgfSxcblxuICB9O1xufSkoKTsiLCJmdW5jdGlvbiBpbml0UG9wdXAgKCkge1xuXG5cdC8vINCk0YPQvdC60YbQuNGPINC+0YLQutGA0YvRgtC40Y8g0L/QvtC/0LDQv9CwXG5cdGZ1bmN0aW9uIHBvcHVwKGlkLCBhY3Rpb24pIHtcblx0XHR2YXIgYm9keSAgICAgID0gJCgnYm9keScpO1xuXHRcdHZhciBjbGFzc05hbWUgPSAnaGlkZSc7XG5cblx0XHRpZihhY3Rpb24gPT0gJ29wZW4nKSB7XG5cdFx0XHRib2R5LmFkZENsYXNzKCduby1zY3JvbGwnKTtcblxuXHRcdFx0JCgnIycgKyBpZClcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKVxuXHRcdFx0XHQucGFyZW50KClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZSApO1xuXHRcdH0gZWxzZSBpZihhY3Rpb24gPT0gJ2Nsb3NlJykge1xuXG5cdFx0XHRib2R5LnJlbW92ZUNsYXNzKCduby1zY3JvbGwnKTtcblxuXHRcdFx0aWYoaWQgPT0gJ2FsbCcpIHtcblx0XHRcdFx0JCgnLm1vZGFsJylcblx0XHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXG5cdFx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JCgnIycgKyBpZClcblx0XHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXG5cdFx0XHRcdFx0LnBhcmVudCgpXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cblx0Ly8g0J7RgtC60YDRi9GC0LjQtSDQv9C+0L/QsNC/0L7QsiDQv9C+INC60LvQuNC60YMg0L3QsCDRjdC70LXQvNC10L3RgtGLINGBINCw0YLRgNC40LHRg9GC0L7QvCBkYXRhLW1vZGFsXG5cdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS1tb2RhbF0nLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgJGVsICAgICA9ICQodGhpcyk7XG5cdFx0XHR2YXIgcG9wdXBJZCA9ICRlbC5hdHRyKCdkYXRhLW1vZGFsJyk7XG5cblx0XHRcdHBvcHVwKCdhbGwnLCAnY2xvc2UnKTtcblx0XHRcdHBvcHVwKHBvcHVwSWQsICdvcGVuJyk7XG5cdH0pO1xuXG5cblx0Ly8g0KHQvtCx0YvRgtC40Y8g0L/RgNC4INC60LvQuNC60LUg0Y3Qu9C10LzQtdC90YIg0YEg0LDRgtGA0LjQsdGD0YLQvtC8IGRhdGEtYWN0aW9uPVwiY2xvc2VcIlxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtYWN0aW9uPVwiY2xvc2VcIl0nLCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgYnRuICAgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIG1vZGFsID0gYnRuLmNsb3Nlc3QoJy5tb2RhbCcpO1xuXG5cdFx0XHRwb3B1cChtb2RhbC5hdHRyKCdpZCcpLCAnY2xvc2UnKTtcblx0fSk7XG5cbn0gLy8gaW5pdFBvcHVwKClcblxuXG5cbmluaXRQb3B1cCgpOyIsIi8vINCh0LvQsNC50LTQtdGAXG4oZnVuY3Rpb24oKSB7XG5cdHZhciB0cmFuc2l0aW9uRW5kID0gJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCc7XG5cblx0ZnVuY3Rpb24gU2xpZGVyKG9wdGlvbnMpIHtcblx0XHR2YXIgZ2FsbGVyeSAgICAgPSBvcHRpb25zLmVsZW07XG5cdFx0dmFyIHByZXYgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19jb250cm9sLS1wcmV2Jyk7XG5cdFx0dmFyIG5leHQgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19jb250cm9sLS1uZXh0Jyk7XG5cblx0XHR2YXIgc2xpZGVzICAgICAgICAgPSBnYWxsZXJ5LmZpbmQoJy5zbGlkZXJfX2l0ZW0nKTtcblx0XHR2YXIgYWN0aXZlU2xpZGUgICAgPSBzbGlkZXMuZmlsdGVyKCcuc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcblx0XHR2YXIgc2xpZGVzQ250ICAgICAgPSBzbGlkZXMubGVuZ3RoO1xuXHRcdHZhciBhY3RpdmVTbGlkZUlkeCA9IGFjdGl2ZVNsaWRlLmluZGV4KCk7XG5cblx0XHR2YXIgaXNSZWFkeSAgICA9IHRydWU7XG5cblxuXHRcdGZ1bmN0aW9uIHNob3dlZFNsaWRlKHNsaWRlciwgaWR4KSB7XG5cdFx0XHRzbGlkZXJcblx0XHRcdFx0LmVxKGlkeCkuYWRkQ2xhc3MoJ3NsaWRlcl9faXRlbS0tYWN0aXZlJylcblx0XHRcdFx0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3NsaWRlcl9faXRlbS0tYWN0aXZlJyk7XG5cdFx0fVxuXG5cdFx0Ly8gZnVuY3Rpb24gZGF0YUNoYW5nZShkaXJlY3Rpb24pIHtcblx0XHQvLyBcdGFjdGl2ZVNsaWRlSWR4ID0gKGRpcmVjdGlvbiA9PT0gJ25leHQnKSA/IGdldElkeChhY3RpdmVTbGlkZUlkeCwgJ25leHQnKSA6IGdldElkeChhY3RpdmVTbGlkZUlkeCwgJ3ByZXYnKTtcblx0XHQvLyB9XG5cblx0XHRmdW5jdGlvbiBnZXRJZHgoY3VycmVudElkeCwgZGlyKSB7XG5cdFx0XHRpZihkaXIgPT09ICdwcmV2Jykge1xuXHRcdFx0XHRyZXR1cm4gKGN1cnJlbnRJZHggLSAxIDwgMCkgPyBzbGlkZXNDbnQgLSAxIDogY3VycmVudElkeCAtIDEgO1xuXHRcdFx0fVxuXHRcdFx0aWYoZGlyID09PSAnbmV4dCcpIHtcblx0XHRcdFx0cmV0dXJuIChjdXJyZW50SWR4ICsgMSA+PSBzbGlkZXNDbnQpID8gMCA6IGN1cnJlbnRJZHggKyAxIDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGN1cnJlbnRJZHg7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlU2xpZGUoc2xpZGVzLCBkaXJlY3Rpb24sIGNsYXNzTmFtZSkge1xuXHRcdFx0dmFyIGN1cnJlbnRTbGlkZSAgICA9IHNsaWRlcy5maWx0ZXIoJy5zbGlkZXJfX2l0ZW0tLWFjdGl2ZScpO1xuXHRcdFx0dmFyIGN1cnJlbnRTbGlkZUlkeCA9IGN1cnJlbnRTbGlkZS5pbmRleCgpO1xuXHRcdFx0dmFyIG5ld1NsaWRlSWR4O1xuXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAncHJldicpIHtcblx0XHRcdFx0IG5ld1NsaWRlSWR4ID0gZ2V0SWR4KGN1cnJlbnRTbGlkZUlkeCwgJ3ByZXYnKTtcblx0XHRcdH1cblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICduZXh0Jykge1xuXHRcdFx0XHRuZXdTbGlkZUlkeCA9IGdldElkeChjdXJyZW50U2xpZGVJZHgsICduZXh0Jyk7XG5cdFx0XHR9XG5cblx0XHRcdHNsaWRlcy5lcShuZXdTbGlkZUlkeClcblx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKVxuXHRcdFx0XHQub25lKHRyYW5zaXRpb25FbmQsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCQodGhpcylcblx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lIClcblx0XHRcdFx0XHRcdC5hZGRDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUnKVxuXHRcdFx0XHRcdFx0LnRyaWdnZXIoJ2NoYW5nZWQtc2xpZGUnKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdGN1cnJlbnRTbGlkZVxuXHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXG5cdFx0XHRcdC5vbmUodHJhbnNpdGlvbkVuZCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUgJyArIGNsYXNzTmFtZSk7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblxuXG5cdFx0JChkb2N1bWVudCkub24oJ2NoYW5nZWQtc2xpZGUnLCBmdW5jdGlvbigpIHtcblx0XHRcdGlzUmVhZHkgPSB0cnVlO1xuXHRcdH0pO1xuXG5cblxuXG5cdFx0dGhpcy5wcmV2ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiggIWlzUmVhZHkgKSByZXR1cm47XG5cdFx0XHRpc1JlYWR5ID0gZmFsc2U7XG5cblx0XHRcdGNoYW5nZVNsaWRlKHNsaWRlcywgJ3ByZXYnLCAnc2xpZGVyX19pdGVtLS1hbmltYXRlLWZhZGUnKTtcblx0XHRcdC8vIGRhdGFDaGFuZ2UoJ3ByZXYnKTtcblx0XHR9O1xuXG5cblx0XHR0aGlzLm5leHQgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmKCAhaXNSZWFkeSApIHJldHVybjtcblx0XHRcdGlzUmVhZHkgPSBmYWxzZTtcblxuXHRcdFx0Y2hhbmdlU2xpZGUoc2xpZGVzLCAnbmV4dCcsICdzbGlkZXJfX2l0ZW0tLWFuaW1hdGUtZmFkZScpO1xuXHRcdFx0Ly8gZGF0YUNoYW5nZSgnbmV4dCcpO1xuXHRcdH07XG5cblxuXHRcdHByZXYub24oJ2NsaWNrJywgdGhpcy5wcmV2KTtcblx0XHRuZXh0Lm9uKCdjbGljaycsIHRoaXMubmV4dCk7XG5cdH0gLy8gU2xpZGVyXG5cblxuXG5cdHZhciBzbGlkZXIgPSBuZXcgU2xpZGVyKHtcblx0XHRlbGVtOiAkKCcjc2xpZGVyJylcblx0fSk7XG59KSgpOyIsIi8vID09PT09PT09PT09IGFqYXgtTG9naW4tY292ZXIgbW9kdWxlID09PT09PT09PT09XG4vLyDQrdGC0L7RgiDQvNC+0LTRg9C70Ywg0YHQvtC00LXRgNC20LjRgiDQsiDRgdC10LHQtSDQsNC90LjQvNCw0YbQuNGOINC00LvRjyDQsdC70L7QutCwINCw0LLRgtC+0YDQuNC30LDRhtC4LlxuXG5cbnZhciBhamF4TG9naW5Db3Zlck1vZHVsZSA9IChmdW5jdGlvbigpIHtcblxuXHQvLyDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSDQvNC+0LTRg9C70Y8uXG4gIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XG4gIC8vINCf0LXRgNC10LzQtdC90L3Ri9C1IFxuICB2YXIgJGZvcm0gPSAkKCcucG9wdXBfX2Zvcm0nKTtcblx0dmFyICRmb3JtTG9naW4gPSAkZm9ybS5maWx0ZXIoJy5wb3B1cF9fZm9ybS1sb2dpbicpO1xuXHR2YXIgJGZvcm1SZWcgPSAkZm9ybS5maWx0ZXIoJy5wb3B1cF9fZm9ybS1yZWdpc3RyYXRpb24nKTtcblx0dmFyICRmb3JtUmVjb3ZlciA9ICRmb3JtLmZpbHRlcignLnBvcHVwX19mb3JtLXJlY292ZXInKTtcblx0dmFyIGJ1dHRvbiA9ICdpbnB1dFt0eXBlID0gc3VibWl0XSc7XG5cdHZhciBwb3B1cFRpbWUgPSA1MDAwO1xuXG5cdC8vINCa0L3QvtC/0LrQuFxuXG5cdHZhciBsb2dpbkJ0biA9ICRmb3JtTG9naW4uZmluZChidXR0b24pO1xuXHR2YXIgcmVnQnRuID0gJGZvcm1SZWcuZmluZChidXR0b24pO1xuXHR2YXIgcmVjb3ZlckJ0biA9ICRmb3JtUmVjb3Zlci5maW5kKGJ1dHRvbik7XG5cblxuXG5cdCBcdC8vINCe0YLQv9GA0LDQstC70Y/QtdC8IGFqYXgg0L3QsCBsb2dpblxuXHR2YXIgbG9naW4gPSBmdW5jdGlvbihlKXtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyICR0aGlzRm9ybSA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpO1xuXHRcdHZhciAkZXJyb3JDb250YWluZXIgPSAkdGhpc0Zvcm0uZmluZCgnLnBvcHVwX19lcnJvcicpO1xuXHRcdHZhciBlcnJvckFycmF5ID0gYmFzZS52YWxpZGF0ZUZvcm0oJHRoaXNGb3JtKTsgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8INGC0LXQutGD0YnRg9GOINGE0L7RgNC80YMg0Lgg0LLRi9C00LDQtdC8INC80LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINC+0YjQuNCx0L7QulxuXHRcdFx0aWYoZXJyb3JBcnJheS5sZW5ndGggPiAwKXtcdC8vINCV0YHQu9C4INCyINC80LDRgdGB0LjQstC1INC10YHRgtGMINC+0YjQuNCx0LrQuCwg0LfQvdCw0YfQuNGCINCy0YvQtNCw0LXQvCDQvtC60L3Qviwg0YEg0L3QvtC80LXRgNC+0Lwg0L7RiNC40LHQutC4XG4gIFx0XHRcdGVycm9yQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XG4gIFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xuICBcdFx0XHR9KTtcbiAgXHRcdFx0fWVsc2V7IC8vINCV0YHQu9C4INC80LDRgdGB0LjQsiDQv9GD0YHRgtC+0LksINCy0YvQv9C+0LvQvdGP0LXQvCDQtNCw0LvRjNGI0LVcbiAgXHRcdFx0c2VydkFucyA9IGJhc2UuYWpheCgkdGhpc0Zvcm0sJy9sb2dpbi8nKTtcbiAgXHRcdFx0c2VydkFucy5kb25lKGZ1bmN0aW9uKGFucyl7XG4gIFx0XHRcdFx0aWYoIWFucy5zdGF0dXMpe1xuICBcdFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoYW5zLm1lc3NhZ2UsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xuICBcdFx0XHRcdH1lbHNle1xuICBcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcbiAgXHRcdFx0XHR9XG4gIFx0XHRcdH0pO1xuICBcdFx0fVxuICB9XG5cbiAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10LwgYWpheCDQvdCwIHJlZ1xuXG4gIHZhciByZWdpc3RyYXRpb24gPSBmdW5jdGlvbihlKXtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyICR0aGlzRm9ybSA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpO1xuXHRcdHZhciBlcnJvckFycmF5ID0gYmFzZS52YWxpZGF0ZUZvcm0oJHRoaXNGb3JtKTsgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8INGC0LXQutGD0YnRg9GOINGE0L7RgNC80YMg0Lgg0LLRi9C00LDQtdC8INC80LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINC+0YjQuNCx0L7QulxuXHRcdHZhciAkZXJyb3JDb250YWluZXIgPSAkdGhpc0Zvcm0uZmluZCgnLnBvcHVwX19lcnJvcicpO1xuXHRcdGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxuXHRcdFx0ZXJyb3JBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdFx0YmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xuXHRcdFx0fSk7XG5cdFx0fWVsc2V7IC8vINCV0YHQu9C4INC80LDRgdGB0LjQsiDQv9GD0YHRgtC+0LksINCy0YvQv9C+0LvQvdGP0LXQvCDQtNCw0LvRjNGI0LVcblx0XHRcdHNlcnZBbnMgPSBiYXNlLmFqYXgoJHRoaXNGb3JtLCcvcmVnLycpO1xuXHRcdFx0c2VydkFucy5kb25lKGZ1bmN0aW9uKGFucyl7XG5cdFx0XHRcdGlmKCFhbnMuc3RhdHVzKXtcblx0XHRcdFx0XHRiYXNlLnNob3dFcnJvcihhbnMubWVzc2FnZSwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cbiAgfVxuXG4gIC8vINCe0YLQv9GA0LDQstC70Y/QtdC8IGFqYXgg0L3QsCByZWNvdmVyXG5cbiAgdmFyIHJlY292ZXIgPSBmdW5jdGlvbihlKXtcbiAgXHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdCAgXHRcdHZhciAkdGhpc0Zvcm0gPSAkKHRoaXMpLmNsb3Nlc3QoJ2Zvcm0nKTtcblx0ICBcdFx0Ly8g0J/QsNGA0LDQvNC10YLRgNGLINC00LvRjyBwb3B1cFxuXHQgIFx0XHR2YXIgZXJyb3JBcnJheSA9IGJhc2UudmFsaWRhdGVGb3JtKCR0aGlzRm9ybSk7IC8vINCf0YDQvtCy0LXRgNGP0LXQvCDRgtC10LrRg9GJ0YPRjiDRhNC+0YDQvNGDINC4INCy0YvQtNCw0LXQvCDQvNCw0YHRgdC40LIg0LjQvdC00LXQutGB0L7QsiDQvtGI0LjQsdC+0Lpcblx0ICBcdFx0dmFyICRlcnJvckNvbnRhaW5lciA9ICR0aGlzRm9ybS5maW5kKCcucG9wdXBfX2Vycm9yJyk7XG5cdCAgXHRcdGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxuXHQgIFx0XHRcdGVycm9yQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XG5cdCAgXHRcdFx0XHRiYXNlLnNob3dFcnJvcihpbmRleCwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XG5cdCAgXHRcdFx0fSk7XG5cdCAgXHRcdH1lbHNleyAvLyDQldGB0LvQuCDQvNCw0YHRgdC40LIg0L/Rg9GB0YLQvtC5LCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQsNC70YzRiNC1XG5cdCAgXHRcdFx0c2VydkFucyA9IGJhc2UuYWpheCgkdGhpc0Zvcm0sJy9yZWNvdmVyLycpO1xuXHQgIFx0XHRcdHNlcnZBbnMuZG9uZShmdW5jdGlvbihhbnMpe1xuXHQgIFx0XHRcdFx0aWYoIWFucy5zdGF0dXMpe1xuXHQgIFx0XHRcdFx0XHRyZXR1cm4gYmFzZS5zaG93RXJyb3IoYW5zLm1lc3NhZ2UsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xuXHQgIFx0XHRcdFx0fWVsc2V7XG5cdCAgXHRcdFx0XHRcdGJhc2UuY2xlYXJJbnB1dHMoJHRoaXNGb3JtKTtcblx0ICBcdFx0XHRcdFx0cmV0dXJuIGJhc2Uuc2hvd0Vycm9yKGFucy5tZXNzYWdlLCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcblx0ICBcdFx0XHRcdFx0XG5cdCAgXHRcdFx0XHR9XG5cdCAgXHRcdFx0fSk7XG5cdCAgXHRcdH1cbiAgfVxuXG4gIFx0XG5cbiAgXHRcbiAgXHRcdFxuXG5cblxuIFxuICB2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpe1xuICBcdGxvZ2luQnRuLm9uKCdjbGljaycsbG9naW4pO1xuICBcdHJlZ0J0bi5vbignY2xpY2snLHJlZ2lzdHJhdGlvbik7XG4gIFx0cmVjb3ZlckJ0bi5vbignY2xpY2snLHJlY292ZXIpXG4gIH1cbiBcblxuXG5cbiAgcmV0dXJuIHtcbiAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIFx0X3NldFVwTGlzdG5lcnMoKTtcbiAgICAgIH1cblxuICB9O1xufSkoKTsiLCIvLyA9PT09PT09PT09PSBhamF4IGhlYWRlciBtb2R1bGUgPT09PT09PT09PT1cbi8vINCt0YLQvtGCINC80L7QtNGD0LvRjCDRgdC+0LTQtdGA0LbQuNGCINCyINGB0LXQsdC1IGFqYXgg0L/RgNC40LzQtdC90Y/QtdC80YvQtSDQuiDRiNCw0L/QutCw0Lwg0YHRgtGA0LDQvdC40YbRi1xuXG52YXIgYWpheEhlYWRlck1vZHVsZSA9IChmdW5jdGlvbigpIHtcblx0Ly8g0J7QsdGK0Y/QstC70LXQvdC40LUg0LHQuNCx0LvQuNC+0YLQtdC60LhcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcblxuICAvLyDQntCx0YnQuNC1XG4gIHZhciAkaGVhZGVyTWFpbiA9ICQoJy5oZWFkZXItbWFpbicpO1xuICB2YXIgJGhlYWRlckFsYnVtID0gJCgnLmhlYWRlci1hbGJ1bScpO1xuICB2YXIgJGZvb3RlciA9ICQoJy5mb290ZXInKTtcbiAgdmFyIHVybFBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gIHZhciBjbG9zZUVkaXRIZWFkZXIgPSBoZWFkZXJNb2R1bGUuY2xvc2VFZGl0SGVhZGVyKCk7XG4gIHZhciBoZWFkZXJGcm9udCA9ICRoZWFkZXJNYWluLmZpbmQoJy5oZWFkZXJfX3NlY3Rpb25fbWFpbi1mcm9udCcpO1xuICB2YXIgaGVhZGVyQmFjayA9ICRoZWFkZXJNYWluLmZpbmQoJy5oZWFkZXJfX3NlY3Rpb25fbWFpbi1iYWNrJyk7XG4gIHZhciBhamF4RmxhZyA9IGZhbHNlO1xuICB2YXIgdGhpc0FqYXg7XG5cbiAgdmFyIG5ld0JhY2tHcm91bmQ7XG5cblxuXG4gIC8vINCa0L3QvtC/0LrQuFxuICB2YXIgc2F2ZUJ0biA9ICRoZWFkZXJNYWluLmZpbmQoJy5idG4tLXNhdmUnKTtcbiAgdmFyIHVwbG9hZEF2YXRhciA9ICRoZWFkZXJNYWluLmZpbmQoJy51c2VyLWJsb2NrX19waG90by1lZGl0Jyk7XG4gIHZhciB1cGxvYWRCZyA9ICRoZWFkZXJNYWluLmZpbmQoJy5oZWFkZXJfX3BhcnQtLXppcF9tYWluIC51cGxvYWQnKTtcbiAgdmFyIHVwbG9hZEJnQWxidW0gPSAkaGVhZGVyQWxidW0uZmluZCgnLnVwbG9hZCcpO1xuICB2YXIgY2FuY2VsQnRuID0gJGhlYWRlck1haW4uZmluZCgnI2NhbmNlbF9lZGl0X2hlYWRlcicpO1xuXG4gIHZhciBzYXZlQnRuQWxidW0gPSAkaGVhZGVyQWxidW0uZmluZCgnLmJ0bi0tc2F2ZScpO1xuXG5cblxuICAvL9Ca0LvQsNGB0YHRi1xuXG4gIHZhciBjbGFzc0NhbmNlbCA9ICdjYW5jZWwnO1xuXG4gICAvLyDQlNC10YTQvtC70L3Ri9C1INGB0YLQuNC70LhcblxuICB2YXIgaGVhZGVyQmdTdHlsZSA9ICRoZWFkZXJNYWluLmF0dHIoJ3N0eWxlJyk7XG4gIHZhciBmb290ZXJCZ1N0eWxlID0gJGZvb3Rlci5hdHRyKCdzdHlsZScpO1xuXG5cblxuXG4gICAvLyDQpNGD0L3QutGG0LjQuFxuXG5cbiAgLy8g0JfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LLRi9Cx0L7RgCDRhNCw0LnQu9CwXG4gIHZhciBsb2NrU2VsRmlsZSA9IGZ1bmN0aW9uKGUpe1xuICBcdGlmKGFqYXhGbGFnKXtcbiAgXHRcdGUucHJldmVudERlZmF1bHQoKTtcbiAgXHR9XG4gIH1cblxuXG4gIC8vINCf0YDQtdCy0YzRjiDQsNCy0LDRgtGC0LDRgNC60LhcbiAgdmFyIGNoYW5nZUF2YXRhciA9IGZ1bmN0aW9uKCl7XG4gIFx0aWYoYWpheEZsYWcpe1xuICBcdFx0YWpheEZsYWcgPSBmYWxzZTtcbiAgXHRcdHJldHVybjtcbiAgXHR9XG4gIFx0YWpheEZsYWcgPSB0cnVlO1xuICBcdHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICBcdHZhciAkdGhpcyA9ICQodGhpcyk7XG4gIFx0dmFyIGJsb2NrUGhvdG8gPSAkdGhpcy5jbG9zZXN0KCcudXNlci1ibG9ja19fcGhvdG8nKTtcbiAgXHR2YXIgZmlsZUlucHV0ID0gJHRoaXMuZmluZCgnaW5wdXRbbmFtZT1cInBob3RvXCJdJyk7XG4gIFx0dmFyIHBob3RvID0gZmlsZUlucHV0WzBdLmZpbGVzWzBdO1xuICBcdGlmKCFwaG90byl7XG4gIFx0XHRhamF4RmxhZyA9IGZhbHNlO1xuICAgICAgdmFyIGZyb250QXZhdGFyID0gaGVhZGVyRnJvbnQuZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvJykuYXR0cignc3R5bGUnKTtcbiAgXHRcdGJsb2NrUGhvdG8uYXR0cignc3R5bGUnLGZyb250QXZhdGFyKTtcbiAgXHRcdHJldHVybjtcbiAgXHR9XG5cbiAgXHRibG9ja1Bob3RvLmFkZENsYXNzKCdsb2FkZXInKTtcbiAgXHRmb3JtRGF0YS5hcHBlbmQoXCJ1c2VyQXZhdGFyXCIscGhvdG8pO1xuXG4gIFx0dGhpc0FqYXggPSAkLmFqYXgoe1xuICAgICAgdXJsOiB1cmxQYXRoICsgJ2NoYW5nZVBob3RvLycsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IGZvcm1EYXRhLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKXtcbiAgICAgIFx0YWpheEZsYWcgPSBmYWxzZTtcbiAgICAgICAgYmxvY2tQaG90by5yZW1vdmVDbGFzcygnbG9hZGVyJyk7XG4gICAgICAgIGJsb2NrUGhvdG8uY3NzKHtcbiAgICAgICAgXHQnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoJysgcmVzLm5ld0NvdmVyICsnKSdcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgXHR9KTtcblxuXG4gIH1cblxuICAvLyDQn9GA0LXQstGM0Y4g0LHQtdC60YDQsNGD0L3QtNCwXG4gIHZhciBjaGFuZ2VCYWNrR3JvdW5kID0gZnVuY3Rpb24oYnRuLGhlYWRlcil7XG4gIGlmKGFqYXhGbGFnKXtcbiAgXHRyZXR1cm47XG4gIH1cbiAgYWpheEZsYWcgPSB0cnVlO1xuICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgdmFyICR0aGlzID0gYnRuO1xuICB2YXIgZmlsZUlucHV0ID0gJHRoaXMuZmluZCgnaW5wdXRbbmFtZT1cImJnXCJdJyk7XG4gIHZhciBwaG90byA9IGZpbGVJbnB1dFswXS5maWxlc1swXTtcbiAgdmFyIGJhY2tncm91bmQgPSAnJztcbiAgaWYoIXBob3RvKXtcbiAgICAvL3ZhciBoZWFkZXJCYWNrZ3JvdW5kID0gYXR0cignc3R5bGUnKTtcbiAgXHQgaGVhZGVyLmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJyA6ICd1cmwoJysgbmV3QmFja0dyb3VuZCArJyknXG4gICAgICB9KTtcbiAgICAgJGZvb3Rlci5jc3Moe1xuICAgICAgICAnYmFja2dyb3VuZC1pbWFnZScgOiAndXJsKCcrIG5ld0JhY2tHcm91bmQgKycpJ1xuICAgICAgfSk7XG4gIFx0YWpheEZsYWcgPSBmYWxzZTtcbiAgXHRyZXR1cm47XG4gIH1cblxuICBpZihoZWFkZXIgPT0gJGhlYWRlckFsYnVtKXtcbiAgICBiYWNrZ3JvdW5kID0gXCJuZXdBbGJvbUNvdmVyXCI7XG4gIH1lbHNlIGlmKGhlYWRlciA9PSAkaGVhZGVyTWFpbil7XG4gICAgYmFja2dyb3VuZCA9IFwidXNlckJhY2tHcm91bmRcIjtcbiAgfVxuXG4gIGhlYWRlci5maW5kKCcucHJlbG9hZF9fY29udGFpbmVyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICBmb3JtRGF0YS5hcHBlbmQoYmFja2dyb3VuZCxwaG90byk7XG4gIHRoaXNBamF4ID0gJC5hamF4KHtcbiAgICB1cmw6IHVybFBhdGggKyAnY2hhbmdlUGhvdG8vJyxcbiAgICB0eXBlOiBcIlBPU1RcIixcbiAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcyl7XG4gICAgICBoZWFkZXIuZmluZCgnLnByZWxvYWRfX2NvbnRhaW5lcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgYWpheEZsYWcgPSBmYWxzZTtcbiAgICAgIFx0aGVhZGVyLmNzcyh7XG4gICAgICBcdFx0J2JhY2tncm91bmQtaW1hZ2UnOiAndXJsKCcrIHJlcy5uZXdDb3ZlciArJyknXG4gICAgICBcdH0pXG4gICAgICAgICRmb290ZXIuY3NzKHtcbiAgICAgICAgICAnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoJysgcmVzLm5ld0NvdmVyICsnKSdcbiAgICAgICAgfSkgIFxuXG4gICAgfVxuICB9KTtcblxuICB9XG5cbiAgLy8g0KHQutC40LTRi9Cy0LDQtdC8INCx0LXQutGA0LDRg9C90LQg0Lgg0LDQstCw0YLQsNGAINC/0YDQuCDQvtGC0LzQtdC90LVcbiAgdmFyIHJlc2V0UHJldmlldyA9IGZ1bmN0aW9uKCl7XG4gIFx0dmFyIGJsb2NrUGhvdG9CYWNrID0gaGVhZGVyQmFjay5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKTtcbiAgICB2YXIgZnJvbnRBdmF0YXIgPSBoZWFkZXJGcm9udC5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKS5hdHRyKCdzdHlsZScpO1xuICAgIGlmKG5ld0JhY2tHcm91bmQpe1xuICAgICAgJGhlYWRlck1haW4uY3NzKHtcbiAgICAgICAgJ2JhY2tncm91bmQtaW1hZ2UnIDogJ3VybCgnKyBuZXdCYWNrR3JvdW5kICsnKSdcbiAgICAgIH0pXG4gICAgICAkZm9vdGVyLmNzcyh7XG4gICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJyA6ICd1cmwoJysgbmV3QmFja0dyb3VuZCArJyknXG4gICAgICB9KVxuICAgIH1lbHNle1xuICAgICAgJGhlYWRlck1haW4uYXR0cignc3R5bGUnLGhlYWRlckJnU3R5bGUpO1xuICAgICAgJGZvb3Rlci5hdHRyKCdzdHlsZScsaGVhZGVyQmdTdHlsZSlcbiAgICB9ICAgIFxuICBcdGFqYXhGbGFnID0gZmFsc2U7XG4gIFx0JGhlYWRlck1haW4ucmVtb3ZlQ2xhc3MoJ2xvYWRlcicpO1xuICBcdFxuICBcdGJsb2NrUGhvdG9CYWNrLnJlbW92ZUNsYXNzKCdsb2FkZXInKTtcbiAgXHRibG9ja1Bob3RvQmFjay5hdHRyKCdzdHlsZScsZnJvbnRBdmF0YXIpO1xuXG4gIFx0Ly8kaGVhZGVyTWFpbi5hZGRDbGFzcyhjbGFzc0NhbmNlbCk7XG4gICAgYmFzZS5jbGVhclRtcCh1cmxQYXRoLHRoaXNBamF4KTtcbiAgfVxuXG5cblxuICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCDQt9Cw0L/RgNC+0YEg0L3QsCBlZGl0VXNlckRhdGFcbiAgdmFyIHJlcXVlc3RUb1NlcnZlciA9IGZ1bmN0aW9uKGUpe1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIHZhciAkaGVhZHJCYWNrID0gJGhlYWRlck1haW4uZmluZCgnLmhlYWRlcl9fc2VjdGlvbl9tYWluLWJhY2snKTtcbiAgdmFyIGlucHV0TmFtZSA9ICRoZWFkckJhY2suZmluZCgnaW5wdXRbbmFtZT1cIm5hbWVcIl0nKTtcbiAgdmFyIGlucHV0QWJvdXQgPSAkaGVhZHJCYWNrLmZpbmQoJ3RleHRhcmVhW25hbWUgPSBcImRlc2NcIl0nKTtcbiAgdmFyIG91dHB1dERhdGEgPSB7XG4gICAgdXNlck5hbWU6IGlucHV0TmFtZS52YWwoKSxcbiAgICB1c2VyQWJvdXQ6IGlucHV0QWJvdXQudmFsKClcbiAgfVxuICAkaGVhZGVyTWFpbi5maW5kKCcucHJlbG9hZF9fY29udGFpbmVyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICQuYWpheCh7XG4gICAgICB1cmw6IHVybFBhdGggKyAnZWRpdFVzZXJEYXRhLycsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IG91dHB1dERhdGEsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgLy8g0JLRi9Cy0L7QtNC40Lwg0LTQsNC90L3Ri9C1INGBINGB0LXRgNCy0LXRgNCwXG4gICAgICAgIGhlYWRlckZyb250LmZpbmQoJy51c2VyLWJsb2NrX19uYW1lJykudGV4dChyZXMubmFtZSk7XG4gICAgICAgIGhlYWRlckZyb250LmZpbmQoJy51c2VyLWJsb2NrX19kZXNjJykudGV4dChyZXMuYWJvdXQpO1xuICAgICAgICAkaGVhZGVyTWFpbi5maW5kKCcucHJlbG9hZF9fY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBoZWFkZXJGcm9udC5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKS5jc3Moe1xuICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJyA6ICd1cmwoJyArIHJlcy5hdmF0YXJGaWxlICsgJyksIHVybCguLi9pbWcvYWxidW0vbm9fcGhvdG8uanBnKSdcbiAgICAgICAgfSk7XG4gICAgICAgIG5ld0JhY2tHcm91bmQgPSByZXMuYmFja0dyb3VuZEZpbGU7XG4gICAgICAgIGNsb3NlRWRpdEhlYWRlcihlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG5cbiAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LfQsNC/0YDQvtGBINC90LAgZWRpdFVzZXJBbGJ1bURhdGFcblxuICB2YXIgcmVxdWVzdEFsYnVtVG9TZXJ2ZXIgPSBmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgaGVhZGVyRnJvbnRBbGJ1bSA9ICRoZWFkZXJBbGJ1bS5maW5kKCcuaGVhZGVyLWFsYnVtX19jb250ZW50X2Zyb250Jyk7XG4gICAgdmFyIGhlYWRlckJhY2tBbGJ1bSA9ICRoZWFkZXJBbGJ1bS5maW5kKCcuaGVhZGVyLWFsYnVtX19jb250ZW50X2JhY2snKTtcbiAgICB2YXIgaW5wdXROYW1lID0gaGVhZGVyQmFja0FsYnVtLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJyk7XG4gICAgdmFyIGlucHV0QWJvdXQgPSBoZWFkZXJCYWNrQWxidW0uZmluZCgndGV4dGFyZWFbbmFtZSA9IFwiZGVzY1wiXScpO1xuICAgIHZhciBvdXRwdXREYXRhID0ge1xuICAgICAgYWxidW1OYW1lOiBpbnB1dE5hbWUudmFsKCksXG4gICAgICBhbGJ1bUFib3V0OiBpbnB1dEFib3V0LnZhbCgpXG4gICAgfVxuICAgICRoZWFkZXJBbGJ1bS5maW5kKCcucHJlbG9hZF9fY29udGFpbmVyJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB1cmxQYXRoICsgJ2VkaXRBbGJ1bURhdGEvJyxcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgZGF0YTogb3V0cHV0RGF0YSxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpe1xuICAgICAgICAvLyDQktGL0LLQvtC00LjQvCDQtNCw0L3QvdGL0LUg0YEg0YHQtdGA0LLQtdGA0LBcbiAgICAgICAgaGVhZGVyRnJvbnRBbGJ1bS5maW5kKCcuaGVhZGVyLWFsYnVtX190aXRsZS1kZXNjcmlwdGlvbicpLnRleHQocmVzLmFsYnVtLm9yaWdpbk5hbWUpO1xuICAgICAgICBoZWFkZXJGcm9udEFsYnVtLmZpbmQoJy5oZWFkZXItYWxidW1fX3RleHQtZGVzY3JpcHRpb24nKS50ZXh0KHJlcy5hbGJ1bS5hYm91dCk7XG4gICAgICAgICRoZWFkZXJBbGJ1bS5maW5kKCcucHJlbG9hZF9fY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBuZXdCYWNrR3JvdW5kID0gcmVzLmJhY2tHcm91bmRGaWxlO1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMuYWxidW0ubmFtZSk7XG4gICAgICAgIHZhciB1cmxBcnIgPSB1cmxQYXRoLnNwbGl0KCcvJyk7XG5cbiAgICAgICAgdmFyIG5ld1VybCA9ICcvJyArIHVybEFyclsxXSArICcvJyArIHVybEFyclsyXSArICcvJyArIHJlcy5hbGJ1bS5uYW1lICsgJy8nXG4gICAgICAgIGNvbnNvbGUubG9nKG5ld1VybClcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoJycsICcnLCBuZXdVcmwpO1xuICAgICAgICBjbG9zZUVkaXRIZWFkZXIoZSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuXG4gIHZhciBfc2V0VXBsaXN0bmVyID0gZnVuY3Rpb24oKXtcbiAgXHR1cGxvYWRBdmF0YXIub24oJ2NoYW5nZScsY2hhbmdlQXZhdGFyKTtcbiAgXHR1cGxvYWRCZy5vbignY2hhbmdlJyxmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNoYW5nZUJhY2tHcm91bmQoJCh0aGlzKSwkaGVhZGVyTWFpbik7XG4gICAgfSk7XG4gICAgdXBsb2FkQmdBbGJ1bS5vbignY2hhbmdlJyxmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNoYW5nZUJhY2tHcm91bmQoJCh0aGlzKSwkaGVhZGVyQWxidW0pO1xuICAgIH0pO1xuICBcdGNhbmNlbEJ0bi5vbignY2xpY2snLHJlc2V0UHJldmlldyk7XG4gIFx0dXBsb2FkQmcub24oJ2NsaWNrJyxsb2NrU2VsRmlsZSk7XG4gIFx0dXBsb2FkQXZhdGFyLmZpbmQoJ2lucHV0Jykub24oJ2NsaWNrJyxsb2NrU2VsRmlsZSk7XG4gIFx0c2F2ZUJ0bi5vbignY2xpY2snLHJlcXVlc3RUb1NlcnZlcik7XG5cbiAgICBzYXZlQnRuQWxidW0ub24oJ2NsaWNrJyxyZXF1ZXN0QWxidW1Ub1NlcnZlcilcblxuICB9XG5cblxuICAvLyDQntCx0YnQuNC40LUg0L/QtdGA0LXQvNC10L3QvdGL0LVcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBcdF9zZXRVcGxpc3RuZXIoKTtcbiAgICB9LFxuXG4gIH07XG59KSgpOyIsIi8vID09PT09PT09PT09IGFqYXggc29jaWFsIG1vZHVsZSA9PT09PT09PT09PVxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0YHQutGA0LjQv9GC0Ysg0LrQvtGC0L7RgNGL0LUg0YDQtdC00LDQutGC0LjRgNGD0LXRgiDRgdC+0YbQuNCw0LvRjNC90YvQtSDRgdC10YLQuCDQv9C70L7Qu9GM0LfQvtCy0LDRgtC10LvRj1xuXG52YXIgYWpheFNvY2lhbE1vZHVsZSA9IChmdW5jdGlvbigpIHtcblx0Ly8g0J7QsdGK0Y/QstC70LXQvdC40LUg0LHQuNCx0LvQuNC+0YLQtdC60LhcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcblxuICAvL9Ce0LHRidC40LUg0L/QtdGA0LXQvNC10L3QvdGL0LVcblxuICAvLyDQn9GA0L7RgdC70YPRiNC60LAg0YHQvtCx0YvRgtC40LlcblxuICB2YXIgJGhlYWRlciA9ICQoJy5oZWFkZXItbWFpbicpO1xuICB2YXIgJGhlYWRlckZyb250ID0gJGhlYWRlci5maW5kKCdoZWFkZXJfX3NlY3Rpb25fbWFpbi1mcm9udCcpO1xuICB2YXIgJGhlYWRlckJhY2sgPSAkaGVhZGVyLmZpbmQoJy5oZWFkZXJfX3NlY3Rpb25fbWFpbi1iYWNrJyk7XG4gIHZhciAkaW5wdXRzID0gJGhlYWRlckJhY2suZmluZCgnLmZpZWxkJyk7XG4gIHZhciBpZCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuICAvLyDQodC+0YYu0YHQtdGC0LhcblxuICB2YXIgc29jX3ZrID0gJGlucHV0cy5maWx0ZXIoJy5pbnB1dF9fdmsnKTtcbiAgdmFyIHNvY19mYiA9ICRpbnB1dHMuZmlsdGVyKCcuaW5wdXRfX2ZhY2Vib29rJyk7XG4gIHZhciBzb2NfdHcgPSAkaW5wdXRzLmZpbHRlcignLmlucHV0X190d2l0dGVyJyk7XG4gIHZhciBzb2NfcGx1cyA9ICRpbnB1dHMuZmlsdGVyKCcuaW5wdXRfX2dvb2dsZS1wbHVzJyk7XG4gIHZhciBzb2NfZW1haWwgPSAkaW5wdXRzLmZpbHRlcignLmlucHV0X19lbWFpbCcpO1xuXG4gIHZhciBzb2Nfdmtfb2xkID0gc29jX3ZrLnZhbCgpO1xuICB2YXIgc29jX2ZiX29sZCA9IHNvY19mYi52YWwoKTtcbiAgdmFyIHNvY190d19vbGQgPSBzb2NfdHcudmFsKCk7XG4gIHZhciBzb2NfcGx1c19vbGQgPSBzb2NfcGx1cy52YWwoKTtcbiAgdmFyIHNvY19lbWFpbF9vbGQgPSBzb2NfZW1haWwudmFsKCk7XG5cbiAgLy8g0JrQvdC+0L/QutC4XG4gIHZhciB2a19zYXZlID0gc29jX3ZrLmNsb3Nlc3QoJy5mb3JtX19yb3cnKS5uZXh0KCkuZmluZCgnLnNvY2lhbC0tc2F2ZScpO1xuICB2YXIgdmtfcmVzZXQgPSBzb2NfdmsuY2xvc2VzdCgnLmZvcm1fX3JvdycpLm5leHQoKS5maW5kKCcuc29jaWFsLS1yZXNldCcpO1xuXG4gIHZhciBmYl9zYXZlID0gc29jX2ZiLmNsb3Nlc3QoJy5mb3JtX19yb3cnKS5uZXh0KCkuZmluZCgnLnNvY2lhbC0tc2F2ZScpO1xuICB2YXIgZmJfcmVzZXQgPSBzb2NfZmIuY2xvc2VzdCgnLmZvcm1fX3JvdycpLm5leHQoKS5maW5kKCcuc29jaWFsLS1yZXNldCcpO1xuXG4gIHZhciB0d19zYXZlID0gc29jX3R3LmNsb3Nlc3QoJy5mb3JtX19yb3cnKS5uZXh0KCkuZmluZCgnLnNvY2lhbC0tc2F2ZScpO1xuICB2YXIgdHdfcmVzZXQgPSBzb2NfdHcuY2xvc2VzdCgnLmZvcm1fX3JvdycpLm5leHQoKS5maW5kKCcuc29jaWFsLS1yZXNldCcpO1xuXG4gIHZhciBwbHVzX3NhdmUgPSBzb2NfcGx1cy5jbG9zZXN0KCcuZm9ybV9fcm93JykubmV4dCgpLmZpbmQoJy5zb2NpYWwtLXNhdmUnKTtcbiAgdmFyIHBsdXNfcmVzZXQgPSBzb2NfcGx1cy5jbG9zZXN0KCcuZm9ybV9fcm93JykubmV4dCgpLmZpbmQoJy5zb2NpYWwtLXJlc2V0Jyk7XG5cbiAgdmFyIGVtYWlsX3NhdmUgPSBzb2NfZW1haWwuY2xvc2VzdCgnLmZvcm1fX3JvdycpLm5leHQoKS5maW5kKCcuc29jaWFsLS1zYXZlJyk7XG4gIHZhciBlbWFpbF9yZXNldCA9IHNvY19lbWFpbC5jbG9zZXN0KCcuZm9ybV9fcm93JykubmV4dCgpLmZpbmQoJy5zb2NpYWwtLXJlc2V0Jyk7XG5cblxuICB2YXIgc2V0U29jVmFsdWUgPSBmdW5jdGlvbihlLGJ0bixzX25hbWUsc190aXRsZSl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciAkdGhpcyA9IGJ0bjtcbiAgICB2YXIgaW5wdXQgPSAkdGhpcy5jbG9zZXN0KCcuZm9ybV9fcm93JykucHJldigpLmZpbmQoJ2lucHV0Jyk7XG4gICAgdmFyIHBhdHRlckxpbmsgPSBiYXNlLlJlZ1BhdHRlcm5zLmxpbms7XG4gICAgdmFyIHBhdHRlckVtYWlsID0gYmFzZS5SZWdQYXR0ZXJucy5lbWFpbDtcbiAgICB2YXIgc29jaWFsVmVpdyA9ICQoJy5zb2NpYWwtLXZlaXcnKTtcbiAgICB2YXIgdGVzdCA9IHNvY2lhbFZlaXcuZmluZCgnLnNvY2lhbF9fJyArIHNfbmFtZSlcbiAgICB2YXIgZGF0YUlucHV0PSB7XG4gICAgICBsaW5rOiBpbnB1dC52YWwoKSxcbiAgICAgIG5hbWU6IHNfbmFtZSxcbiAgICAgIHRpdGxlOiBzX3RpdGxlLFxuICAgIH07XG5cbiAgICBcblxuICAgIGlmKCFwYXR0ZXJMaW5rLnRlc3QoaW5wdXQudmFsKCkpICYmIChzX25hbWUgIT0gJ2VtYWlsJykpe1xuICAgICAgYWxlcnQoJ9C90LUg0L/RgNCw0LLQuNC70YzQvdGL0Lkg0YTQvtGA0LzQsNGCINGB0YHRi9C70LrQuCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1lbHNlIGlmKCFwYXR0ZXJFbWFpbC50ZXN0KGlucHV0LnZhbCgpKSAmJiAoc19uYW1lID09ICdlbWFpbCcpKXtcbiAgICAgIGFsZXJ0KCfQvdC1INC/0YDQsNCy0LjQu9GM0L3Ri9C5IGVtYWlsJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJC5hamF4KHtcbiAgICAgICB1cmw6IGlkICsgJ2NoYW5nZVNvY2lhbC8nLFxuICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgIHByb2Nlc3NEYXRhOiB0cnVlLFxuICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgZGF0YTogZGF0YUlucHV0LFxuICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgIGlmKHNfbmFtZSA9PSAnZW1haWwnKXtcbiAgICAgICAgICBzb2NpYWxWZWl3LmZpbmQoJy5zb2NpYWxfXycgKyBzX25hbWUpLmF0dHIoJ2hyZWYnLCdtYWlsdG86JyArIHJlc1tkYXRhSW5wdXQubmFtZV0ubGluayk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIHNvY2lhbFZlaXcuZmluZCgnLnNvY2lhbF9fJyArIHNfbmFtZSkuYXR0cignaHJlZicscmVzW2RhdGFJbnB1dC5uYW1lXS5saW5rKTtcbiAgICAgICAgfVxuICAgICAgICBzb2NpYWxWZWl3LmZpbmQoJy5zb2NpYWxfXycgKyBzX25hbWUpLmF0dHIoJ3RpdGxlJyxyZXNbZGF0YUlucHV0Lm5hbWVdLnRpdGxlKTtcbiAgICAgICB9XG4gICAgfSk7XG4gICAgXG5cbiAgfTtcblxuICB2YXIgX3NldFVwTGlzdG5lciA9IGZ1bmN0aW9uKCl7XG5cbiAgICAvLyDQmNC60L7QvdC60Lgg0YHRgdGL0LvQvtC6INC90LAg0LPQu9Cw0LLQvdC+0LlcblxuICAgICQoJy5zb2NpYWxfX2J0bicpLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XG4gICAgICB2YXIgbGluayA9ICQodGhpcykuYXR0cignaHJlZicpO1xuICAgICAgaWYoIShsaW5rLmluZGV4T2YoJ2h0dHAnKSArIDEpKXtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyDQmtC90L7Qv9C60Lgg0YHQvtGF0YDQsNC90LjRgtGMXG4gICAgdmtfc2F2ZS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xuICAgICAgc2V0U29jVmFsdWUoZSwkKHRoaXMpLCd2aycsJ9CS0LrQvtC90YLQsNC60YLQtScpO1xuICAgIH0pXG5cbiAgICBmYl9zYXZlLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XG4gICAgICBzZXRTb2NWYWx1ZShlLCQodGhpcyksJ2ZhY2Vib29rJywnRmFjZWJvb2snKTtcbiAgICB9KVxuXG4gICAgdHdfc2F2ZS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xuICAgICAgc2V0U29jVmFsdWUoZSwkKHRoaXMpLCd0d2l0dGVyJywnVHdpdHRlcicpO1xuICAgIH0pXG5cbiAgICBwbHVzX3NhdmUub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcbiAgICAgIHNldFNvY1ZhbHVlKGUsJCh0aGlzKSwnZ29vZ2xlJywnR29vZ2xlKycpO1xuICAgIH0pXG5cbiAgICBlbWFpbF9zYXZlLm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XG4gICAgICBzZXRTb2NWYWx1ZShlLCQodGhpcyksJ2VtYWlsJywnRW1haWwnKTtcbiAgICB9KVxuXG4gICAgLy8g0JrQvdC+0L/QutCwINC+0YLQvNC10L3QuNGC0YxcblxuICAgIHZrX3Jlc2V0Lm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5mb3JtJykuZmluZCgnaW5wdXQnKS52YWwoc29jX3ZrX29sZClcbiAgICB9KVxuXG5cbiAgICBmYl9yZXNldC5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZm9ybScpLmZpbmQoJ2lucHV0JykudmFsKHNvY19mYl9vbGQpXG4gICAgfSlcblxuICAgIHR3X3Jlc2V0Lm9uKCdjbGljaycsZnVuY3Rpb24oZSl7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5mb3JtJykuZmluZCgnaW5wdXQnKS52YWwoc29jX3R3X29sZClcbiAgICB9KVxuXG4gICAgcGx1c19yZXNldC5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJCh0aGlzKS5jbG9zZXN0KCcuZm9ybScpLmZpbmQoJ2lucHV0JykudmFsKHNvY19wbHVzX29sZClcbiAgICB9KVxuXG4gICAgZW1haWxfcmVzZXQub24oJ2NsaWNrJyxmdW5jdGlvbihlKXtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICQodGhpcykuY2xvc2VzdCgnLmZvcm0nKS5maW5kKCdpbnB1dCcpLnZhbChzb2NfZW1haWxfb2xkKVxuICAgIH0pXG5cblxuICB9XG5cblxuXG5cbiBcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zZXRVcExpc3RuZXIoKTtcbiAgICB9LFxuICAgIFxuICB9O1xufSkoKTsiLCIvLyA9PT09PT09PT09PSBhamF4IEFsYnVtIGFkZCBtb2R1bGUgPT09PT09PT09PT1cbi8vINCt0YLQvtGCINC80L7QtNGD0LvRjCDRgdC+0LTQtdGA0LbQuNGCINCyINGB0LXQsdC1INGB0LrRgNC/0LjRgtGLIGFqYXgg0LTQu9GPINC00L7QsdCw0LLQu9C10L3QuNGPINCw0LvRjNCx0L7QvNC+0LJcblxudmFyIGFqYXhBbGJ1bUFkZE1vZHVsZSA9IChmdW5jdGlvbigpIHtcblx0Ly8g0J7QsdGK0Y/QstC70LXQvdC40LUg0LHQuNCx0LvQuNC+0YLQtdC60LhcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcblxuXG4gIC8vINCe0LHRidC40LUg0L/QtdGA0LXQvNC10L3QvdGL0LVcbiAgdmFyICRmb3JtID0gJCgnLnBvcHVwX19mb3JtJyk7XG4gIHZhciBtb2RhbEFkZEFsYnVtID0gJCgnLm1vZGFsX19hZGQtYWxidW0nKTtcbiAgdmFyIGlkID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICB2YXIgYnRuU2F2ZSA9IG1vZGFsQWRkQWxidW0uZmluZCgnLmFkZC1hbGJ1bV9fYnRuLXNhdmUnKTtcbiAgdmFyIGJ0bkNsb3NlID0gbW9kYWxBZGRBbGJ1bS5maW5kKCcubW9kYWxfX2hlYWRlci1jbG9zZScpO1xuICB2YXIgYnRuQ2FuY2VsID0gbW9kYWxBZGRBbGJ1bS5maW5kKCcuYWRkLWFsYnVtX19idG4tY2FuY2VsJyk7IFxuICB2YXIgcG9wdXBUaW1lID0gNTAwMDtcbiAgLy92YXIgYWxidW1Db3ZlcklucHV0ID0gbW9kYWxBZGRBbGJ1bS5maW5kKCdpbnB1dFtuYW1lPVwiYWRkQWxidW1Db3ZlclwiXScpO1xuICB2YXIgbG9hZGVyID0gJ2xvYWRlcic7XG4gIHZhciB0aGlzQWpheDtcbiAgdmFyIGNsb3NlRnVuID0gYWxidW1Nb2R1bGUuY2xvc2UoKTtcblxuICBjb25zb2xlLmxvZyhjbG9zZUZ1bik7XG5cblxuICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCBhamF4INC90LAgYWRkQWxidW1Db3ZlciAo0J/RgNC10LLRjNGOINC+0LHQu9C+0LbQutC4INCw0LvRjNCx0L7QvNCwKVxuXG4gIHZhciBhZGRBbGJ1bUNvdmVyID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIHZhciB0aGlzTW9kYWwgPSAkdGhpcy5jbG9zZXN0KG1vZGFsQWRkQWxidW0pO1xuICAgIHZhciB2ZWl3Q292ZXIgPSB0aGlzTW9kYWwuZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvJyk7XG4gICAgdmFyIGNvdmVyID0gJHRoaXNbMF0uZmlsZXNbMF07XG4gICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcblxuICAgIGJhc2UuY2hhbmdlQ2xhc3ModmVpd0NvdmVyLGxvYWRlciwnYWRkJyk7XG4gICAgdmVpd0NvdmVyLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICAgaWYoIWNvdmVyKXtcbiAgICAgIGJhc2UuY2hhbmdlQ2xhc3ModmVpd0NvdmVyLGxvYWRlciwnZGVsJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG5cbiAgICBmb3JtRGF0YS5hcHBlbmQoXCJuZXdBbGJvbUNvdmVyXCIsY292ZXIpO1xuXG4gICAgdGhpc0FqYXggPSAkLmFqYXgoe1xuICAgICAgdXJsOiBpZCArICdjaGFuZ2VQaG90by8nLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBkYXRhOiBmb3JtRGF0YSxcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgIHZlaXdDb3Zlci5jc3Moe1xuICAgICAgICAgICdiYWNrZ3JvdW5kLWltYWdlJyA6ICd1cmwoJysgcmVzLm5ld0NvdmVyICsnKSdcbiAgICAgICAgfSlcbiAgICAgICAgYmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdkZWwnKTtcblxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gICAgXG5cblxuICAgIC8vINCU0L7QsdCw0LLQu9C10L3QuNC1INCw0LvRjNCx0L7QvNCwXG4gIC8vINCe0YLQv9GA0LDQstC70Y/QtdC8IGFqYXgg0L3QsCBhZGRsYnVtXG4gIHZhciBhZGRBbGJ1bSA9IGZ1bmN0aW9uKGUpe1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgJHRoaXNNb2RhbCA9ICQodGhpcykuY2xvc2VzdCgnLm1vZGFsX19hZGQtYWxidW0nKTtcbiAgICB2YXIgdmVpd0NvdmVyID0gJHRoaXNNb2RhbC5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKTtcbiAgICB2YXIgYWxidW1OYW1lID0gJHRoaXNNb2RhbC5maW5kKCcuYWRkLWFsYnVtX19uYW1lLWlucHV0JykudmFsKCk7XG4gICAgdmFyIGFsYnVtQWJvdXQgPSAkdGhpc01vZGFsLmZpbmQoJy5hZGQtYWxidW1fX3RleHRhcmVhJykudmFsKClcblxuICAgIC8vINCU0L7QsdCw0LLQuNGC0Ywg0L/RgNC10LvQvtCw0LTQtdGAXG4gICAgXG5cbiAgICBpZih2ZWl3Q292ZXIuaGFzQ2xhc3MobG9hZGVyKSl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vINCf0LDRgNCw0LzQtdGC0YDRiyDQtNC70Y8gcG9wdXBcbiAgICB2YXIgZXJyb3JBcnJheSA9IGJhc2UudmFsaWRhdGVGb3JtKCR0aGlzTW9kYWwpOyAvLyDQn9GA0L7QstC10YDRj9C10Lwg0YLQtdC60YPRidGD0Y4g0YTQvtGA0LzRgyDQuCDQstGL0LTQsNC10Lwg0LzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0L7RiNC40LHQvtC6XG4gICAgdmFyICRlcnJvckNvbnRhaW5lciA9ICR0aGlzTW9kYWwuZmluZCgnLnBvcHVwX19lcnJvcicpO1xuICAgIGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7ICAvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxuICAgICAgZXJyb3JBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcbiAgICAgICAgYmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xuICAgICAgICBhbGVydChiYXNlLmVycm9yc1tpbmRleF0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcblxuICAgICBcblxuICAgIH1lbHNleyAvLyDQldGB0LvQuCDQvNCw0YHRgdC40LIg0L/Rg9GB0YLQvtC5LCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQsNC70YzRiNC1XG4gICAgICAkdGhpc01vZGFsLmZpbmQoJy5wcmVsb2FkX19jb250YWluZXInKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICB2YXIgb3V0cHV0RGF0YSA9IHtcbiAgICAgICAgbmFtZTogYWxidW1OYW1lLFxuICAgICAgICBhYm91dDogYWxidW1BYm91dFxuICAgICAgfVxuXG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IGlkICsgJ2FkZEFsYnVtLycsXG4gICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICBkYXRhOiBvdXRwdXREYXRhLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpe1xuICAgICAgICAgIC8vINCS0YvQstC+0LTQuNC8INC00LDQvdC90YvQtSDRgSDRgdC10YDQstC10YDQsFxuICAgICAgICAgIGlmKHJlcy5lcnJvcil7XG4gICAgICAgICAgICBhbGVydChyZXMuZXJyb3IpO1xuICAgICAgICAgICAgJHRoaXNNb2RhbC5maW5kKCcucHJlbG9hZF9fY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgJCgnLmFsYnVtLWNhcmRzX19saXN0JykucHJlcGVuZChyZXMubmV3QWxidW0pO1xuICAgICAgICAgICAgJHRoaXNNb2RhbC5maW5kKCcucHJlbG9hZF9fY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgcmVzZXRSZXEoZSk7XG5cblxuXG4gICAgICAgICAgICAvLyDQvtGH0LjRidCw0LXQvCDQvtC60L7RiNC60L4gKNCW0LXQu9Cw0YLQtdC70YzQvdC+INC/0LXRgNC00LXQu9Cw0YLRjClcblxuICAgICAgICAgICAgdmFyIHZlaXdDb3ZlciA9ICR0aGlzTW9kYWwuZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvJyk7XG4gICAgICAgICAgICB2YXIgY292ZXIgPSAkdGhpc01vZGFsLmZpbmQoJ2lucHV0W3R5cGUgPSBcImZpbGVcIl0nKTtcbiAgICAgICAgICAgIHZhciBsYWJlbFVwbG9hZCA9ICR0aGlzTW9kYWwuZmluZCgnLmxhYmVsX191cGxvYWQnKTtcbiAgICAgICAgICAgIHZhciBhbGJ1bU5hbWUgPSAkdGhpc01vZGFsLmZpbmQoJy5hZGQtYWxidW1fX25hbWUtaW5wdXQnKS52YWwoJycpO1xuICAgICAgICAgICAgdmFyIGFsYnVtQWJvdXQgPSAkdGhpc01vZGFsLmZpbmQoJy5hZGQtYWxidW1fX3RleHRhcmVhJykudmFsKCcnKVxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGNvdmVyLnJlcGxhY2VXaXRoKCBjb3ZlciA9IGNvdmVyLmNsb25lKCB0cnVlICkgKTtcbiAgICAgICAgICAgIGJhc2UuY2xlYXJUbXAoaWQsdGhpc0FqYXgpO1xuICAgICAgICAgICAgYmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdkZWwnKTtcbiAgICAgICAgICAgIHZlaXdDb3Zlci5yZW1vdmVBdHRyKCdzdHlsZScpO1xuICAgICAgICAgICAgY2xvc2VGdW4oZSk7XG5cbiAgICAgICAgICAgIC8vINCh0LrRgNC+0LvQuNC8XG4gICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCgnLmFsYnVtLWNhcmRzX19saXN0Jykub2Zmc2V0KCkudG9wIH0sIDEwMDApXG5cblxuXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTsgIFxuICAgIH1cbiAgfVxuXG4gIC8vINCe0YfQuNGJ0LDQtdC8INC/0L7Qu9GPIFxuICB2YXIgcmVzZXRSZXEgPSBmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIHZhciB0aGlzTW9kYWwgPSAkdGhpcy5jbG9zZXN0KG1vZGFsQWRkQWxidW0pO1xuICAgIHZhciB2ZWl3Q292ZXIgPSB0aGlzTW9kYWwuZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvJyk7XG4gICAgdmFyIGNvdmVyID0gdGhpc01vZGFsLmZpbmQoJ2lucHV0W3R5cGUgPSBcImZpbGVcIl0nKTtcbiAgICB2YXIgbGFiZWxVcGxvYWQgPSB0aGlzTW9kYWwuZmluZCgnLmxhYmVsX191cGxvYWQnKTtcbiAgICB2YXIgYWxidW1OYW1lID0gdGhpc01vZGFsLmZpbmQoJy5hZGQtYWxidW1fX25hbWUtaW5wdXQnKS52YWwoJycpO1xuICAgIHZhciBhbGJ1bUFib3V0ID0gdGhpc01vZGFsLmZpbmQoJy5hZGQtYWxidW1fX3RleHRhcmVhJykudmFsKCcnKVxuICAgIFxuXG4gICAgY292ZXIucmVwbGFjZVdpdGgoIGNvdmVyID0gY292ZXIuY2xvbmUoIHRydWUgKSApO1xuICAgIGJhc2UuY2xlYXJUbXAoaWQsdGhpc0FqYXgpO1xuICAgIGJhc2UuY2hhbmdlQ2xhc3ModmVpd0NvdmVyLGxvYWRlciwnZGVsJyk7XG4gICAgdmVpd0NvdmVyLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG5cbiAgfVxuXG5cbiAgICBcblxuXG5cblxuXG4gIFxuICB2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpe1xuICAgIG1vZGFsQWRkQWxidW0ub24oJ2NoYW5nZScsICdpbnB1dFtuYW1lPVwiYWRkQWxidW1Db3ZlclwiXScsYWRkQWxidW1Db3Zlcik7XG4gICAgYnRuU2F2ZS5vbignY2xpY2snLGFkZEFsYnVtKTtcbiAgICBidG5DYW5jZWwub24oJ2NsaWNrJyxyZXNldFJlcSlcbiAgICBidG5DbG9zZS5vbignY2xpY2snLHJlc2V0UmVxKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgXHRfc2V0VXBMaXN0bmVycygpO1xuICAgIH0sXG5cbiAgfTtcblxufSkoKTsiLCIvLyDQodC+0LfQtNCw0L3QuNC1INC80L7QtNGD0LvRjy5cbi8vIDEpIEPQvtC30LTQsNC10Lwg0YTQsNC50Lsg0YEg0LzQvtC00YPQu9C10Lwg0LIg0L/QsNC/0LrQtSBzb3Vyc2UvanMvbW9kdWxlc1xuLy8gMikg0JbQtdC70LDRgtC10LvRjNC90L4g0L3QsNC30YvQstCw0YLRjCDRhNCw0LnQu9GLINGBINC90LjQttC90LXQs9C+INC/0L7QtNGH0LXRgNC60LjQstCw0L3QuNGPKNCn0YLQviDQsdGLINC90LUg0L7RgtGF0L7QtNC40YLRjCDQvtGCINGC0YDQsNC00LjRhtC40LkpXG4vLyAzKSDQmtC+0L/QuNGA0YPQtdC8INGB0YLRgNGD0LrRgtGD0YDRgyDQuNC3INGE0LDQudC70LAgX2xvZ2luINC40LvQuCDQu9GO0LHQvtCz0L4g0LTRgNGD0LPQvtCy0L4g0LzQvtC00YPQu9GPKNC90L4g0L3QtSBiYXNlKS5cbi8vIDQpINCyIHJldHVybiDQvNC+0LTRg9C70Y8g0L3Rg9C20L3QviDQstGB0YLQsNCy0LjRgtGMINC+0LHRitC10LrRgiDRgSDQvNC10YLQvtC00L7QvCBpbml0LlxuLy8gNSkg0LIg0LzQtdGC0L7QtCBpbml0INC30LDQv9C40YHRi9Cy0LDQtdC8INGE0YPQvdC60YbQuNC4LCDQutC+0YLQvtGA0YvQtSDQsdGD0LTRg9GCINCy0YvQt9GL0LLQsNGC0YzRgdGPINCw0LLRgtC+0LzQsNGC0LjRh9C10YHQutC4INC/0YDQuCDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuCDQvNC+0LTRg9C70Y8uXG4vLyA2KSDQp9GC0L4g0LHRiyDQv9C+0LvRg9GH0LjRgtGMINC00L7RgdGC0YPQvyDQuiDQsdC40LHQu9C40L7RgtC10LrQtSwg0LIg0L3QsNGH0LDQu9C1INC80L7QtNGD0LvRjyDQvdGD0LbQvdC+INC10LUg0L7QsdGK0Y/QstC40YLRjCwg0L3QsNC/0LjRgNC80LXRgCDRgtCw0LogdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcbi8vINGC0LXQv9C10YDRjCDQstGB0LUg0YHQstC+0LnRgdGC0LLQsCDQuCDQvNC10YLQvtC00Ysg0LHQuNCx0LvQuNC+0YLQtdC60Lgg0LTQvtGB0YLRg9C/0L3RiyDRh9C10YDQtdC3INGC0L7Rh9C60YMsINC90LDQv9C40YDQvNC10YAg0YLQsNC6IGJhc2UuYWpheERhdGEoZm9ybSk7XG4vLyA3KSDQkiDQsdC40LHQu9C40L7RgtC10LrRgyDQvNC+0LbQvdC+INC00L7Qv9C40YHRi9Cy0LDRgtGMINCy0YHQtSDRh9GC0L4g0YPQs9C+0LTQvdC+LCDQs9C70LDQstC90L7QtSDRh9GC0L7QsdGLINGE0YPQvdC60YbQuNGPINC90LDRh9C40L3QsNC70LDRgdGMINGBIHRoaXMsINGC0LDQuiDQvNC+0LTRg9C70YwgYmFzZSDRj9Cy0LvRj9C10YLRgdGPINC60L7QvdGB0YLRgNGD0LrRgtC+0YDQvtC8LlxuLy8gOCkg0JTQu9GPINGC0L7Qs9C+INGH0YLQvtCx0Ysg0LzQvtC00YPQu9GMINGB0L7QsdGA0LDQu9GB0Y8g0LIg0L7QtNC40L0g0YTQsNC50LsgYXBwLmpzINC10LPQviDQvdGD0LbQvdC+INC/0YDQvtC/0LjRgdCw0YLRjCDQsiDQsiBndWxwZmlsZS5qcy5cbi8vINCU0L7QutGD0LzQtdC90YLQsNGG0LjRjyDQv9C+INGE0YPQvdGG0LjRj9C8IGJhc2UsINCx0YPQtNC10YIg0YfRg9GC0Ywg0L/QvtC30LbQtS4uLlxuXG5cblxuJCggZG9jdW1lbnQgKS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICB2YXIgYmFzZSA9IG5ldyBCYXNlTW9kdWxlOyAvLyDQmNC90LjRhtC40LDQu9C40LfQuNGA0YPQtdC8INCx0LjQsdC70LjQvtGC0LXQutGDLiAo0J/QvtC60LAg0L3QtSDQvdGD0LbQvdC+KVxuICAgIGNvbW1vbk1vZHVsZS5pbml0KCk7XG4gICAgYWxidW1Nb2R1bGUuaW5pdCgpO1xuICAgIC8vINCQ0L3QuNC80LDRhtC40LhcbiAgICBsb2dpbkNvdmVyTW9kdWxlLmluaXQoKTtcbiAgICBoZWFkZXJNb2R1bGUuaW5pdCgpO1xuICAgIGFsYnVtQWRkTW9kdWxlLmluaXQoKTtcbiAgICAvLyBhamF4XG4gICAgYWpheExvZ2luQ292ZXJNb2R1bGUuaW5pdCgpO1xuICAgIGFqYXhIZWFkZXJNb2R1bGUuaW5pdCgpO1xuICAgIGFqYXhTb2NpYWxNb2R1bGUuaW5pdCgpO1xuICAgIGFqYXhBbGJ1bUFkZE1vZHVsZS5pbml0KCk7XG5cbn0pO1xuXG5cdC8vINCa0LDRgdGC0L7QvNC90YvQuSDQstC40LQg0LTQu9GPINC30LDQs9GA0YPQt9C60Lgg0YTQsNC50LvQvtCyXG5cdChmdW5jdGlvbigpIHtcblx0XHR2YXIgZWwgPSAkKCcudXBsb2FkJyk7XG5cblx0XHRpZihlbC5sZW5ndGggPT09IDApIHJldHVybjtcblxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcudXBsb2FkJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIGVsICAgID0gJCh0aGlzKTtcblx0XHRcdHZhciBpbnB1dCA9IGVsLmNoaWxkcmVuKCdbdHlwZT1maWxlXScpO1xuXG5cdFx0XHRpbnB1dFswXS5jbGljaygpO1xuXHRcdH0pO1xuXHR9KSgpOyJdfQ==

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
		base.changeClass('.modal_add-photo, .modal-overlay','hide','del')
	};
	// Открыть окно для добавления альбомов
  var openUploadAlbum = function(){
    base.changeClass('.modal__add-album, .modal-overlay','hide','del')
  };
	// Закрыть окно
	var closeUpload = function(e){
		e.preventDefault();
		var modal = $(this).closest('.modal');
		base.changeClass(modal,'hide','add');
		base.changeClass('.modal-overlay','hide','add');
		$(".img-list").empty();
		$(".slider__item").remove();
		$('.modal__load-img').show();
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
		alert("Отменить загрузку?");
		$(this).remove();
		console.log($('.img-list li').length);
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


	// Отправляем ajax на addAlbumCover

	albumCoverInput.on('change',function(){
		var $this = $(this);
		var thisModal = $this.closest($modalAddAlbum);
		var veiwCover = thisModal.find('.user-block__photo');
		var id = window.location.pathname;
		var cover = $this[0].files[0];
		var formData = new FormData();
		var xhr = new XMLHttpRequest;

		
		formData.append("albumCover",cover);
		xhr.open('POST', id + 'addAlbumCover/',true);
    xhr.send(formData);
    base.changeClass(veiwCover,loader,'add');
    veiwCover.removeAttr('style');
    if(!cover){
    	base.changeClass(veiwCover,loader,'del');
    	return;
    }
    
    xhr.onreadystatechange = function() {

      if (xhr.readyState != 4) return;

      if (xhr.status == 200) {
      	
      	var data = JSON.parse(xhr.response);
      	veiwCover.css({
      		'background-image' : 'url('+ data.newAlbomCover.replace('./users','') +')'
      	})
      	base.changeClass(veiwCover,loader,'del');
      }
     }

	})

	// Добавление альбома
  // Отправляем ajax на addlbum
  $modalAddAlbum.find(button).on('click', function(e){
    e.preventDefault();
    var $thisForm = $(this).closest('form');
    var veiwCover = $thisForm.find('.user-block__photo');
    if(veiwCover.hasClass(loader)){
    	return;
    }
    // Параметры для popup
    var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
    var $errorContainer = $thisForm.find('.popup__error');
    if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
      errorArray.forEach(function(index){
        //base.showError(index,$errorContainer, popupTime);
        alert(base.errors[index]);
        return false;
      });
    }else{ // Если массив пустой, выполняем дальше
      var id = window.location.pathname;
      //servAns = base.ajax($thisForm, id + 'addAlbum/');
    	var formData = new FormData();
      formData.append("albumName",$thisForm.find('.add-album__name-input').val());
			formData.append("albumText",$thisForm.find('.add-album__textarea').val());
      formData.append("albumCover",$thisForm.find('.btn__upload')[0].files[0]);


			var xhr = new XMLHttpRequest;
      xhr.open('POST', id + 'addAlbum/',true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status == 200) {
        	var data = JSON.parse(xhr.response);
        	$(data.newAlbum).prependTo($('.album-cards__list'));
        	
        }
      }
      
    }

  });



// Слайдер
var funcSlider = function() {
	var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd';

	function Slider(options) {
		var gallery     = options.elem;
		var prev        = gallery.find('.slider__control--prev');
		var next        = gallery.find('.slider__control--next');

		var slides         = gallery.find('.slider__item');
		console.log(slides);
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

	var openSlider = function(){
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
		$('.btn_album-add').on('click', openUploadImg);
		$('.btn_album-main-add').on('click', openUploadAlbum);
		$('.btn_edit-photo').on('click', openEditPhoto);
		$('.modal__header-close').on('click', closeUpload);
		$(window).on('scroll', _fixedAdd);
		$('body').on('click','.img-item',_cancelLoad);
		$('.loupe').on('click', openSlider);
	};


  return {
    init: function () {
    	_setUpListners();
    },

  };
})();
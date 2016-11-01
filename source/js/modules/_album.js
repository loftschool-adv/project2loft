// =========== Album module ===========
// Этот модуль содержит в себе скрипты которые используються только на странице альбомов.

var albumModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;


	// Открыть окно для загрузки изображений
	var openUpload = function(){
		base.changeClass('.modal-container','hide','del')
	};


	// Закрыть окно для загрузки изображений
	var closeUpload = function(){
		base.changeClass('.modal-container','hide','add')
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


	var _setUpListners = function() {
		$('.btn_album-add').on('click', openUpload);
		$('.modal__header-close').on('click', closeUpload);
		$(window).on('scroll', _fixedAdd);
	};

	

  return {
    init: function () {
    	_setUpListners();
    }

  };
})();
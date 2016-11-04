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

	// Анимация для редактирования хедера
	var editAllHeader = (function() {

		var $this,
				front,
				back,
				headerBottom,
				headerBottomEdit;

		var _setUpListners = function() {
			$('.btn_edit-header').on('click', _editHeader);
			$('#cancel_edit_header').on('click', _returnHeader);
			$('.btn--save').on('click', _returnHeader);
		};

		var _editHeader = function() {

			$this = $(this);
			front = $this.closest('.header__section');
			back = front.next();
			headerBottom = front.parent().siblings().children('.header-bottom-front');
			headerBottomEdit  = headerBottom.prev();

			back.css('transform','translateY(0)');
			headerBottomEdit.css('transform','translateY(0)');
			front.fadeOut(500);
			$('.header-edit-overlay').fadeIn(500);
			headerBottom.fadeOut(500);
		}
		var _returnHeader = function(ev) {
			ev.preventDefault();
			back.css('transform','translateY(-100%)');
			headerBottomEdit.css('transform','translateY(100%)');
			front.fadeIn(500);
			$('.header-edit-overlay').fadeOut(500);
			headerBottom.fadeIn(500);
		}
		return{
			init : function() {
				_setUpListners();
			},
		}
});


	var _setUpListners = function() {
		$('.btn_album-add').on('click', openUpload);
		$('.modal__header-close').on('click', closeUpload);
		$(window).on('scroll', _fixedAdd);
	};

	

  return {
  	edit: editAllHeader(),
    init: function () {
    	_setUpListners();
    },
    
  };
})();
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
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
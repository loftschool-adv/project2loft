(function(){


	 $('.popup__link_registr').click(function(e){
	 	e.preventDefault();
 	$('.flipper-container').addClass('flipp');
 });
	 $('.popup__link_enter').click(function(e){
	 	e.preventDefault();
 	$('.flipper-container').removeClass('flipp');
 });
	})();
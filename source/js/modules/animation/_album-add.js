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
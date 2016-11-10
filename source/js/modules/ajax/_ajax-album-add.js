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
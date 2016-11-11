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